var fs = require('fs');
var path = require('path');

const PACKAGE_CONFIG_FILENAME = 'package.json';

function JSONConfig(jsonText) {
	this.document = JSON.parse(jsonText);
}

JSONConfig.propertyGetters = {
	id: function() {
		return this.document._id;
	},
	name: function() {
		return this.document.name;
	},
	version: function() {
		return this.document.version;
	}
}

JSONConfig.prototype.load = function(package, callback) {
	var loader = this;
	callback(null, loader);
};

JSONConfig.prototype.getProperty = function(name) {
	return JSONConfig.propertyGetters[name].call(this);
};

function check(packagePath) {
	return fs.existsSync(path.join(packagePath, PACKAGE_CONFIG_FILENAME));
}

function createConfig(packageRoot) {
	var configPath = path.join(packageRoot, PACKAGE_CONFIG_FILENAME);
	var result = fs.readFileSync(configPath, 'utf-8');
	var config = new JSONConfig(result);
	return config;
}

exports.check = check;
exports.createConfig = createConfig;
