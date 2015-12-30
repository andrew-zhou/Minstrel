"use strict";

var mongoose = require('mongoose');
var pcrypt = require('../helper/pcrypt');

var schema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	username_uppercase: { type: String, index: true }, // Use for indexing.
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true }, // Store the hash here.
	password_salt: { type: String }
});

/**
 * Searches for a user document with the given username
 * @param {String} name - The username of the user to search for.
 * @param {function} callback - The MongooseJS query callback function. Should
 * 	take in two parameters: an error object and a results object.
 * @returns {Query|null} A query for a user of the given name if no callback is
 * 	passed in, else null.
 */ 
schema.statics.searchByUsername = function(name, callback) {
	return this.findOne({ username_uppercase: name.toUpperCase() }, callback);
};

/**
 * Checks whether or not the given password matches the user's password
 * @param {String} password - The password to check.
 * @param {function} callback - A callback function with one parameter - a 
 *  boolean indicating whether or not the password matches the user with the 
 *  given username.
 */ 
schema.methods.checkPassword = function(password, callback) {
	var self = this;

	try {
		pcrypt.hashPassword(password, this.password_salt, function(hash) {
			callback(hash === self.password);
		});
	} catch (err) {
		// If there was an error, just return false for now
		// TODO: Improve error handling here
		callback(false);
	}
};

// Save an uppercase version of the username for indexing purposes.
schema.pre('save', function(next) {
	var self = this;

	if (!self.isModified('username')) {
		return next();
	}

	self.username_uppercase = self.username.toUpperCase();
	next();
});

// Hash the password if it has just been created or has been changed.
schema.pre('save', function(next) {
	var self = this;

	// Only hash the password if it has been modified or is new
	if (!self.isModified('password')) {
		return next();
	}

	// Generate a salt
	try {
		pcrypt.createSalt(function(salt) {
			pcrypt.hashPassword(self.password, salt, function(hash) {
				self.password = hash;
				self.password_salt = salt;
				next();
			});
		});
	} catch (err) {
		next(err);
	}
});

var user = mongoose.model('User', schema);

module.exports = user;