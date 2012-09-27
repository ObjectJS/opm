var path = require('path');
var os = require('os');
var nconf = require('nconf');

function Program() {
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
	} else if (os.platform() == 'darwin') {
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
	}

	this.config.defaults({
		'cache': '.opm/cache',
		'registry' : 'http://localhost:5984/registry/_design/app/_rewrite/'
	});

	this.loadExtensions();
}

Program.prototype.loadExtensions = function() {
	var extensions = this.extensions = this.config.get('extensions');
	Object.keys(extensions || {}).forEach(function(name) {
		// ini 中 "xxx"，值为 true
		// ini 中 "xxx ="，值为空字符
		if (!extensions[name] || extensions[name] == true) {
			extensions[name] = path.join(__dirname, '../extensions/' + name);
		}
	}, this);
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
