var fs = require('fs');
var path = require('path');
var utils = require('../utils');
var events = require('events');
var pkg = require('./package');

const PUBLISH_RUNTIME_PATH = '.template-info';
const PUBLISH_LINK_CONFIG = '.package';

function PublishPackage(root) {
	events.EventEmitter.call(this);
	// 要用resolve格式化路径，normalize不会处理最后的斜线
	this.root = path.resolve(root, './') || '';
	this.runtimePath = path.join(this.root, PUBLISH_RUNTIME_PATH);
}

PublishPackage.prototype = Object.create(events.EventEmitter.prototype);

/**
 * 获取此发布库所映射的源库
 */
PublishPackage.prototype.getSource = function(workspace) {
	var sourcePath;

	// 通过source文件读取到地址
	sourceFile = path.join(this.runtimePath, 'source');
	// 通过.package 文件读取到url
	packageFile = path.join(this.root, PUBLISH_LINK_CONFIG);

	// 优先查找本地连接
	if (fs.existsSync(sourceFile)) {
		sourcePath = os.path.realpath(fs.readFileSync(sourceFile, 'utf-8').trim());
		return new pkg.Package(sourcePath, workspace);
	}
	// 其次查找工作区连接
	else if (fs.existsSync(packageFile) && workspace) {
		return workspace.getPackage(fs.readFileSync(packageFile, 'utf-8').trim());
	}
};

/**
 * 构建此发布库下的一个文件
 */
PublishPackage.prototype.buildFile = function(filename, workspace, callback) {
	filename = path.normalize(filename);
	if (filename.indexOf(this.root) != 0) {
		throw new Error('file not in package.');
	}
	var sourcePath = filename.slice(this.root.length + 1).replace(/\\/g, '/');
	var source = this.getSource(workspace);
	source.buildFile(sourcePath, function(err, content) {
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
 * 一个路径是否是发布库
 */
function isPublish(publishPath) {
	return fs.existsSync(path.join(publishPath, PUBLISH_RUNTIME_PATH));
};

/**
 * 获取filename此文件所在的发布库
 * @param filename
 * @return {PublishPackage}
 */
function getPublish(filename) {
	var publishPath = utils.findPath(path.dirname(filename), isPublish);
	if (publishPath) {
		return new PublishPackage(publishPath);
	}
};

exports.PublishPackage = PublishPackage;
exports.isPublish = isPublish;
exports.getPublish = getPublish;
