'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const MLC = require('../');
const mlc = new MLC();
const assert = require('assert');
mlc.use(new DummyCache({k1: 'k1l1'}, 'l1'));
mlc.use(new DummyCache({k2: 'k2l2'}, 'l2'));
describe('Dummy delayed cache', () => {
	it('get lvl1', (done) => {
		mlc.get('k1', function (err, value) {
			assert.strictEqual(err, null);
			assert.strictEqual(value, 'k1l1');
			done();
		});
	});
	it('get lvl2', (done) => {
		mlc.get('k2', function (err, value) {
			assert.strictEqual(err, null);
			assert.strictEqual(value, 'k2l2');
			done();
		});
	});
	it('get non existing', (done) => {
		mlc.get('k3', function (err, value) {
			assert.equal(err, null);
			assert.strictEqual(value, null);
			done();
		});
	});
});
function DummyCache(data, name) {
	this.name = name;
	this.data = data;
	this.next = null;
}
DummyCache.prototype.get = function (key, callback) {
	process.nextTick(() => {
		if (this.data[key]) {
			return callback(null, this.data[key]);
		}
		if (this.next) {
			return this.next.get(key, (err, value) => {
				if (err) {
					return callback(err);
				}
				this.data[key] = value;
				callback(null, value);
			});
		}
		callback(null, null);
	}, 1);
};