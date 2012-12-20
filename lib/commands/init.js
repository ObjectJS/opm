var npm = require('npm');
var path = require('path');
var opm = require('../opm');
var log = require('../log');

function init(dir, options) {
	npm.load({
		registry: opm.registryUrl,
		cache: opm.cachePath
	}, function(err, npm) {
		npm.config.set('init-module', path.join(__dirname, '../npm-init.js'));
		npm.commands.init([dir], function(err) {
		});
	});
}

init.usage = 'init [dir]';

module.exports = init;
