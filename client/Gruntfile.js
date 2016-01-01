"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			'../public/app.js': ['app.js']
		},
		sass: {
			dev: {
				options: {
					style: 'expanded',
					loadPath: 'node_modules/bootstrap-sass/assets/stylesheets'
				},
				files: {
					'../public/style.css': 'style.scss'
				},
			},
			dist: {
				options: {
					style: 'compressed',
					loadPath: 'node_modules/bootstrap-sass/assets/stylesheets'
				},
				files: {
					'../public/style.css': 'style.scss'
				},
			}
		},
		watch: {
			scripts: {
				files: ['**/*.js'],
				tasks: ['browserify']
			},
			styles: {
				files: ['**/*.scss'],
				tasks: ['sass:dev']
			}
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('buildcss', ['sass:dist']);
};
