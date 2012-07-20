var fs = require('fs');
var path = require('path');
var Method = require('../index').Method;

// 普通本地文件
function FileMethod(reader) {
	this.reader = reader;
	this.priority = 30;
}

FileMethod.prototype = Object.create(Method.prototype);

FileMethod.prototype.check = function(fileUrl, callback) {
	var filename = path.join(this.reader.package.root, fileUrl);
	callback(fs.existsSync(filename));
};

FileMethod.prototype.read = function(fileUrl, callback) {
	var filename = path.join(this.reader.package.root, fileUrl);
	fs.readFile(filename, 'utf-8', function(err, result) {
		callback(err, result);
	});
};

exports.createMethod = function(reader) {
	return new FileMethod(reader);
};
