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
		}).add('default', {
			type: 'file',
			file: path.join(__dirname, '../../opmrc'),
			format: nconf.formats.ini
		});
	}

	this.loadExtensions();
}

Program.prototype.loadExtensions = function() {
	var extensions = this.extensions = this.config.get('extensions');
	Object.keys(extensions || {}).forEach(function(name) {
		if (!extensions[name]) {
			extensions[name] = path.join(__dirname, '../extensions/' + name);
		}
	}, this);
};

module.exports = new Program();
