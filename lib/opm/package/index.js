/*
 * 变量说明：
 * fileUrl file协议的url
 * moduleUrl module协议的url
 * schemeUrl 带有模式的url
 * sourcePath 发布库本地路径去掉发布库前缀后剩下的交给源库处理的路径部分
 */
var require = require('../../require')(module);
var path = require('path');
var url = require('url');
var async = require('async');
var events = require('events');
var configLoaders = [
	require('./configloader/xml'),
	require('./configloader/json')
];

function Package(root, ws) {
	events.EventEmitter.call(this);
	this.id = '';
	this.version = '';
	this.root = root || '';
	this.sourceDir = 'src';
	this.resourceDir = 'res';
	this.libraryDir = 'lib';
	this.workspace = ws;
	this.combines = {};
	this.libraries = {};
	this.builders = {
		'.js': 'javascript',
		'.css': 'css'
	};
	this._builders = {};
}

Package.prototype = Object.create(events.EventEmitter.prototype);

/**
 * 加载源库
 */
Package.prototype.load = function(callback) {
	var package = this;
	async.detect(configLoaders, function(loader, callback) {
		loader.load(package, callback);
	}, callback);
};

/**
 * 根据协议调用不同的reader读取本源库下的一个文件
 */
Package.prototype.readFile = function(schemeUrl, callback) {
	var match = schemeUrl.match(/(?:(.+)\:)?(.+)/i);
	var scheme = match[1] || 'file';
	var pathname = match[2];
	require('./schemes/' + scheme).createReader(this).read(pathname, callback);
};

/**
 * 返回一个路径的所在库路径及所在库
 */
Package.prototype.resolveUrl = function(fileUrl) {
	var urlParts = fileUrl.split('/');
	var inLibraryDir = (urlParts[0] == this.libraryDir);
	var folderName = urlParts[1];
	var libPackageId = this.libraries[folderName];
	var libPackage;
	var libFileUrl;

	// 有工作区，在lib目录中且存在目录映射
	if (this.workspace && inLibraryDir && libPackageId) {
		libPackage = this.workspace.getPackage(libPackageId);
		// 干掉lib和映射的目录名
		libFileUrl = urlParts.slice(2).join('/');
	}
	else {
		libFileUrl = fileUrl;
		libPackage = this;
	}
	return [libFileUrl, libPackage];
};

/**
 * 构建一个文件
 */
Package.prototype.buildFile = function(sourcePath, callback) {
	var fileType = path.extname(sourcePath);
	var builderName = this.builders[fileType];
	if (builderName) {
		require('./builders/' + builderName).createBuilder(this).build(sourcePath, callback);
	}
};

/**
 * 一个路径是否是源库
 */
function isPackage(packagePath) {
	return configLoaders.some(function(loader) {
		return loader.check(packagePath);
	});
};

exports.Package = Package;
exports.isPackage = isPackage;
