"use strict";

var crypto = require('crypto');

// Constants
var SALT_SIZE = 128;
var HASH_SIZE = 256;
var ITERATIONS = 7000;

var pcrypt = {};

/**
 * Generates a salt.
 * @param {function} callback - Callback function once the salt is generated. Should take the salt string as its one argument.
 * @throws Throws exception on crypto.randomBytes failure.
 */
pcrypt.createSalt = function(callback) {
	crypto.randomBytes(SALT_SIZE, function(err, salt) {
		if (err) { throw err; }
		salt = new Buffer(salt).toString('hex');
		callback(salt);
	});
};

/**
 * Generates a hash for a password with a given salt using pbkdf2.
 * @param {string} password - The password to hash
 * @param {string} salt - Salt used to hash the password
 * @param {function} callback - Callback function once the hash is generated. Should take the hash string as its one argument.
 * @throws Throws an exception on crypto.pbkdf2 failure.
 */
pcrypt.hashPassword = function(password, salt, callback) {
	crypto.pbkdf2(password, salt, ITERATIONS, HASH_SIZE, function(err, hash) {
		if (err) { throw err; }
		hash = new Buffer(hash).toString('hex');
		callback(hash);
	});
};

module.exports = pcrypt;