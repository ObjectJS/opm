var url = require('url');
var Builder = require('../builder').Builder;

function JavaScriptBuilder() {
	Builder.apply(this, arguments);
}

JavaScriptBuilder.prototype = Object.create(Builder.prototype);

JavaScriptBuilder.prototype.build = function(sourcePath, callback) {
	var fileUrl = url.resolve(this.package.sourceDir + '/', sourcePath);
	this.package.readFile(fileUrl, callback);
};

exports.JavaScriptBuilder = JavaScriptBuilder;
exports.createBuilder = function(package) {
	return new JavaScriptBuilder(package);
};
