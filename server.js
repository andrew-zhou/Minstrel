"use strict";

var body_parser = require('body-parser');
var cookie_parser = require('cookie-parser');
var express = require('express');
var http = require('http');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config');
var routes = require('./controller/routes');
var app = express();

app.set('port', config.port);
app.set('views', __dirname + '/view');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookie_parser());
app.use('/', express.static(path.join(__dirname, 'public')));

mongoose.connect(config.dbURI);
mongoose.connection.on('open', function() {
	console.log('Connected to db.');
});

routes(app);

// TODO: Error handling

http.createServer(app).listen(app.get('port'), function() {
	console.log('Server created.');
});