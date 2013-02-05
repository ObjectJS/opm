var opm = require('../opm');
var log = require('../log');

function install(name, options) {
	opm.npm.commands.install([name], function(err, installed, tree, pretty) {
		if (err) {
			log.error('install', err);
		} else {
			opm.emit('installed', err, installed, tree, pretty);
		}
	});
}

install.usage = 'install <name>';

module.exports = install;
