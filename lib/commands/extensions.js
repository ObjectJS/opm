function extensions() {
	var opm = require('../opm');
	opm.extension.host.extensionRoots.forEach(function(root) {
		console.log(root);
	});
}

module.exports = extensions;
