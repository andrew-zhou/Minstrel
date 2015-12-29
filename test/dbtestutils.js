"use strict";

var mongoose = require('mongoose');
// Use a different uri for testing purposes
var dbURI = 'mongodb://localhost/minstrel_test';

var dbtestutils = {};

// Start a connection with the database if one isn't already set.
dbtestutils.connect = function(callback) {
	if (mongoose.connection.readyState !== mongoose.Connection.STATES.disconnected) {
		return callback();
	}
	mongoose.connect(dbURI, callback);
};

// Drop the current database.
dbtestutils.drop = function(callback) {
	mongoose.connection.db.dropDatabase(callback);
};

// Disconnect from the current database.
dbtestutils.disconnect = function(callback) {
	mongoose.connection.close(callback);
};

module.exports = dbtestutils;