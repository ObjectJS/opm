var opm = require('../opm');

function test() {
	opm.getPackage(process.cwd(), function(err, package) {

	});
}

module.exports = test;

module.exports.usage = 'test';