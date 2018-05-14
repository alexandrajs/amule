/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
const AMule = require("../");

class DummyCache extends AMule.Layer {
	constructor(data, name) {
		super();
		this.name = name || "";
		this.data = data || {};
	}

	_has(key, field, callback) {
		process.nextTick(() => callback(null, !!(this.data[key] && this.data[key][field])));
	};

	_get(key, field, callback) {
		process.nextTick(() => callback(null, this.data[key] && this.data[key][field] || null));
	};

	_set(key, field, value, callback) {
		process.nextTick(() => {
			if (!this.data[key]) {
				this.data[key] = {};
			}
			this.data[key][field] = value;
			callback(null, true);
		});
	};

	_delete(key, field, callback) {
		process.nextTick(() => {
			if (this.data[key] && this.data[key][field]) {
				delete this.data[key][field];
			}
			return callback(null, true);
		});
	};

	_clear(callback) {
		process.nextTick(() => {
			this.data = {};
			return callback(null, true);
		});
	};
}

module.exports = DummyCache;
