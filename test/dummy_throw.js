/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
const AMule = require("../");

class DummyThrow extends AMule.Layer {
	constructor(data, name) {
		super();
		this.name = name || "";
		this.data = data || {};
	}

	_has(key, field, callback) {
		throw new Error("_has");
	};

	_get(key, field, callback) {
		throw new Error("_get");
	};

	_set(key, field, value, callback) {
		throw new Error("_set");
	};

	_delete(key, field, callback) {
		throw new Error("_delete");
	};

	_clear(callback) {
		throw new Error("_clear");
	};
}

module.exports = DummyThrow;
