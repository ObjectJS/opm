var path = require('path');
var opm = require('../opm');
var log = require('../log');

function init(dir, options) {
	opm.npm.config.set('init-module', path.join(__dirname, '../npm-init.js'));
	opm.npm.commands.init([dir], function(err) {
	});
}

init.usage = 'init [dir]';

module.exports = init;
