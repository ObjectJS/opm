var path = require('path');
var fs = require('fs');
var coffee = require('coffee-script');
var fileScheme = require('opm/schemes/file');

function CoffeeMethod() {
}
CoffeeMethod.prototype = Object.create(fileScheme.Method.prototype);

CoffeeMethod.prototype.check = function(reader, fileUrl, callback) {
	var coffeeFileUrl = fileUrl.slice(0, -path.extname(fileUrl).length) + '.coffee';
	var coffeeFilename = path.join(reader.package.root, coffeeFileUrl);
	callback(fs.existsSync(coffeeFilename));
};

CoffeeMethod.prototype.read = function(reader, fileUrl, callback) {
	var coffeeFileUrl = fileUrl.slice(0, -path.extname(fileUrl).length) + '.coffee';
	var coffeeFilename = path.join(reader.package.root, coffeeFileUrl);
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

fileScheme.FileReader.addMethod(new CoffeeMethod);
