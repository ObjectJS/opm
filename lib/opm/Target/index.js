var fs = require('fs');
var path = require('path');
var Package = require('../Package');
var async = require('async');
var opm = require('../../opm');

const TARGET_RUNTIME_PATH = '.template-info';
const TARGET_LINK_CONFIG = '.package';

function Target(root, packageRoot) {
	// 要用resolve格式化路径，normalize不会处理最后的斜线
	this.root = path.resolve(root, './') || '';
	this.runtimePath = path.join(this.root, TARGET_RUNTIME_PATH);
	this.packageRoot = packageRoot;
}

Target.prototype.load = function(callback) {
	var target = this;
	this.package = this.loadPackage(this.packageRoot, function() {
		callback(null, target);
	});
};

Target.prototype.loadPackage = function(packageRoot, callback) {
	if (!packageRoot) {
		packageRoot = this.getLinkedRoot();
	}
	opm.getPackage(packageRoot, callback);
};

Target.prototype.getLinkedRoot = function() {
	var packageRoot;

	// 通过source文件读取到地址
	packageFile = path.join(this.runtimePath, 'package');

	// 查找本地连接
	if (fs.existsSync(packageFile)) {
		packageRoot = os.path.realpath(fs.readFileSync(packageFile, 'utf-8').trim());
	}
	return packageRoot;
};

/**
 * 获取此目标库所映射的源库
 */
Target.prototype.getSource = function(workspace) {
	var sourcePath;

	// 通过source文件读取到地址
	sourceFile = path.join(this.runtimePath, 'source');
	// 通过.package 文件读取到url
	packageFile = path.join(this.root, TARGET_LINK_CONFIG);

	// 优先查找本地连接
	if (fs.existsSync(sourceFile)) {
		sourcePath = os.path.realpath(fs.readFileSync(sourceFile, 'utf-8').trim());
		return new Package(sourcePath, workspace);
	}
	// 其次查找工作区连接
	else if (fs.existsSync(packageFile) && workspace) {
		return workspace.getPackage(fs.readFileSync(packageFile, 'utf-8').trim());
	}
};

/**
 * 构建此目标库下的一个文件
 */
Target.prototype.buildFile = function(filename, workspace, callback) {
	filename = path.normalize(filename);
	if (filename.indexOf(this.root) != 0) {
		throw new Error('file not in package.');
	}
	var sourcePath = filename.slice(this.root.length + 1).replace(/\\/g, '/');
	this.source.buildFile(sourcePath, function(err, content) {
		if (err) {
			callback(err, content);
		} else {
			fs.writeFile(filename, content, function() {
				callback(err, content);
			});
		}
	});
};

/**
 * 构建整个库
 */
Target.prototype.build = function(callback) {
	var target = this;
	fs.readdir(this.root, function(err, files) {
		if (err) {
			callback(err);
		} else {
			async.forEach(files, function(file, callback) {
				//var filename = path.join(target.root, file);
				//target.buildFile(filename);
				callback();
			}, callback);
		}
	});
};

/**
 * 一个路径是否是目标库
 */
Target.isTarget = function(targetPath) {
	return fs.existsSync(path.join(targetPath, TARGET_RUNTIME_PATH));
};

module.exports = Target;
