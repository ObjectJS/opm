var assert = require('assert');
var path = require('path');
var opm = require('../lib/opm');

describe('build', function() {
	it('should built', function(done) {
		opm.getPackage(path.join(__dirname, 'workspace/abc'), function(err, package) {
			package.buildFile('abc.js', function(err, content) {
				console.log(content, err);
				done();
			});
		});
	});
});
