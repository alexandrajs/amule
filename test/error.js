"use strict";
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const AMule = require("../");
const mule = new AMule();
const assert = require("assert");
describe("error", () => {
	describe("if empty", () => {
		it("has", (done) => {
			mule.has("key", function (err, has) {
				assert.notStrictEqual(err, null);
				assert.strictEqual(has, undefined);
				done();
			});
		});
		it("get", (done) => {
			mule.get("key", function (err, value) {
				assert.notStrictEqual(err, null);
				assert.strictEqual(value, undefined);
				done();
			});
		});
		it("set", (done) => {
			mule.set("key", "value", function (err) {
				assert.notStrictEqual(err, null);
				done();
			});
		});
		it("delete", (done) => {
			mule.delete("key", function (err) {
				assert.notStrictEqual(err, null);
				done();
			});
		});
		it("clear", (done) => {
			mule.clear(function (err) {
				assert.notStrictEqual(err, null);
				done();
			});
		});
	});
});
