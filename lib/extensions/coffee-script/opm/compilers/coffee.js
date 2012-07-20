var coffee = require('coffee-script');

function CoffeeScriptCompiler() {
}

CoffeeScriptCompiler.prototype.compile = function(str, callback) {
	var content = coffee.compile(str);
	callback(null, content);
};

exports.createCompiler = function() {
	return new CoffeeScriptCompiler();
};
