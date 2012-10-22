var opm = require('../opm');
var npm = require('npm');
var log = require('../log');

function publish(packagePath, options) {
	packagePath = packagePath || process.cwd();
	npm.load({
		registry: opm.registryUrl,
		cache: opm.cachePath
	}, function() {
		npm.commands.publish([packagePath], function(err) {
			if (err) {
				log.error('publish', err);
			} else if (options.export) {
				require('./export')(packagePath);
			}
		});
	});
}

publish.usage = 'publish [path]';

publish.options = {
	'-E, --no-export': 'no-export, just publish.'
};

module.exports = publish;
