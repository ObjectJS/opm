var Package = require('../Package');
var path = require('path');
var async = require('async');
var fs = require('fs');
var mustache = require('mustache');
var mkdirp = require('mkdirp');

function ComponentPackage() {
	Package.apply(this, arguments);
}

ComponentPackage.prototype = Object.create(Package.prototype);

/**
 * 生成新库的初始文件
 */
ComponentPackage.prototype.initFiles = function(callback) {
	var package = this;

	async.series([
		// 建立根目录
		function(callback) {
			mkdirp(package.root, callback);
		},
		// 创建骨骼文件
		function(callback) {
			var skeletonPath = path.join(__dirname, '../../brix/skeleton');
			var files = ['template.html.mustache', 'data.json.mustache', 'index.js.mustache', 'index.css.mustache'];

			async.forEach(files, function(file, callback) {
				var template; // 存储读取的模版文本
				async.series([
					// 读模版文件
					function(callback) {
						var templateFile = path.join(skeletonPath, file);
						fs.readFile(templateFile, 'utf-8', function(err, text) {
							template = text;
							callback(err);
						});
					},
					// 写生成文件
					function(callback) {
						var resultFile = path.join(package.root, file.substr(0, file.lastIndexOf('.')));
						var result = mustache.render(template, {
							namespace: package.namespace,
							name: package.name,
							subname: package.subname
						});
						fs.writeFile(resultFile, result, 'utf-8', callback);
					}
				], callback);
			}, callback);
		}
	], callback);
};

ComponentPackage.prototype.constructor = ComponentPackage;

module.exports = ComponentPackage;