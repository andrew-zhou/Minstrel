"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			'../public/app.js': ['app.js']
		},
		watch: {
			files: ['**/*.js'],
			tasks: ['browserify']
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
};