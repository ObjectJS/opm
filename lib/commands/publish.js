var RegClient = require('npm-registry-client');
var fs = require('fs');
var opm = require('../opm');
var tar = require('tar');

function publish(path) {
	path = path || process.cwd();
	var registry = new RegClient({
		cache: opm.cachePath,
		registry: opm.registryUrl
	});

	opm.getPackage(path, function(err, package) {
		if (err) {
			console.error(err);
		} else {
			console.log(package.version);
			//package.pack(tarPath, function(err) {
				//registry.publish(data, tarball, function() {
				//});
			//});
		}
	});

}

publish.usage = 'publish [path]';

publish.options = {
};

module.exports = publish;
