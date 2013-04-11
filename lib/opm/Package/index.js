/*
 * 变量说明：
 * fileUrl file协议的url
 * moduleUrl module协议的url
 * schemeUrl 带有模式的url
 * sourcePath 发布库本地路径去掉发布库前缀后剩下的交给源库处理的路径部分
 */
var opm = require('../../opm');
var path = require('path');
var url = require('url');
var async = require('async');
var fs = require('fs');
var configLoaders = [
	require('./configloader/json'),
	require('./configloader/xml')
];

function Package(root, ws) {
	this.sourceDir = '';
	this.resourceDir = '';
	this.libraryDir = '';
	this.workspace = ws;
	this.root = root;
	this.combines = {};
	this.libraries = {};
	this.builders = {
		'.js': 'javascript',
		'.css': 'css'
	};
	this._builders = {};
}

/**
 * 获取缓存或新的reader
 */
Package.prototype._getReader = function(scheme) {
	this.__readers = this.__readers || {};
	this.__readers[scheme] = this.__readers[scheme] || require('../schemes/' + scheme).createReader(this);
	return this.__readers[scheme];
};

/**
 * 获取缓存或新的builder
 */
Package.prototype._getBuilder = function(name) {
	this.__builders = this.__builders || {};
	this.__builders[name] = this.__builders[name] || require('../builders/' + name).createBuilder(this);
	return this.__builders[name];
};

/**
 * 加载源库
 */
Package.prototype.load = function(callback) {
	var loader;
	var package = this;
	for (var i = 0; i < configLoaders.length; i++) {
		loader = configLoaders[i];
		if (loader.check(this.root)) {
			this.config = loader.createConfig(this.root);
			break;
		}
	}
	if (this.config) {
		this.config.load(this, function(err) {
			callback(err, package);
		});
	} else {
		callback(new Error('not a package'));
	}
};

/**
 * 根据协议调用不同的reader读取本源库下的一个文件
 */
Package.prototype.readFile = function(schemeUrl, callback) {
	var match = schemeUrl.match(/(?:(.+)\:)?(.+)/i);
	var scheme = match[1] || 'file';
	var pathname = match[2];
	this._getReader(scheme).read(pathname, callback);
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
		this._getBuilder(builderName).build(sourcePath, callback);
	}
};

/**
 * 一个路径是否是源库
 */
Package.isPackage = function(packagePath) {
	return configLoaders.some(function(loader) {
		return loader.check(packagePath);
	});
};

Package.getPackage = function(packageRoot, callback) {
	var package = new Package(packageRoot);
	module.requireAll('./extensions', function(err, extensions) {
		Object.keys(extensions).forEach(function(name) {
			var extension = extensions[name];
			extension.wrap(package);
		});
		callback(null, package);
	});
};

Object.defineProperties(Package.prototype, {
	id: {
		get: function() {
			return this.config.getProperty('id') || (this.name + '@' + this.version);
		}
	},

	name: {
		get: function() {
			return this.config.getProperty('name');
		},
		set: function(value) {
			this.config.setProperty('name', value);
		}
	},

	version: {
		get: function() {
			return this.config.getProperty('version');
		},
		set: function(value) {
			this.config.setProperty('version', value);
		}
	},

	namespace: {
		get: function() {
			return this.name.substr(0, this.name.indexOf('_'));
		},
		set: function(value) {
			this.name = value + '_' + this.subname;
		}
	},

	subname: {
		get: function() {
			return this.name.substr(this.name.indexOf('_') + 1);
		},
		set: function(value) {
			this.name = this.namespace + '_' + value;
		}
	},

	sourceDir: {
		get: function() {
			return this.config.getProperty('sourceDir');
		}
	},

	resourceDir: {
		get: function() {
			return this.config.getProperty('resourceDir');
		}
	},

	libraryDir: {
		get: function() {
			return this.config.getProperty('libraryDir');
		}
	},

	libraries: {
		get: function() {
			return this.config.getProperty('libraries');
		}
	},

	combines: {
		get: function() {
			return this.config.getProperty('combines');
		}
	}
});

module.exports = Package;
