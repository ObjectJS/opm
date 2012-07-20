function Builder(package) {
	this.package = package;
}

Builder.prototype.build = function(sourcePath, callback) {
	console.wran('abstrict method');
};

exports.Builder = Builder;
