var path = require('path');
var fs = require('fs');
var http = require('http');
var tgt = require('./target');

function Server(workspace) {
	this.workspace = workspace;
	http.Server.call(this, this.buildFile);
}

Server.prototype = Object.create(http.Server.prototype);

Server.prototype.buildFile = function(request, response) {
	var server = this;
	var filename = request.headers['x-request-filename'];
	// 没有 referer 时强制重新构建
	var force = !('referer' in request.headers);

	var mimetypes = {
		'.css': 'text/css',
		'.js': 'text/javascript'
	};
	var mimetype = mimetypes[path.extname(filename)];

	var target = tgt.getTarget(filename);
	// 有发布库就构建，不管文件是否存在，用来支持自动生成发布文件。
	// TODO 支持自动创建目录
	if (target) {
		target.buildFile(filename, server.workspace, function(err, content) {
			if (err) {
				console.error(err);
				response.writeHead(500);
				response.end(content);
			} else {
				console.info('built %s', filename);
				response.writeHead(200, {
					'Content-Type': mimetype
				});
				response.end(content);
			}
		});
	} else {
		console.log('free file: %s', filename);
		fs.readFile(filename, 'utf-8', function(err, result) {
			console.error(err);
			response.writeHead(404);
			response.end();
		});
	}
};

exports.createServer = function(workspace) {
	return new Server(workspace);
};
