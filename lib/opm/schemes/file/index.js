var path = require('path');
var url = require('url');
var fs = require('fs');
var async = require('async');
var Reader = require('../../reader').Reader;

function Method() {
}

function FileReader(package) {
	Reader.call(this, package);
}

FileReader.prototype = Object.create(Reader.prototype);

/**
 * @override
 */
FileReader.prototype.read = function(fileUrl, callback) {
	async.detect(this.methods, function(method, callback) {
		method.check(fileUrl, callback);
	}, function(result) {
		result.read(fileUrl, callback);
	});
};

FileReader.prototype.loadMethods = function() {
	['library', 'combine', 'file'].forEach(function(name) {
		this.loadMethod(name);
	}, this);
};

FileReader.prototype.loadMethod = function(name) {
	var method = require('./methods/' + name).createMethod(this);
	this.methods.push(method);
	this.methods.sort(function(method, next) {
		return method.priority > next.priority;
	});
};

exports.Method = Method;
exports.FileReader = FileReader;
exports.createReader = function(package) {
	var reader = new FileReader(package);
	reader.loadMethods();
	return reader;
};
