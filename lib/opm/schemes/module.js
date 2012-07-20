var path = require('path');
var url = require('url');
var util = require('util');
var fs = require('fs');
var Reader = require('../reader').Reader;

function ModuleReader(package) {
	Reader.call(this, package);
}

ModuleReader.prototype = Object.create(Reader.prototype);

/**
 * 读文件
 * @override
 */
ModuleReader.prototype.read = function(moduleUrl, callback) {
	var reader = this;
	var filename = this.getFilename(moduleUrl);
	fs.readFile(filename, 'utf-8', function(err, result) {
		var content;
		if (!err) {
			content = reader.buildModule(moduleUrl, result);
		}
		callback(err, content);
	});
};

ModuleReader.prototype.getFilename = function(moduleUrl) {
	return path.join(this.package.root, this.package.sourceDir + '/node_modules/' + moduleUrl);
};

/**
 * 包装模块的头尾
 */
ModuleReader.prototype.buildModule = function(moduleUrl, result) {
	var template = ';object.define(\'%s\',%s function(require, exports, module) {\n%s\n});';
	var requires = [];
	var re = /require\([\'\"](.+?)[\'\"]\)/g;
	while ((match = re.exec(result))) {
		requires.push(match[1]);
	}
	if (requires.length) {
		requires = ' [\'' + requires.join('\', \'') + '\'], ';
	} else {
		requires = '';
	}
	return util.format(template, moduleUrl, requires, result);
};

exports.createReader = function(package) {
	return new ModuleReader(package);
};

