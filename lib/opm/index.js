var path = require('path');
var os = require('os');
var nconf = require('nconf');
var utils = require('../utils');
var events = require('events');

function Program() {
	events.EventEmitter.call(this);

	// TODO 兼容linux/macos，比win32多一个global配置，放在/etc/opm/opmrc
	if (os.platform() == 'win32') {
		this.config = nconf.env().add('user', {
			type: 'file',
			file: path.join(process.env['HOME'] || process.env['USERPROFILE'], '.opmrc'),
			format: nconf.formats.ini
		}).add('global', {
			type: 'file',
			file: path.join(__dirname, '../../opmrc'),
			format: nconf.formats.ini
		});
	}
	// mac & linux
	else if (~['darwin', 'linux'].indexOf(os.platform())) {
		this.config = nconf.env().add('user', {
			type: 'file',
			file: path.join(process.env['HOME'] || process.env['USERPROFILE'], '.opmrc'),
			format: nconf.formats.ini
		}).add('global', {
			type: 'file',
			file: '/etc/opmrc',
			format: nconf.formats.ini
		}).add('global2', {
			type: 'file',
			file: path.join(__dirname, '../../opmrc'),
			format: nconf.formats.ini
		});

	} else {
		throw new Error('unknown platform.');
	}

	this.config.defaults({
		// 'registry' : 'http://10.32.229.251:5984/registry/_design/app/_rewrite/', // old 
		'registry' : 'http://githop.etao.net:5984/registry/_design/app/_rewrite/', // new
		'cache': '.opm/cache',
		'temp': '.opm/temp'
	});

}

Program.prototype = Object.create(events.EventEmitter.prototype);

Program.prototype.load = function(callback) {
	if (this.loaded) {
		callback();
		return;
	}
	this.loaded = true;

	this.loadExtensions();

	var extensions = [];
	Object.keys(this.extensions).forEach(function(key) {
		extensions.push(this.extensions[key]);
	}, this);

	this.extension = require('extension.js').init(module, extensions, '../');
	this.npm = require('npm');
	this.npm.load({
		'userconfig': path.join(process.env['HOME'] || process.env['USERPROFILE'], '.opmnpmrc'),
		'registry': this.registryUrl,
		'cache': this.cachePath
	}, callback);
};

Program.prototype.loadExtensions = function() {
	var extensions = this.extensions = this.config.get('extensions');
	Object.keys(extensions || {}).forEach(function(name) {
		// ini 中 "xxx"，值为 true
		// ini 中 "xxx ="，值为空字符
		if (!extensions[name] || extensions[name] == true) {
			extensions[name] = path.join(__dirname, '../../node_modules/opmext-' + name + '/lib');
		}
	}, this);
};

Program.prototype.getPackage = function(packageRoot, callback) {
	var Package = require('./Package');
	Package.getPackage(packageRoot, function(err, package) {
		if (err) {
			callback(err);
		} else {
			package.load(callback);
		}
	});
};

Program.prototype.getTarget = function(targetRoot, packageRoot, callback) {
	var Target = require('./Target');
	var target = new Target(targetRoot, packageRoot);
	target.load(callback);
};

Program.prototype.findPackageRoot = function(filename) {
	var Package = require('./Package');
	return utils.findPath(filename, Package.isPackage);
};

Program.prototype.findTargetRoot = function(filename) {
	var Target = require('./Target');
	return utils.findPath(filename, Target.isTarget);
};

Object.defineProperties(Program.prototype, {
	'cachePath' : {
		get: function() {
			return path.join(process.env['HOME'], this.config.get('cache'));
		}
	},
	'registryUrl' : {
		get: function() {
			return this.config.get('registry');
		}
	}

});

module.exports = new Program();
