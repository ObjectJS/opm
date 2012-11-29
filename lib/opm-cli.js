var fs = require('fs');
var path = require('path');
var commander = require('commander');
var opm = require('./opm');
require('pkginfo')(module, 'version');
var require = require('erequire')(module, opm.extensions);

const COMMANDS_DIR = './commands/';

function loadCommands(argv) {
	// 查找dir中的所有js文件加载为command
	var dir = path.join(__dirname, COMMANDS_DIR);
	fs.readdir(dir, function(err, files) {
		// 将所有.js结尾的文件require进来作为command加载
		files.forEach(function(file) {
			var name = path.basename(file, '.js');
			if (fs.statSync(path.join(dir, file)).isFile && path.extname(file) == '.js') {
				requireCommand(COMMANDS_DIR + file, name);
			}
		});

		// 所有子命令加载完毕，执行commander
		commander.parse(argv);

		// 没有子命令
		if (!commander.args.length) {
			commander.help();
		}
	});
};

/**
 * 加载一个文件为command
 * @param file command文件
 * @param name 命令名
 */
function requireCommand(file, name) {
	var commandFile = require(file);
	var command = commander.command(commandFile.usage || name);
	if (commandFile.options) {
		Object.keys(commandFile.options).forEach(function(key) {
			var args = commandFile.options[key];
			if (!Array.isArray(args)) {
				args = [args];
			}
			command.option(key, args[0], args[1], args[2]);
		});
	}
	command.action(commandFile);
};

commander.name = 'opm';
commander.version(exports.version);
loadCommands(process.argv);
