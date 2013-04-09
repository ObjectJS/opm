var wrench = require('wrench');
var path = require('path');
var opm = require('../opm');
var fs = require('fs');
var async = require('async');
var ComponentPackage = require('../opm/ComponentPackage');
var commander = require('commander');
var JSONConfig = require('../opm/Package/configloader/json.js').JSONConfig;

function create(name, options) {
	var packageRoot = opm.findPackageRoot(process.cwd());
	var componentRoot = path.join(packageRoot, 'components', name);
	var parent, package;

	async.series([
		// 检测是否在错误的目录执行
		function(callback) {
			opm.getPackage(packageRoot, function(err, package) {
				if (!err && package.constructor == ComponentPackage) {
					err = new Error('can\'t create component for component.');
				}
				parent = package;
				callback(err);
			});
		},
		// 检测是否已存在同名目录
		function(callback) {
			fs.exists(componentRoot, function(exists) {
				var err;
				if (exists) {
					err = new Error('component already exists.');
				}
				callback(err);
			});
		},
		// 收集名称信息
		function(callback) {
			package = new ComponentPackage(componentRoot);
			package.config = new JSONConfig("{}");

			var defaultValue = parent.name + '_' + name;
			commander.prompt('name(' + defaultValue + '): ', function(name) {
				package.name = name || defaultValue;
				callback();
			});
		},
		// 收集版本信息
		function(callback) {
			var defaultValue = '0.0.1';
			commander.prompt('version(' + defaultValue + '): ', function(version) {
				package.version = version || defaultValue;
				process.stdin.destroy();
				callback();
			});
		},
		// 初始化文件
		function(callback) {
			package.initFiles(callback);
		}
	], function(err) {
		if (err) {
			console.error(err);
		} else {
			console.log('component was created in', path.relative(process.cwd(), componentRoot));
		}
	});
}

create.usage = 'create <name>';

create.options = {
	'--extension': 'create an extension for component.'
};

module.exports = create;