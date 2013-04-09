var ws = require('../opm/workspace');

function serve(workspacePath, command) {
	if (!workspacePath) {
		workspacePath = process.cwd();
	}

	if (ws.isWorkspace(workspacePath)) {
		if (!command.noload) {
			require('./load').action(command, function() {
				doServe(workspacePath, command.port);
			});
		} else {
			doServe(workspacePath, command.port);
		}
	}
	else {
		console.error('invalid workspace.');
	}
}

function doServe(workspacePath, port) {
	var workspace = new ws.Workspace(workspacePath);
	workspace.load(function() {
		require('../opm/server').createServer(workspace).listen(port);
	});
}

serve.usage = 'serve';

serve.description = 'nof finished.';

module.exports = serve;

module.exports.options = {
	'-L, --noload': 'not load workspace when startup',
	'-d, --debug': 'debug mode',
	'--port <n>': ['serve port, default to 8080', Number, 8080]
};

