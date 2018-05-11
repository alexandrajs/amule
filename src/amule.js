"use strict";
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const fast = require("fast.js");
const ExtError = require("exterror");
/**
 *
 * @type {Yadll}
 * @see https://github.com/ponury-kostek/yadll
 */
const Yadll = require("yadll");

/**
 * AlexandraJS MultiLayer Cache
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 * @param options
 * @property {Object} options
 * @property {Yadll} chain
 * @constructor
 */
function AMule(options) {
	this.options = fast.assign({}, options || {});
	this.chain = new Yadll();
}

/**
 *
 * @param key
 * @param field
 * @param callback
 */
AMule.prototype.get = function (key, field, callback) {
	callCacheMethod(this, "get", arguments);
};
/**
 *
 * @param key
 * @param field
 * @param value
 * @param callback
 */
AMule.prototype.set = function (key, field, value, callback) {
	callCacheMethod(this, "set", arguments);
};
/**
 *
 * @param key
 * @param field
 * @param callback
 */
AMule.prototype.has = function (key, field, callback) {
	callCacheMethod(this, "has", arguments);
};
/**
 *
 * @param key
 * @param field
 * @param callback
 */
AMule.prototype.delete = function (key, field, callback) {
	callCacheMethod(this, "delete", arguments);
};
/**
 * Adds new cache at end of cache chain
 * @param {Object} cache Cache to be used in cache chain
 * @returns {Object}
 */
AMule.prototype.push = function (cache) {
	if (this.chain.tail !== null) {
		this.chain.tail.value.next = cache;
	}
	this.chain.push(cache);
	return cache;
};
/**
 * Alias of `AMule.push`
 * @see {AMule.push}
 */
AMule.prototype.use = AMule.prototype.push;
/**
 * Cuts cache from end of cache chain
 * @returns {Object|null}
 */
AMule.prototype.pop = function () {
	const cache = this.chain.pop();
	if (cache !== null) {
		if (cache.prev !== null) {
			cache.prev.value.next = null;
		}
		return cache.value;
	}
	return cache;
};
/**
 * Adds new cache at begin of cache chain
 * @param {Object} cache
 * @returns {Object}
 */
AMule.prototype.unshift = function (cache) {
	if (this.chain.head !== null) {
		cache.next = this.chain.head.value;
	}
	this.chain.unshift(cache);
	return cache;
};
/**
 * Cuts cache from end of cache chain
 * @returns {Object|null}
 */
AMule.prototype.shift = function () {
	const cache = this.chain.shift();
	if (cache !== null) {
		cache.value.next = null;
		return cache.value;
	}
	return cache;
};
/**
 *
 * @param callback
 */
AMule.prototype.clear = function (callback) {
	callCacheMethod(this, "clear", arguments);
};
/**
 *
 * @type {AMule}
 */
module.exports = AMule;

/**
 *
 * @param cache
 * @param name
 * @param args
 * @returns {*}
 */
function callCacheMethod(cache, name, args) {
	if (cache.chain.head === null) {
		return args[args.length - 1](new ExtError("ERR_EMPTY_CACHE_CHAIN", "Cache chain is empty"));
	}
	cache.chain.head.value[name].apply(cache.chain.head.value, args);
}
