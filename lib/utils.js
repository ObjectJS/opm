var path = require('path');
var fs = require('fs');

/**
 * 向上查找符合checker的路径
 */
function findPath(p, checker) {

	// normalize确保后面进行比较
	p = path.normalize(p);

	if (fs.existsSync(p) && fs.statSync(p).isFile()) {
		p = path.dirname(p);
	}

	var parentPath;

    while (true) {
		if (checker(p)) {
			return p;
		}
        parentPath = path.join(p, '../');
        if (parentPath == p) {
			break // 已经到根目录了，停止循环
		}
        else {
			p = parentPath;
		}
	}
}

exports.findPath = findPath;
