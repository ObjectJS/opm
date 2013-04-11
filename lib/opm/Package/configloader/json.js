var fs = require('fs');
var path = require('path');
var Config = require('../Config');

const PACKAGE_CONFIG_FILENAME = 'package.json';

function JSONConfig(jsonText) {
	this.document = JSON.parse(jsonText);
}

JSONConfig.prototype = Object.create(Config.prototype);

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

JSONConfig.prototype.save = function(filename, callback) {
	fs.writeFile(filename, JSON.stringify(this.document, null, 2), 'utf-8', callback);
};

JSONConfig.prototype.getPackage = function() {
	if (this.document.opm.type == 'component') {
		return require('../ComponentPackage');
	} else if (this.document.opm.type == 'project') {
		return require('../ProjectPackage');
	} else {
		return Config.prototype.getPackage.apply(this, arguments);
	}
};

JSONConfig.prototype.setProperty = function(name, value) {
	this.document[name] = value;
};

JSONConfig.prototype.getProperty = function(name) {
	var getter = JSONConfig.propertyGetters[name] || function() {};
	return getter.call(this);
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
exports.JSONConfig = JSONConfig;
