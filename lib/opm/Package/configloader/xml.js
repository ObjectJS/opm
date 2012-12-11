var xmldom = require('xmldom');
var xpath = require('xpath');
var url = require('url');
var path = require('path');
var fs = require('fs');

const PACKAGE_CONFIG_FILENAME = 'package.xml';

function XMLConfig(xmlText) {
	this.document = new xmldom.DOMParser().parseFromString(xmlText);
}

XMLConfig.prototype.load = function(package, callback) {
	var loader = this;

	package.defineGetters({
		id: function() {
			return loader.attr('/package/@id');
		},

		version: function() {
			return loader.attr('/package/@version');
		},

		sourceDir: function() {
			return loader.attr('//source/@dir');
		},

		resourceDir: function() {
			return loader.attr('//resource/@dir');
		},

		libraryDir: function() {
			return loader.attr('//library/@dir');
		},

		libraries: function() {
			var folders = loader.select('//library/folder');
			var libraries = {};
			folders.forEach(function(folder) {
				var name = folderElement.getAttribute('name');
				var id = folderElement.getAttribute('url');
				libraries[name] = id;
			}, loader);
			return libraries;
		},

		combines: function() {
			// Combines var combines = {};
			loader.select('//source/combine').forEach(function(combine) {
			var key = combine.getAttribute('path');
			var includes = loader.select('include', combine);
			var incs = [];
			includes.forEach(function(include) {
			    var path = include.getAttribute('path');
			    var module = include.getAttribute('module');
			    if (module) {
			  	  incs.push('module:' + module);
			    } else if (path) {
			 	  incs.push(path);
			    }
			 });
			 incs = incs.map(function(inc) {
			     // module前缀的不会被处理因为url.resolve合并因为带有协议，是个绝对路径
			     return url.resolve(package.sourceDir + '/', inc);
			 });
			 key = url.resolve(package.sourceDir + '/', key);
			 combines[key] = incs;
			});
			return combines;
		}
	});
};

XMLConfig.prototype.select = function(selector, doc) {
	return xpath.select(selector, doc || this.document);
};

XMLConfig.prototype.select1 = function(selector, doc) {
	return xpath.select1(selector, doc || this.document);
};

XMLConfig.prototype.attr = function(selector, doc) {
	return xpath.attr(selector, doc || this.document);
};

/**
 * 检查某路径是否是源库
 */
function check(packagePath) {
	return fs.existsSync(path.join(packagePath, PACKAGE_CONFIG_FILENAME));
}

/**
 * 读取源库配置文件，初始化源库
 */
function createConfig(packageRoot) {
	var configPath = path.join(packageRoot, PACKAGE_CONFIG_FILENAME);
	var result = fs.readFileSync(configPath, 'utf-8');
	var config = new XMLConfig(result);
	return config;
}

exports.XMLConfig = XMLConfig;
exports.createConfig = createConfig;
exports.check = check;
