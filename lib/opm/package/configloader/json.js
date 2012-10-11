/*
 * TODO
 */

var fs = require('fs');
var path = require('path');

const PACKAGE_CONFIG_FILENAME = 'package.json';

function check(packagePath) {
	return fs.existsSync(path.join(packagePath, PACKAGE_CONFIG_FILENAME));
}

function createLoader(package, callback) {
}

exports.check = check;
exports.createLoader = createLoader;
