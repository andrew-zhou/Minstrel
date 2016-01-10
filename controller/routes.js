"use strict";

var index = require('./index');
var register = require('./register');

module.exports = function(app) {
	app.get('/', index.index);
	app.get('/register', register.index);
	app.post('/register', register.create);
};