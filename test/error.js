"use strict";
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const AMule = require("../");
const DummyThrow = require("./dummy_throw");
const assert = require("assert");
describe("error", () => {
	const mule = new AMule();
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
describe("throw", () => {
	const mule = new AMule();
	const dummy = new DummyThrow();
	mule.use(dummy);
	describe("if empty", () => {
		it("has", (done) => {
			mule.has("key", function (err, has) {
				assert(err instanceof Error);
				assert.strictEqual(err.message, "Cache internal error: _has");
				assert.strictEqual(has, undefined);
				done();
			});
		});
		it("get", (done) => {
			mule.get("key", function (err, value) {
				assert(err instanceof Error);
				assert.strictEqual(err.message, "Cache internal error: _get");
				assert.strictEqual(value, undefined);
				done();
			});
		});
		it("set", (done) => {
			mule.set("key", "value", function (err) {
				assert(err instanceof Error);
				assert.strictEqual(err.message, "Cache internal error: _set");
				done();
			});
		});
		it("delete", (done) => {
			mule.delete("key", function (err) {
				assert(err instanceof Error);
				assert.strictEqual(err.message, "Cache internal error: _delete");
				done();
			});
		});
		it("clear", (done) => {
			mule.clear(function (err) {
				assert(err instanceof Error);
				assert.strictEqual(err.message, "Cache internal error: _clear");
				done();
			});
		});
	});
});
