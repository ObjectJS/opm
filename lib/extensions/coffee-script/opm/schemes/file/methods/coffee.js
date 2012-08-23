var path = require('path');
var fs = require('fs');
var coffee = require('coffee-script');
var Method = require('opm/schemes/file').Method;

// 处理.coffee文件
function CoffeeMethod(reader) {
	this.reader = reader;
	this.priority = 20;
}

CoffeeMethod.prototype = Object.create(Method.prototype);

CoffeeMethod.prototype.check = function(fileUrl, callback) {
	var coffeeFileUrl = fileUrl.slice(0, -path.extname(fileUrl).length) + '.coffee';
	var coffeeFilename = path.join(this.reader.package.root, coffeeFileUrl);
	callback(fs.existsSync(coffeeFilename));
};

CoffeeMethod.prototype.read = function(fileUrl, callback) {
	var coffeeFileUrl = fileUrl.slice(0, -path.extname(fileUrl).length) + '.coffee';
	var coffeeFilename = path.join(this.reader.package.root, coffeeFileUrl);
	fs.readFile(coffeeFilename, 'utf-8', function(err, result) {
		var content;
		try {
			content = coffee.compile(result);
			callback(null, content);
		} catch(e) {
			callback(e, content);
		}
	});
};

exports.createMethod = function(reader) {
	return new CoffeeMethod(reader);
};
