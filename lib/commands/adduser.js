var npm = require('npm');
var opm = require('../opm');
var log = require('../log');

function adduser() {
	npm.load({
		registry: opm.registryUrl,
		cache: opm.cachePath
	}, function() {
		npm.commands.adduser(function(err) {
			if (err) {
				log.error(err)
			} else {

			}
		});
	});
}

module.exports = adduser;