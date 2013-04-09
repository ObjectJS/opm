var opm = require('../opm');

function extensions() {
	opm.extension.host.extensionRoots.forEach(function(root) {
		console.log(root);
	});
}

module.exports = extensions;
