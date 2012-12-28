var fs = require('fs');
var path = require('path');
var commander = require('commander');
var opm = require('./opm');
require('pkginfo')(module, 'version');
var require = opm.require.create(module);

const COMMANDS_DIR = './commands/';

function loadCommands(argv) {
	// 查找dir中的所有js文件加载为command
	var dir = path.join(__dirname, COMMANDS_DIR);
	require.all(dir, function(err, commands) {
		Object.keys(commands).forEach(function(name) {
			var item = commands[name];
			var command = commander.command(item.usage || name);
			if (item.options) {
				Object.keys(item.options).forEach(function(key) {
					var args = item.options[key];
					if (!Array.isArray(args)) {
						args = [args];
					}
					command.option(key, args[0], args[1], args[2]);
				});
			}
			command.action(item);
		});

		// 所有子命令加载完毕，执行commander
		commander.parse(argv);

		// 没有子命令
		if (!commander.args.length) {
			commander.help();
		}
	});
};

commander.name = 'opm';
commander.version(exports.version);
loadCommands(process.argv);
