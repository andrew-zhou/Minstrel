"use strict";

var User = require('../model/user');

module.exports = {
	index: function(req, res) {
		res.render('register');
	},
	create: function(req, res) {
		var body = req.body;

		var newUser = new User({
			username: body.username,
			password: body.password,
			email: body.email
		});

		newUser.save(function(err) {
				if (err) {
					throw err;
				}
				console.log('User created successfully!');
				res.redirect('/');
			});

		User.on('index', function(err) {
			if (err) {
				throw err;
			}
		});
	},
};