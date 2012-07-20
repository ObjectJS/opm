var async = require('async');
var Method = require('../index').Method;

function CombineMethod(reader) {
	this.reader = reader;
	this.priority = 10;
}

CombineMethod.prototype = Object.create(Method.prototype);

CombineMethod.prototype.check = function(fileUrl, callback) {
	callback(fileUrl in this.reader.package.combines);
};

CombineMethod.prototype.read = function(fileUrl, callback) {
	var package = this.reader.package;
	async.map(package.combines[fileUrl], function(include, callback) {
		package.readFile(include, callback);
	}, function(err, results) {
		var content = results.join('\n');
		callback(err, content);
	});
};

exports.createMethod = function(reader) {
	return new CombineMethod(reader);
};
