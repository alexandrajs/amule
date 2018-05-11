/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";

/**
 *
 * @constructor
 */
function Layer() {
	/**
	 *
	 * @type {Layer|null}
	 */
	this.next = null;
	this.clearStats();
}

Layer.prototype._next = function (err, name, args, callback) {
};
/**
 *
 * @param {string} key
 * @param {string} field
 * @param {function} callback
 */
Layer.prototype.has = function (key, field, callback) {
	this._has(key, field, (err, value) => {
		if (err || value === null) {
			return callback(null, false);
		}
		callback(null, true);
	});
};
/**
 *
 * @param {string} key
 * @param {string} field
 * @param {function} callback
 */
Layer.prototype.get = function (key, field, callback) {
	this._get(key, field, (err, value) => {
		if (!err && value !== null) {
			this.stats.hits++;
			return callback(null, value);
		}
		this.stats.misses++;
		this._next(err, "get", [
			key,
			field
		], (err, value) => {
			this._set(key, field, value, () => {
				callback(null, value);
			});
		});
	});
};
/**
 *
 * @param {string} key
 * @param {string} field
 * @param {*} value
 * @param {function} callback
 */
Layer.prototype.set = function (key, field, value, callback) {
	this._set(key, field, value, (err) => {
		this._next(err, "set", [
			key,
			field,
			value
		], callback);
	});
};
/**
 *
 * @param {string} key
 * @param {string} field
 * @param {function} callback
 */
Layer.prototype.delete = function (key, field, callback) {
	this._delete(key, field, (err) => {
		this._next(err, "set", [
			key,
			field,
			value
		], callback);
	});
};
/**
 * @param {function} callback
 */
Layer.prototype.clear = function (callback) {
	this._clear((err) => {
		this._next(err, "set", [], callback);
	});
};
/**
 * @param [clear]
 * @returns {{hits: number, misses: number}}
 */
Layer.prototype.getStats = function (clear) {
	const stats = this.stats;
	stats.ratio = stats.hits && stats.misses ? stats.hits / stats.misses : 0;
	if (clear) {
		this.clearStats();
	}
	return stats;
};
/**
 *
 */
Layer.prototype.clearStats = function () {
	this.stats = {
		hits: 0,
		misses: 0
	};
};
module.exports = Layer;
