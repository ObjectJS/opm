var path = require('path');

// opm js文件所在根目录
var root = __dirname;

/**
 * 包装一个module的require
 */
function wrap(hostModule) {
	return function(request) {
		// 是否是不存在的模块，需要返回扩展中的同名模块
		var isNew = false;
		// 当不存在时，从扩展获取的所有模块
		var mods;
		try {
			var expts = hostModule.require(request);
		} catch (e) {
			// 出错，则通过扩展返回这个模块
			isNew = e;
		}

		// 暂时仅仅加载第一个存在此文件的扩展中的文件，不支持扩展一个扩展的用法
		if (isNew) {
			mods = extRequire(request, hostModule);
			// 多个扩展都返回了这个模块，冲突报错。
			if (mods.length > 1) {
				throw new Error(mods.map(function(mod) {return mod.filename}).join(', ') + ' conflict for ' + request + '.');
			}
			if (mods.length) {
				expts = mods[0].exports;
			}
			if (!expts) {
				throw isNew;
			}
		}
		// 加载扩展中的同名模块
		else {
			// require所有扩展中的同名模块
			extRequire(request, hostModule);
		}
		return expts;
	};
}

/**
 * 获取到此request的module
 */
function requireModule(request, context) {
	if (!context) {
		context = module;
	}
	// 保存在cache中的key
	// https://github.com/joyent/node/blob/master/lib/module.js
	var filename = module.constructor._resolveFilename(request, context);
	context.require(request);
	var mod = require.cache[filename];
	return mod;
}

/**
 * 加载扩展中的同名模块
 * @param request 请求的模块
 * @param hostModule 发起的module
 * @returns 扩展中同名加载成功后的模块
 */
function extRequire(request, hostModule) {
	var mods = [];
	// 只hook相对路径
	if (request.slice(0, 1) != '.') {
		return mods;
	}
	// request不一定是相对哪个目录的，而ext.require是相对于扩展的根目录的。进行转换。
	var extRequest = './' + path.join(path.dirname(hostModule.filename), request).slice(root.length);

	exts.forEach(function(ext) {
		try {
			var mod = requireModule(extRequest, ext);
			mods.push(mod);
			// TODO 把log放到hook中，避免多次出现
			//console.log('extension %s extended for %s', ext.name, ext.filename);
		} catch(e) {
		}
	});
	return mods;
}

/**
 * patch系统require
 */
function patchRequire() {
	var orig = require.extensions['.js'];
	require.extensions['.js'] = function(module, filename) {
		// 所有模块都可以直接require到opm，主要为扩展提供支持
		module.paths.push(root);
		orig.apply(this, arguments);
	};
}

var extensions = require('./opm').extensions;
// 保存所有的扩展模块
var exts = [];
patchRequire();

Object.keys(extensions).forEach(function(name) {
	var mod = requireModule(extensions[name]);
	mod.name = name;
	exts.push(mod);
});

module.exports = wrap;
