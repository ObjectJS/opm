var assert = require('assert');
var path = require('path');
var pkg = require('../lib/opm/package');
var package = new pkg.Package(path.join(__dirname, 'workspace/abc'));

describe('build', function() {
	it('should loaded', function(done) {
		package.load(function() {
			done();
		});
	});
	it('should built', function(done) {
		package.buildFile('abc.js', function(err, content) {
			console.log(content, err);
			done();
		});
	});
});
