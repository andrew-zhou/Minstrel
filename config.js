"use strict";

module.exports = {
	dbURI: process.env.MONGODBURI || 'mongodb://localhost:27017/minstreldb',
	port: process.env.PORT || 3000,
};