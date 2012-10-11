/*
 * 变量说明：
 * fileUrl file协议的url
 * moduleUrl module协议的url
 * schemeUrl 带有模式的url
 * sourcePath 发布库本地路径去掉发布库前缀后剩下的交给源库处理的路径部分
 */
var opm = require('../../opm');
var require = require('erequire')(module, opm.extensions);
var path = require('path');
var url = require('url');
var async = require('async');
var configLoaders = [
	require('./configloader/json'),
	require('./configloader/xml')
];

function Package(root, ws) {
	this.id = '';
	this.version = '';
	this.sourceDir = '';
	this.resourceDir = '';
	this.libraryDir = '';
	this.workspace = ws;
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
	for (var i = 0; i < configLoaders.length; i++) {
		loader = configLoaders[i];
		if (loader.check(this.root)) {
			this.config = loader.createConfig(this);
			break;
		}
	}
	if (this.config) {
		this.config.load();
	}
	callback(null, this);
};

/**
 */
Package.prototype.defineGetter = function(name, getter) {
	Object.defineProperty(this, name, {
		get: getter
	});
};

/**
 */
Package.prototype.defineGetters = function(getters) {
	Object.keys(getters).forEach(function(key) {
		this.defineGetter(key, getters[key]);
	}, this);
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
 * 将源库打包成一个tar包
 */
Package.prototype.pack = function(output, callback) {
	var tar = require('tar');
	tar.pack(tgz, p, data, doFancyCrap, function (er) {
	  if (er) {
		log.error( "addLocalDirectory", "Could not pack %j to %j"
				 , p, tgz )
		return cb(er)
	  }

	  // if we don't get a cache stat, or if the gid/uid is not
	  // a number, then just move on.  chown would fail anyway.
	  if (!cs || isNaN(cs.uid) || isNaN(cs.gid)) return cb()

	  chownr(made || tgz, cs.uid, cs.gid, function (er) {
		if (er) return cb(er)
		addLocalTarball(tgz, name, cb)
	  })
	})
};

/**
 * 一个路径是否是源库
 */
Package.isPackage = function(packagePath) {
	return configLoaders.some(function(loader) {
		return loader.check(packagePath);
	});
};

module.exports = Package;