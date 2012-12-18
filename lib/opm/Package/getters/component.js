var path = require('path');

module.exports = function(packageRoot) {
	var dir = path.join(packageRoot, 'components');
	return path.existsSync(dir);
};