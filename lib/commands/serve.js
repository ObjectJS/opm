var ws = require('../opm/workspace');

function serve(workspacePath, port) {
	var workspace = new ws.Workspace(workspacePath);
	workspace.load(function() {
		require('../opm/server').createServer(workspace).listen(port);
	});
}

exports.usage = 'serve [workspace-path]';

exports.options = {
	'-L, --noload': 'not load workspace when startup',
	'-d, --debug': 'debug mode',
	'--port <n>': ['serve port, default to 8080', Number, 8080]
};

exports.action = function(workspacePath, command) {
	if (!workspacePath) {
		workspacePath = process.cwd();
	}

	if (ws.isWorkspace(workspacePath)) {
		if (!command.noload) {
			require('./load').action(command, function() {
				serve(workspacePath, command.port);
			});
		} else {
			serve(workspacePath, command.port);
		}
	}
	else {
		console.error('invalid workspace.');
	}
};
