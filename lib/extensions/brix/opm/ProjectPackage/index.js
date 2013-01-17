var Package = require('opm/Package');

function ProjectPackage() {
	Package.apply(this, arguments);
}

ProjectPackage.prototype = Object.create(Package.prototype);

module.exports = ProjectPackage;