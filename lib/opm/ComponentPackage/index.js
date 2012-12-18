var Package = require('../Package');

function ComponentPackage() {
	Package.apply(this, arguments);
}

ComponentPackage.prototype = Object.create(Package.prototype);

module.exports = ComponentPackage;