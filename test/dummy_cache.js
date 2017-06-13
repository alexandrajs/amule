'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const MLC = require('../');
const mlc = new MLC();
const assert = require('assert');
const dc1 = new DummyCache({k1: 'k1l1'}, 'l1');
const dc2 = new DummyCache({k2: 'k2l2'}, 'l2');
const dc3 = new DummyCache({}, 'l3');
mlc.use(dc1);
mlc.use(dc2);
mlc.use(dc3);
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
describe('chain manipulation', () => {
	it('push', () => {
		const mlc = new MLC();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		assert.strictEqual(mlc.push(c1), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mlc.push(c2), c2);
		assert.strictEqual(c1.next, c2);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(mlc.push(c3), c3);
		assert.strictEqual(c1.next, c2);
		assert.strictEqual(c2.next, c3);
		assert.strictEqual(c3.next, null);
	});
	it('pop', () => {
		const mlc = new MLC();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		mlc.push(c1);
		mlc.push(c2);
		mlc.push(c3);
		assert.strictEqual(mlc.pop(), c3);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(c3.next, null);
		assert.strictEqual(mlc.pop(), c2);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(mlc.pop(), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mlc.pop(), null);
	});
	it('unshift', () => {
		const mlc = new MLC();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		assert.strictEqual(mlc.unshift(c1), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mlc.unshift(c2), c2);
		assert.strictEqual(c2.next, c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mlc.unshift(c3), c3);
		assert.strictEqual(c3.next, c2);
		assert.strictEqual(c2.next, c1);
		assert.strictEqual(c1.next, null);
	});
	it('shift', () => {
		const mlc = new MLC();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		mlc.unshift(c1);
		mlc.unshift(c2);
		mlc.unshift(c3);
		assert.strictEqual(mlc.shift(), c3);
		assert.strictEqual(c3.next, null);
		assert.strictEqual(mlc.shift(), c2);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(mlc.shift(), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mlc.shift(), null);
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