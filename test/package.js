var assert = require('assert');
var path = require('path');
var opm = require('../lib/opm');

describe('typed package', function() {
	it('default package', function(done) {
		opm.getPackage('test/workspace/abc', function(err, package) {
			console.log(package.id);
			done();
		});
	});
	it('component package', function(done) {
		opm.getPackage('test/workspace/brix', function(err, package) {
			console.log(package.id);
			done();
		});
	});
	it('project package', function(done) {
		opm.getPackage('test/workspace/brix/components/abc', function(err, package) {
			console.log(package.id);
			done();
		});
	});
});

describe('build', function() {
	// it('should built', function(done) {
	// 	opm.getPackage(path.join(__dirname, 'workspace/abc'), function(err, package) {
	// 		package.buildFile('abc.js', function(err, content) {
	// 			done();
	// 		});
	// 	});
	// });
});
