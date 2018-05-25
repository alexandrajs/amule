/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
const AMule = require("../");
const DummyCache = require("./dummy");
const assert = require("assert");
describe("Layer", () => {
	describe("One layer", () => {
		it("has", (done) => {
			let mule = new AMule();
			mule.use(new DummyCache({}, "l1"));
			mule.has("key", "field", function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				mule.set("key", "field", "value", (err) => {
					assert.strictEqual(err, null);
					mule.has("key", "field", function (err, has) {
						assert.strictEqual(err, null);
						assert.strictEqual(has, true);
						done();
					});
				});
			});
		});
		it("set", (done) => {
			let mule = new AMule();
			mule.use(new DummyCache({}, "l1"));
			mule.set("key", "field", "value", (err) => {
				assert.strictEqual(err, null);
				mule.has("key", "field", (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					done();
				});
			});
		});
		it("get", (done) => {
			let mule = new AMule();
			mule.use(new DummyCache({}, "l1"));
			mule.get("key", "field", function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				mule.set("key", "field", "value", (err) => {
					assert.strictEqual(err, null);
					mule.get("key", "field", function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, "value");
						done();
					});
				});
			});
		});
		it("delete", (done) => {
			let mule = new AMule();
			mule.use(new DummyCache({}, "l1"));
			mule.set("key", "field", "value", (err) => {
				assert.strictEqual(err, null);
				mule.has("key", "field", (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.delete("key", "field", function (err) {
						assert.strictEqual(err, null);
						mule.has("key", "field", (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it("clear", (done) => {
			let mule = new AMule();
			mule.use(new DummyCache({}, "l1"));
			mule.set("key", "field", "value", (err) => {
				assert.strictEqual(err, null);
				mule.has("key", "field", (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.clear(function (err) {
						assert.strictEqual(err, null);
						mule.has("key", "field", (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it("stats", (done) => {
			let mule = new AMule();
			const rush = new DummyCache({}, "l1");
			mule.use(rush);
			mule.get("key", "field", function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				const stats = rush.getStats();
				assert.strictEqual(stats.misses, 1);
				assert.strictEqual(stats.ratio, 0);
				assert.strictEqual(stats.hits, 0);
				mule.set("key", "field", "value", (err) => {
					assert.strictEqual(err, null);
					mule.get("key", "field", function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, "value");
						let stats = rush.getStats(true);
						assert.strictEqual(stats.misses, 1);
						assert.strictEqual(stats.ratio, 0.5);
						assert.strictEqual(stats.hits, 1);
						stats = rush.getStats();
						assert.strictEqual(stats.misses, 0);
						assert.strictEqual(stats.ratio, NaN);
						assert.strictEqual(stats.hits, 0);
						done();
					});
				});
			});
		});
	});
	describe("Two layers", () => {
		it("has", (done) => {
			const mule = new AMule(), d1 = new DummyCache({}, "l1"), d2 = new DummyCache({}, "l2");
			mule.use(d1);
			mule.use(d2);
			d2.has("key", "field", function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				mule.set("key", "field", "value", (err) => {
					assert.strictEqual(err, null);
					d2.has("key", "field", function (err, has) {
						assert.strictEqual(err, null);
						assert.strictEqual(has, true);
						done();
					});
				});
			});
		});
		it("set", (done) => {
			const mule = new AMule(), d1 = new DummyCache({}, "l1"), d2 = new DummyCache({}, "l2");
			mule.use(d1);
			mule.use(d2);
			mule.set("key", "field", "value", (err) => {
				assert.strictEqual(err, null);
				d2.has("key", "field", (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					done();
				});
			});
		});
		it("get", (done) => {
			const mule = new AMule(), d1 = new DummyCache({}, "l1"), d2 = new DummyCache({}, "l2");
			mule.use(d1);
			mule.use(d2);
			d2.get("key", "field", function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				d2.set("key", "field", "value", (err) => {
					assert.strictEqual(err, null);
					mule.get("key", "field", function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, "value");
					});
					mule.get("key", "field", function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, "value");
						done();
					});
				});
			});
		});
		it("delete", (done) => {
			const mule = new AMule(), d1 = new DummyCache({}, "l1"), d2 = new DummyCache({}, "l2");
			mule.use(d1);
			mule.use(d2);
			mule.set("key", "field", "value", (err) => {
				assert.strictEqual(err, null);
				d2.has("key", "field", (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.delete("key", "field", function (err) {
						assert.strictEqual(err, null);
						d2.has("key", "field", (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it("clear", (done) => {
			const mule = new AMule(), d1 = new DummyCache({}, "l1"), d2 = new DummyCache({}, "l2");
			mule.use(d1);
			mule.use(d2);
			mule.set("key", "field", "value", (err) => {
				assert.strictEqual(err, null);
				d2.has("key", "field", (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.clear(function (err) {
						assert.strictEqual(err, null);
						d2.has("key", "field", (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
	});
});
