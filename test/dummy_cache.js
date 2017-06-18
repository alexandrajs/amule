'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const AMule = require('../');
const mule = new AMule();
const assert = require('assert');
const dc1 = new DummyCache({k1: {f1: 'k1l1'}}, 'l1');
const dc2 = new DummyCache({k2: {f2: 'k2l2'}}, 'l2');
const dc3 = new DummyCache({}, 'l3');
mule.use(dc1);
mule.use(dc2);
mule.use(dc3);
describe('Dummy delayed cache', () => {
	it('get lvl1', (done) => {
		mule.get('k1', 'f1', function (err, value) {
			assert.strictEqual(err, null);
			assert.strictEqual(value, 'k1l1');
			done();
		});
	});
	it('get lvl2', (done) => {
		mule.get('k2', 'f2', function (err, value) {
			assert.strictEqual(err, null);
			assert.strictEqual(value, 'k2l2');
			done();
		});
	});
	it('get non existing', (done) => {
		mule.get('k3', 'f3', function (err, value) {
			assert.equal(err, null);
			assert.strictEqual(value, null);
			done();
		});
	});
});
describe('chain manipulation', () => {
	it('push', () => {
		const mule = new AMule();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		assert.strictEqual(mule.push(c1), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mule.push(c2), c2);
		assert.strictEqual(c1.next, c2);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(mule.push(c3), c3);
		assert.strictEqual(c1.next, c2);
		assert.strictEqual(c2.next, c3);
		assert.strictEqual(c3.next, null);
	});
	it('pop', () => {
		const mule = new AMule();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		mule.push(c1);
		mule.push(c2);
		mule.push(c3);
		assert.strictEqual(mule.pop(), c3);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(c3.next, null);
		assert.strictEqual(mule.pop(), c2);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(mule.pop(), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mule.pop(), null);
	});
	it('unshift', () => {
		const mule = new AMule();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		assert.strictEqual(mule.unshift(c1), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mule.unshift(c2), c2);
		assert.strictEqual(c2.next, c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mule.unshift(c3), c3);
		assert.strictEqual(c3.next, c2);
		assert.strictEqual(c2.next, c1);
		assert.strictEqual(c1.next, null);
	});
	it('shift', () => {
		const mule = new AMule();
		const c1 = {next: null}, c2 = {next: null}, c3 = {next: null};
		mule.unshift(c1);
		mule.unshift(c2);
		mule.unshift(c3);
		assert.strictEqual(mule.shift(), c3);
		assert.strictEqual(c3.next, null);
		assert.strictEqual(mule.shift(), c2);
		assert.strictEqual(c2.next, null);
		assert.strictEqual(mule.shift(), c1);
		assert.strictEqual(c1.next, null);
		assert.strictEqual(mule.shift(), null);
	});
});
function DummyCache(data, name) {
	this.name = name;
	this.data = data;
	this.next = null;
}
DummyCache.prototype.get = function (key, field, callback) {
	process.nextTick(() => {
		if (this.data[key] && this.data[key][field]) {
			return callback(null, this.data[key][field]);
		}
		if (this.next) {
			return this.next.get(key, field, (err, value) => {
				if (err) {
					return callback(err);
				}
				if(!this.data[key]) {
					this.data[key] = {};
				}
				this.data[key][field] = value;
				callback(null, value);
			});
		}
		callback(null, null);
	}, 1);
};