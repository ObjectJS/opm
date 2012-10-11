var RegClient = require('npm-registry-client');
var fs = require('fs');
var opm = require('../opm');
var tar = require('tar');
var npm = require('npm');
var path = require('path');
var mkdirp = require('mkdirp');
var wrench = require('wrench');

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
				opm.getPackage(packagePath, function(err, package) {
					var packagePath = path.join(opm.cachePath, package.name + '/', package.version + '/', 'package');
					var targetPath = path.join(package.root, 'exports/', package.version);
					mkdirp(targetPath, function() {
						wrench.copyDirSyncRecursive(packagePath, targetPath);
					});
				});
			}
		});
	});
}

publish.usage = 'publish [path]';

publish.options = {
};

module.exports = publish;
