var forever = require('forever-monitor');

const child = new (forever.Monitor)('app.js');

child.on('watch:restart', function(info) {
    console.error('Restarting script because ' + info.file + ' changed');
});

child.on('restart', function() {
    console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function(code) {
    console.error('Forever detected script exited with code ' + code);
});