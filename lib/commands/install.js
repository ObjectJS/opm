var RegClient = require('npm-registry-client');
var request = require('request');
var fs = require('fs');
var path = require('path');
var tar = require('tar');
var zlib = require('zlib');
var opm = require('../opm');
var mkdirp = require('mkdirp');

function install(name) {
	var registry = new RegClient({
		cache: opm.cachePath,
		registry: opm.registryUrl
	});

	var ver = 'latest';
	// 服务器上获取此版本文件的目录名
	var folder = name + '/' + ver;

	registry.get(folder, function(err, data, json, response) {
		// 通过服务器获取tar包的url
		var tarUrl = data.dist.tarball;

		// 本地上获取次版本文件的路径
		var cachePath = path.join(opm.cachePath, name + '/' + data.version);
		// 本地保存此tar包的路径
		var tarPath = path.join(cachePath, 'package.tgz');
		var namespace = name.substr(0, name.indexOf('_'));
		var subname = name.substr(name.indexOf('_') + 1);
		console.log(namespace, subname)

		mkdirp(cachePath, function() {
			request(tarUrl).pipe(fs.createWriteStream(tarPath)).on('error', function(err) {
				console.log(err)
			}).on('close', function() {
				fs.createReadStream(tarPath).pipe(zlib.Unzip()).pipe(tar.Extract({path: cachePath})).on('end', function() {
					var packagePath = path.join(cachePath, 'package');
					var targetPath = path.join(process.cwd(), 'imports/' + namespace + '/' + subname);
					mkdirp(targetPath, function() {
						fs.readdir(packagePath, function(err, files) {
							files.forEach(function(file) {
								var sourceFile = path.join(packagePath, file);
								var targetFile = path.join(targetPath, file);
								fs.createReadStream(sourceFile).pipe(fs.createWriteStream(targetFile));
							});
						});
					});
				});
			});
		});
	});
}

install.usage = 'install <name>';

module.exports = install;
