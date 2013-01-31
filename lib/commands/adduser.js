var opm = require('../opm');
var log = require('../log');
var path = require('path');

function adduser() {
	opm.load(function() {
		opm.npm.commands.adduser(function(err) {
			if (err) {
				log.error(err);
			}
		});
	});
}

module.exports = adduser;