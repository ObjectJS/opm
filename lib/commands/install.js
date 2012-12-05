var npm = require('npm');
var path = require('path');
var opm = require('../opm');
var mkdirp = require('mkdirp');
var wrench = require('wrench');

function install(name, options) {

	var namespace = name.substr(0, name.indexOf('_'));
	var subname = name.substr(name.indexOf('_') + 1);

	npm.load({
		registry: opm.registryUrl,
		cache: opm.cachePath
	}, function() {
		npm.commands.install([name], function(err, installed, tree, pretty) {
			if (err) {
				log.error('install', err);
			} else {
				installed.forEach(function(item) {
					var folder = item[1];
					var fullpath = path.join(process.cwd(), folder);
					var targetPath = path.join(process.cwd(), 'imports/' + namespace + '/' + subname);
					mkdirp(targetPath, function() {
						wrench.copyDirSyncRecursive(fullpath, targetPath);
						wrench.rmdirSyncRecursive(fullpath);
					});
				});
			}
		});
	});
}

install.usage = 'install <name>';

module.exports = install;
