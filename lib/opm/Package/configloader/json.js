var fs = require('fs');
var path = require('path');

const PACKAGE_CONFIG_FILENAME = 'package.json';

function JSONConfig(package) {
	this.package = package;
}

JSONConfig.prototype.load = function(callback) {
	var loader = this;
	var package = this.package;

	var configPath = path.join(this.root, PACKAGE_CONFIG_FILENAME);
	var result = fs.readFile(configPath, 'utf-8', function(err, result) {
		if (err) {
			callback(err);
		} else {
			loader.document = JSON.parse(result);
			package.defineGetters({
				name: function() {
					return loader.document.name;
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
			callback(null, loader);
		}
	});

};

function check(packagePath) {
	return fs.existsSync(path.join(packagePath, PACKAGE_CONFIG_FILENAME));
}

function createConfig(package) {
}

exports.check = check;
exports.createConfig = createConfig;
