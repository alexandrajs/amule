'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
/**
 *
 * @type {utls}
 * @see https://github.com/ponury-kostek/utls
 */
const utls = require('utls');
/**
 *
 * @type {Yadll}
 * @see https://github.com/ponury-kostek/yadll
 */
const Yadll = require('yadll');
/**
 * AlexandraJS MultiLayer Cache
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 * @param options
 * @property {Object} options
 * @property {Yadll} chain
 * @constructor
 */
function MLC(options) {
	this.options = utls.extend({}, options || {});
	this.chain = new Yadll();
}
/**
 *
 * @param key
 * @param callback
 */
MLC.prototype.get = function (key, callback) {
	callCacheMethod(this, 'get', arguments);
};
/**
 *
 * @param key
 * @param value
 * @param callback
 */
MLC.prototype.set = function (key, value, callback) {
	callCacheMethod(this, 'set', arguments);
};
/**
 *
 * @param key
 * @param callback
 */
MLC.prototype.has = function (key, callback) {
	callCacheMethod(this, 'has', arguments);
};
/**
 *
 * @param key
 * @param callback
 */
MLC.prototype.delete = function (key, callback) {
	callCacheMethod(this, 'delete', arguments);
};
/**
 * Adds new cache at end of cache chain
 * @param {Object} cache Cache to be used in cache chain
 * @returns {Object}
 */
MLC.prototype.push = function (cache) {
	if (this.chain.tail !== null) {
		this.chain.tail.value.next = cache;
	}
	this.chain.push(cache);
	return cache;
};
/**
 * Alias of `MLC.push`
 * @see {MLC.push}
 */
MLC.prototype.use = MLC.prototype.push;
/**
 * Cuts cache from end of cache chain
 * @returns {Object|null}
 */
MLC.prototype.pop = function () {
	const cache = this.chain.pop();
	if(cache !== null) {
		if(cache.prev !== null) {
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
MLC.prototype.unshift = function (cache) {
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
MLC.prototype.shift = function () {
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
MLC.prototype.clear = function (callback) {
	callCacheMethod(this, 'clear', arguments);
};
/**
 *
 * @type {MLC}
 */
module.exports = MLC;
/**
 *
 * @param cache
 * @param name
 * @param args
 * @returns {*}
 */
function callCacheMethod(cache, name, args) {
	if (cache.chain.head === null) {
		return args[args.length - 1](new Error('Cache chain is empty'));
	}
	cache.chain.head.value[name].apply(cache.chain.head.value, args);
}
