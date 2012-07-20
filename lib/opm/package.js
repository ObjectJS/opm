/*
 * 变量说明：
 * fileUrl file协议的url
 * moduleUrl module协议的url
 * schemeUrl 带有模式的url
 * sourcePath 发布库本地路径去掉发布库前缀后剩下的交给源库处理的路径部分
 */
var require = require('../require')(module);
var fs = require('fs');
var path = require('path');
var url = require('url');
var events = require('events');
var XMLConfig = require('./xmlconfig').XMLConfig;

const PACKAGE_CONFIG_FILENAME = 'template-config.xml';

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
	var configPath = path.join(this.root, PACKAGE_CONFIG_FILENAME);
	var config = new XMLConfig();
	var package = this;
	fs.readFile(configPath, 'utf-8', function(err, result) {
		config.parse(result, 'utf-8');
		package.fillConfig(config);
		callback();
	});
};

/**
 * 根据config初始化源库
 */
Package.prototype.fillConfig = function(config) {
	this.id = config.get('package', 'id');
	this.sourceDir = config.get('package', 'source_dir', this.sourceDir);
	this.resourceDir = config.get('package', 'resource_dir', this.resourceDir);
	this.libraryDir = config.get('package', 'library_dir', this.libraryDir);

	var libraries = config.items('libraries');
	Object.keys(libraries || {}).forEach(function(key) {
		this.libraries[key] = libraries[key];
	}, this);

	var combines = config.items('combines');
	Object.keys(combines || {}).forEach(function(key) {
		var includes = combines[key].split(/\s*,\s*/ig).map(function(include) {
			// module前缀的不会被处理因为url.resolve合并因为带有协议，是个绝对路径
			return url.resolve(this.sourceDir + '/', include);
		}, this);
		key = url.resolve(this.sourceDir + '/', key);
		this.combines[key] = includes;
	}, this);

	var builders = config.items('builders');
	Object.keys(builders || {}).forEach(function(key) {
		this.builders[key] = builders[key];
	}, this);
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
	return fs.existsSync(path.join(packagePath, PACKAGE_CONFIG_FILENAME));
};

exports.Package = Package;
exports.isPackage = isPackage;
