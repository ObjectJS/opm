var opm = require('../opm');
var wrench = require('wrench');
var mkdirp = require('mkdirp');
var path = require('path');

function export_(packagePath) {
	packagePath = packagePath || process.cwd();
	opm.getPackage(packagePath, function(err, package) {
		var packagePath = path.join(opm.cachePath, package.name + '/', package.version + '/', 'package');
		var targetPath = path.join(package.root, 'exports/', package.version);
		mkdirp(targetPath, function() {
			wrench.copyDirSyncRecursive(packagePath, targetPath);
		});
	});
}

export_.usage = 'export';

module.exports = export_;
