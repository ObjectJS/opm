var cssom = require('cssom');
var async = require('async');

function CSSCompiler() {
}

CSSCompiler.prototype.compile = function(str) {
	var compiler = this;
	var css = cssom.parse(str);
	var rule;
	var imports = [];
	var importFileUrl;
	for (var i = 0; i < css.cssRules.length; i++) {
		rule = css.cssRules[i];
		// TODO css-compiler-profile 解析错误，需要修正

		if (rule.selectorText == '@-css-compiler') {
			css.deleteRule(i);
			i--;
		}
		else if (rule.constructor == cssom.CSSImportRule) {
			css.deleteRule(i);
			importFileUrl = url.resolve(fileUrl, rule.href);
			imports.push(url.resolve(fileUrl, rule.href));
			i--;
		}
	}

	if (imports.length) {
		// 顺序异步调用
		async.mapSeries(imports, function(importFileUrl, callback) {
			var results = compiler.resolveUrl(importFileUrl);
			var libFileUrl = results[0]
			var libPackage = result[1];
			compiler.compile(compiler, importFileUrl, callback);
		}, function(err, results) {
			console.error(err);
			var content = results.join('\n') + css.toString();
			callback(err, content);
		});
	} else {
		callback(null, css.toString());
	}
};

CSSCompiler.prototype.resolvePath = function() {
};

function compile(str) {
}

exports.compile = compile;
