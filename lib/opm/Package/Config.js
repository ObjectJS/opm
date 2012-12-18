function Config() {
}

Config.mappers = {
	'project': function() {
		return this.document.opm.type == 'project';
	},
	'component': function() {
		return this.document.opm.type == 'component';
	}
};

Config.prototype.getPackage = function() {
	var Package = require('../Package');
	var package = new Package();
	return package;
};

module.exports = Config;