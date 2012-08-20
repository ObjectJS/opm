var xmldom = require('xmldom');
var xpath = require('xpath');
var url = require('url');
var path = require('path');
var fs = require('fs');

const PACKAGE_CONFIG_FILENAME = 'package.xml';

/**
 * 检查某路径是否是源库
 */
function check(packagePath) {
	return fs.existsSync(path.join(packagePath, PACKAGE_CONFIG_FILENAME));
}

/**
 * 读取源库配置文件，初始化源库
 */
function load(package, callback) {
	var configPath = path.join(package.root, PACKAGE_CONFIG_FILENAME);
	fs.readFile(configPath, 'utf-8', function(err, result) {
		var loader = new XMLConfigLoader(result);
		loader.fill(package);
		callback(true);
	});
}

function XMLConfigLoader(xmlText) {
	this.document = new xmldom.DOMParser().parseFromString(xmlText);
}

XMLConfigLoader.prototype.select = function(selector, doc) {
	return xpath.select(selector, doc || this.document);
};

/**
 * 根据config初始化源库
 */
XMLConfigLoader.prototype.fill = function(package) {
	package.id = this.select('/package/@id') || this.select('/package/@url');
	package.sourceDir = this.select('//source/@dir') || package.sourceDir;
	package.resourceDir = this.select('//resource/@dir') || package.resourceDir;
	package.libraryDir = this.select('//library/@dir') || package.libraryDir;

	// Libraries
	var folders = this.select('//library/folder');
	folders.forEach(function(folder) {
		var name = folderElement.getAttribute('name');
		var id = folderElement.getAttribute('url');
		package.libraries[name] = id;
	}, this);

	// Combines
	var combines = this.select('//source/combine');
	combines.forEach(function(combine) {
		var key = combine.getAttribute('path');
		var includes = this.select('include', combine);
		var incs = [];
		includes.forEach(function(include) {
			var path = include.getAttribute('path');
			var module = include.getAttribute('module');
			if (path) {
				incs.push(path);
			} else {
				incs.push('module:' + module);
			}
		}, this);
		incs = incs.map(function(inc) {
			// module前缀的不会被处理因为url.resolve合并因为带有协议，是个绝对路径
			return url.resolve(package.sourceDir + '/', inc);
		});
		key = url.resolve(package.sourceDir + '/', key);
		package.combines[key] = incs;
	}, this);
};

exports.XMLConfigLoader = XMLConfigLoader;
exports.load = load;
exports.check = check;
