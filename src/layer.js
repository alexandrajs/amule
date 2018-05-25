/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";

/**
 *
 * @constructor
 */
class Layer {
	constructor() {
		/**
		 *
		 * @type {Layer|null}
		 */
		this.next = null;
		this.clearStats();
	}

	_next(err, name, args, callback) {
		const next = this.next;
		if (next !== null) {
			args.push(callback);
			return next[name].apply(next, args);
		}
		callback(err, null);
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	has(key, field, callback) {
		this._has(key, field, callback);
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	get(key, field, callback) {
		this._get(key, field, (err, value) => {
			if (!err && value !== null) {
				this.stats.hits += 1;
				return callback(null, value);
			}
			this.stats.misses += 1;
			this._next(err, "get", [
				key,
				field
			], (err, value) => {
				if (err) {
					return callback(err, value);
				}
				this._set(key, field, value, () => {
					callback(null, value);
				});
			});
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {*} value
	 * @param {function} callback
	 */
	set(key, field, value, callback) {
		this._set(key, field, value, (err) => {
			this._next(err, "set", [
				key,
				field,
				value
			], callback);
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	delete(key, field, callback) {
		this._delete(key, field, (err) => {
			this._next(err, "delete", [
				key,
				field
			], callback);
		});
	}

	/**
	 * @param {function} callback
	 */
	clear(callback) {
		this._clear((err) => {
			this._next(err, "clear", [], callback);
		});
	}

	/**
	 * @param [clear]
	 * @returns {{hits: number, misses: number}}
	 */
	getStats(clear) {
		const stats = this.stats;
		stats.ratio = stats.hits / (stats.misses + stats.hits);
		if (clear) {
			this.clearStats();
		}
		return stats;
	}

	/**
	 *
	 */
	clearStats() {
		this.stats = {
			hits: 0,
			misses: 0,
			ratio: 0
		};
	}
}

module.exports = Layer;
