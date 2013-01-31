var path = require('path');
var opm = require('../opm');
var mkdirp = require('mkdirp');
var wrench = require('wrench');
var log = require('../log');
var async = require('async');
var fs = require('fs');
var semver = require('semver');

function parseName(fullname) {
	var parsedName = semver.parsePackage(fullname);
	var name = parsedName[1];
	parsedName.namespace = name.substr(0, name.indexOf('_'));
	parsedName.subname = name.substr(name.indexOf('_') + 1);
	return parsedName;
}

function changeBrixVar(targetPath, newPath, callback) {
	var js = path.join(targetPath, 'index.js');
	var html = path.join(targetPath, 'template.html');

	async.auto({
		'js': function(callback) {
			fs.readFile(js, 'utf-8', function(err, result) {
				if (!err) {
					result = result.replace(/KISSY\.add\(['"](.+)['"]/ig, function() {
						return 'KISSY.add("' + newPath + '"';
					});
					fs.writeFile(js, result, 'utf-8', function(err) {
						callback(err);
					});
				}
			});
		},
		'html': function(callback) {
			fs.readFile(html, 'utf-8', function(err, result) {
				if (!err) {
					result = result.replace(/bx-path="(.+)"/ig, function() {
						return 'bx-path="' + newPath + '"';
					});
					fs.writeFile(html, result, 'utf-8', function(err) {
						callback(err);
					});
				}
			});
			callback();
		}
	}, callback);
}

function install(name, options) {

	opm.load(function() {
		opm.npm.commands.install([name], function(err, installed, tree, pretty) {
			if (err) {
				log.error('install', err);
			} else {
				async.forEachSeries(installed, function(item, callback) {
					var parsedName = parseName(item[0]);
					var latest = item[4].split('@')[1] == 'latest';
					var version = latest? 'latest' : parsedName[2];
					var folder = item[1];
					var fullpath = path.join(process.cwd(), folder);
					var partpath = 'imports/' + parsedName.namespace + '/' + parsedName.subname + '/' + version;
					var targetPath = path.join(process.cwd(), partpath);
					mkdirp(targetPath, function() {
						var nodeFolder = path.join(process.cwd(), item[3], 'node_modules');
						wrench.copyDirSyncRecursive(fullpath, targetPath);
						wrench.rmdirSyncRecursive(fullpath);

						// 尝试删除，忽略err
						fs.rmdir(nodeFolder, function() {
							changeBrixVar(targetPath, partpath + '/index', function(err) {
								if (err) {
									log.error('install', err);
	 							} else {
	 								callback();
	 							}
							});
						});

					});
				}, function() {
				});
			}
		});
	});
}

install.usage = 'install <name>';

module.exports = install;
