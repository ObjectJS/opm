var Method = require('../index').Method;

// 处理lib下的文件
function LibraryMethod(reader) {
	this.reader = reader;
	this.priority = 20;
}

LibraryMethod.prototype = Object.create(Method.prototype);

LibraryMethod.prototype.check = function(fileUrl, callback) {
	var results = this.reader.package.resolveUrl(fileUrl);
	var libFileUrl = results[0];
	var libPackage = results[1];
	callback(fileUrl != libFileUrl);
};

LibraryMethod.prototype.read = function(fileUrl, callback) {
	var results = this.reader.package.resolveUrl(fileUrl);
	var libFileUrl = results[0];
	var libPackage = results[1];
	libPackage.readFile(libFileUrl, callback);
};

exports.createMethod = function(reader) {
	return new LibraryMethod(reader);
};
