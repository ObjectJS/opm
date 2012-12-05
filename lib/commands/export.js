var opm = require('../opm');
var wrench = require('wrench');
var mkdirp = require('mkdirp');
var path = require('path');
var log = require('../log');

function export_(packagePath) {
	packagePath = packagePath || process.cwd();
	opm.getPackage(packagePath, function(err, package) {
		if (err) {
			log.error('export', err);
		} else {
			var packagePath = path.join(opm.cachePath, package.name + '/', package.version + '/', 'package');
			var namespace = package.name.substr(0, package.name.indexOf('_'));
			var subname = package.name.substr(package.name.indexOf('_') + 1);
			var targetPath = path.join('../../exports/', subname + '/' + package.version);
			mkdirp(targetPath, function() {
				wrench.copyDirSyncRecursive(packagePath, targetPath);
			});
		}
	});
}

export_.usage = 'export';

module.exports = export_;
