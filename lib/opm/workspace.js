var fs = require('fs');
var path = require('path');
var async = require('async');
var events = require('events');
var packagemod = require('./package');

const WORKSPACE_PACKAGES_FILENAME = '.packages';

function Workspace(root) {
	events.EventEmitter.call(this);
	this.root = path.resolve(root, './');
	Object.defineProperty(this, 'root', {writable: false});
	this.packages = [];
	this.uselessPackages = [];
}

Workspace.prototype = Object.create(events.EventEmitter.prototype);

/**
 * 加载工作区，初始化所有packages
 */
Workspace.prototype.load = function(callback) {
	var workspace = this;
	var packagesFile = path.join(this.root, WORKSPACE_PACKAGES_FILENAME);
	var content = fs.readFileSync(packagesFile, 'utf-8');
	var lines = content.split('\n');
	lines.forEach(function(line) {
		var packagePath = path.join(this.root, line);
		if (packagemod.isPackage(packagePath)) {
			this.packages.push(new packagemod.Package(packagePath, workspace));
		} else {
			this.uselessPackages.push(packagePath);
		}
	}, this);

	// load all packages
	async.map(this.packages, function(pkg, callback) {
		pkg.load(callback);
	}, callback);

};

/**
 * 根据id获取源库
 */
Workspace.prototype.getPackage = function(id) {
	var found;
	if (this.packages.some(function(pkg) {
		found = pkg;
		return pkg.id == id;
	})) {
		return found;
	}
};

exports.Workspace = Workspace;
exports.isWorkspace = function(workspacePath) {
	return fs.existsSync(path.join(workspacePath, '.packages'));
};
