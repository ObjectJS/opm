var url = require('url');
var compiler = require('../../csscompiler');
var Builder = require('../builder').Builder;

function CSSBuilder() {
	Builder.apply(this, arguments);
}

CSSBuilder.prototype = Object.create(Builder.prototype);

CSSBuilder.prototype.build = function(sourcePath, callback) {
	var fileUrl = url.resolve(this.package.sourceDir + '/', sourcePath.replace(/-(all|ie6|ie7|std)-min/ig, ''));
	this.package.readFile(fileUrl, function(err, result) {
		var css;
		try {
			css = compiler.compile(result);
		} catch(e) {
			callback(e, null);
			return;
		}
		callback(null, css);
	});
};

exports.CSSBuilder = CSSBuilder;
exports.createBuilder = function(package) {
	return new CSSBuilder(package);
};
