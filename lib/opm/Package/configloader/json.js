var fs = require('fs');
var path = require('path');

const PACKAGE_CONFIG_FILENAME = 'package.json';

function JSONConfig(jsonText, package) {
	this.document = JSON.parse(jsonText);
	this.package = package;
}

JSONConfig.prototype.load = function() {
	var loader = this;
	var package = this.package;

	package.defineGetters({
		id: function() {
			return loader.document.id;
		},

		version: function() {
			return loader.document.version;
		},

		sourceDir: function() {
			// TODO
		},

		resourceDir: function() {
			// TODO
		},

		libraryDir: function() {
			// TODO
		},

		libraries: function() {
			// TODO
		},

		combines: function() {
			// TODO
		}
	});
};

function check(packagePath) {
	return fs.existsSync(path.join(packagePath, PACKAGE_CONFIG_FILENAME));
}

function createConfig(package) {
	var configPath = path.join(package.root, PACKAGE_CONFIG_FILENAME);
	var result = fs.readFileSync(configPath, 'utf-8');
	var config = new JSONConfig(result, package);
	return config;
}

exports.check = check;
exports.createConfig = createConfig;