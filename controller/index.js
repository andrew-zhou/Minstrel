"use strict";

module.exports = {
	index: function(req, res) {
		res.render('index', {
			name: 'Andrew'
		});
	}
};