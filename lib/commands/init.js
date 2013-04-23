var path = require('path');
var opm = require('../opm');
var async = require('async');
var mkdirp = require('mkdirp');
var commander = require('commander');
var JSONConfig = require('../opm/Package/configloader/json.js').JSONConfig;

function init(dir, options) {

	init.root = path.join(process.cwd(), dir);

	async.auto(init.tasks, function(err) {
		if (err) {
			console.error(err);
		} else {
			console.log('inited');
		}
	});
}

init.infoCollectors = [
	// 名称
	function(callback) {
		var defaultValue = path.basename(init.root);
		commander.prompt('name(' + defaultValue + '): ', function(input) {
			init.config.setProperty('name', input || defaultValue);
			callback();
		});
	},
	// 版本
	function(callback) {
		var defaultValue = '0.0.1';
		commander.prompt('version(' + defaultValue + '): ', function(input) {
			init.config.setProperty('version', input || defaultValue)
			callback();
		});
	},
	// 描述
	function(callback) {
		commander.prompt('description: ', function(input) {
			init.config.setProperty('description', input);
			callback();
		});
	}
];

init.tasks = {
	'check_inited': function(callback, results) {
		var root = init.root;
		var err;
		if (opm.findPackageRoot(root) == root) {
			err = new Error('already inited.');
		}
		callback(err);
	},
	// 创建配置文件对象
	'create_config': ['check_inited', function(callback) {
		var config = init.config = new JSONConfig("{}");
		callback();
	}],
	// 收集信息
	'collect_info': ['create_config', function(callback) {
		async.series(init.infoCollectors, function(err) {
			process.stdin.destroy();
			callback(err);
		});
	}],
	// 创建目录
	'create_path': ['collect_info', function(callback, results) {
		mkdirp(init.root, callback);
	}],
	// 初始化package.json
	'save_package': ['collect_info', 'create_path', function(callback, results) {
		init.config.save(path.join(root, 'package.json'), callback);
	}]
};

init.usage = 'init [dir]';

module.exports = init;
