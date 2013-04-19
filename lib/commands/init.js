var path = require('path');
var opm = require('../opm');
var async = require('async');
var mkdirp = require('mkdirp');
var commander = require('commander');
var JSONConfig = require('../opm/Package/configloader/json.js').JSONConfig;

function init(dir, options) {
	var root = path.join(process.cwd(), dir);
	var config;

	async.series([
		// 已存在？
		function(callback) {
			var err;
			if (opm.findPackageRoot(root)) {
				err = new Error('already inited.');
			}
			callback(err);
		},
		// 创建配置文件对象
		function(callback) {
			config = new JSONConfig("{}");
			callback();
		},
		// 收集名称信息
		function(callback) {
			var defaultValue = path.basename(root);
			commander.prompt('name(' + defaultValue + '): ', function(input) {
				config.setProperty('name', input || defaultValue);
				callback();
			});
		},
		// 收集版本信息
		function(callback) {
			var defaultValue = '0.0.1';
			commander.prompt('version(' + defaultValue + '): ', function(input) {
				config.setProperty('version', input || defaultValue)
				callback();
			});
		},
		// 描述信息
		function(callback) {
			commander.prompt('description: ', function(input) {
				config.setProperty('description', input);
				callback();
			});
		},
		// 停止收集信息
		function(callback) {
			process.stdin.destroy();
			callback();
		},
		// 创建目录
		function(callback) {
			mkdirp(root, callback);
		},
		// 初始化package.json
		function(callback) {
			config.save(path.join(root, 'package.json'), callback);
		}
	], function(err) {
		if (err) {
			console.error(err);
		} else {
			console.log('inited');
		}
	});
}

init.usage = 'init [dir]';

module.exports = init;
