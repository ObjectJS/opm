var opm = require('../opm');

function test() {
	opm.getPackage(process.cwd(), function(err, package) {
		console.log(package);
	});
}

test.description = 'not finished.';

module.exports = test;

module.exports.usage = 'test';