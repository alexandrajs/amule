"use strict";
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const AMule = require("../");
const assert = require("assert");
describe("chain manipulation", () => {
	it("push", () => {
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
	it("pop", () => {
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
	it("unshift", () => {
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
	it("shift", () => {
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
