var RegClient = require('npm-registry-client');
var fs = require('fs');
var opm = require('../opm');
var tar = require('tar');
var npm = require('npm');
var path = require('path');

function publish(packagePath) {
	packagePath = packagePath || process.cwd();
	npm.load({
		registry: opm.registryUrl,
		cache: opm.cachePath
	}, function() {
		npm.commands.publish([packagePath], function(err) {
			if (err) {
				console.error(err)
			} else {
				require('./export')(packagePath);
			}
		});
	});
}

publish.usage = 'publish [path]';

publish.options = {
};

module.exports = publish;
