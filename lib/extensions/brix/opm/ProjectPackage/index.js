var Package = require('../Package');

function ProjectPackage() {
	Package.apply(this, arguments);
}

ProjectPackage.prototype = Object.create(Package.prototype);

ProjectPackage.prototype.constructor = ProjectPackage;

module.exports = ProjectPackage;