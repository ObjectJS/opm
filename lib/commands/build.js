var opm = require('../opm');
var utils = require('../utils');
var path = require('path');
var log = require('../log');

function build(packageOrTargetRoot) {
	var targetRoot, packageRoot;
	var current = path.normalize(process.cwd());

	if (packageOrTargetRoot) {
		packageOrTargetRoot = path.normalize(packageOrTargetRoot);
	}

	// 在target目录中执行
	if (opm.findTargetRoot(current)) {
		targetRoot = current;
		packageRoot = packageOrTargetRoot;
	} else if (opm.findPackageRoot(current)) {
		packageRoot = current;
		targetRoot = packageOrTargetRoot;
	}

	opm.getTarget(targetRoot, packageRoot, function(err, target) {
		target.build(function(err) {
			if (err) {
				log.error('build', err);
			} else {
				log.info('build', 'built');
			}
		});
	});
}

build.usage = 'build [target_or_source]';

module.exports = build;
