'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const MLC = require('../');
const mlc = new MLC();
const assert = require('assert');
describe('error', () => {
	describe('if empty', () => {
		it('has', (done) => {
			mlc.has('key', function (err, has) {
				assert.notStrictEqual(err, null);
				assert.strictEqual(has, undefined);
				done();
			});
		});
		it('get', (done) => {
			mlc.get('key', function (err, value) {
				assert.notStrictEqual(err, null);
				assert.strictEqual(value, undefined);
				done();
			});
		});
		it('set', (done) => {
			mlc.set('key', 'value', function (err) {
				assert.notStrictEqual(err, null);
				done();
			});
		});
		it('delete', (done) => {
			mlc.delete('key', function (err) {
				assert.notStrictEqual(err, null);
				done();
			});
		});
		it('clear', (done) => {
			mlc.clear(function (err) {
				assert.notStrictEqual(err, null);
				done();
			});
		});
	});
});
