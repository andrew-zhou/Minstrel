"use strict";

var assert = require('assert');
var dbtestutils = require('./dbtestutils');
var User = require('../model/user');

// Utility functions

// Populate the database with mock data
var populateDB = function(callback) {
	var mockUser = new User({
		username: 'mockuser',
		email: 'mock.user@email.com',
		password: 'mockuser'
	});
	mockUser.save(function(err) {
		if (err) { throw err; }
		return callback();
	});
};

// Test suites

suite('user#save');

before(function(done) {
	dbtestutils.connect(done);
});

beforeEach(function(done) {
	dbtestutils.drop(function() {
		populateDB(done);
	});
});

after(function(done) {
	dbtestutils.drop(function() {
		dbtestutils.disconnect(done);
	});
});

test('Create simple user', function(done) {
	var simpleUser = new User({
		username: 'simpleuser',
		email: 'simple.user@email.com',
		password: 'simplepassword'
	});
	simpleUser.save(function(err) {
		assert.doesNotThrow(function() {
			assert.ifError(err);
		});
		User.findOne({ username: 'simpleuser' }, function(err, result) {
			assert.doesNotThrow(function() {
				assert.ifError(err);
			});
			assert.strictEqual(result.username, 'simpleuser');
			assert.strictEqual(result.username_uppercase, 'SIMPLEUSER');
			assert.strictEqual(result.email, 'simple.user@email.com');
			done();
		});
	});
});

test('Create invalid user', function(done) {
	var simpleUser = new User({
		username: 'invaliduser',
		email: null,
		password: 'invaliduser'
	});
	simpleUser.save(function(err) {
		assert(err);
		done();
	});
});

suite('user#searchByUsername');

before(function(done) {
	dbtestutils.connect(done);
});

beforeEach(function(done) {
	dbtestutils.drop(function() {
		populateDB(done);
	});
});

after(function(done) {
	dbtestutils.drop(function() {
		dbtestutils.disconnect(done);
	});
});

test('Perfect match search', function(done) {
	User.searchByUsername('mockuser', function(err, result) {
		assert.strictEqual(result.username, 'mockuser');
		assert.strictEqual(result.username_uppercase, 'MOCKUSER');
		assert.strictEqual(result.email, 'mock.user@email.com');
		done();
	});
});

test('Case insensitive search', function(done) {
	User.searchByUsername('MoCKuSEr', function(err, result) {
		assert.strictEqual(result.username, 'mockuser');
		assert.strictEqual(result.username_uppercase, 'MOCKUSER');
		assert.strictEqual(result.email, 'mock.user@email.com');
		done();
	});
});

test('No match for query', function(done) {
	User.searchByUsername('notarealuser', function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, null);
		done();
	});
});

test('Invalid search query', function(done) {
	var searchQuery = function() {
		User.searchByUsername(null, function(err, result) {
			assert.fail(result, null, 'error not thrown for null username');
			done();
		});
	};
	assert.throws(searchQuery, Error);
	done();
});

suite('user#checkPassword');

before(function(done) {
	dbtestutils.connect(done);
});

beforeEach(function(done) {
	dbtestutils.drop(function() {
		populateDB(done);
	});
});

after(function(done) {
	dbtestutils.drop(function() {
		dbtestutils.disconnect(done);
	});
});

test('Check correct password', function(done) {
	User.findOne({ username: 'mockuser' }, function(err, mockuser) {
		assert.strictEqual(err, null);
		assert(mockuser);
		mockuser.checkPassword('mockuser', function(result) {
			assert.strictEqual(result, true);
			done();
		});
	});
});

test('Check incorrect password', function(done) {
	User.findOne({ username: 'mockuser' }, function(err, mockuser) {
		assert.strictEqual(err, null);
		assert(mockuser);
		mockuser.checkPassword('notacorrectpassword', function(result) {
			assert.strictEqual(result, false);
			done();
		});
	});
});

test('Check invalid password', function(done) {
	User.findOne({ username: 'mockuser' }, function(err, mockuser) {
		assert.strictEqual(err, null);
		assert(mockuser);
		var passwordTest = function() {
			mockuser.checkPassword(null, function(result) {
				assert.fail(result, null, 'error not thrown for null password');
				done();
			});
		};
		assert.throws(passwordTest);
		done();
	});
});