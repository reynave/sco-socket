var ping = require('ping');

// var hosts = ['192.168.1.154', 'google.com', 'yahoo.com'];
// hosts.forEach(function(host){
//     ping.sys.probe(host, function(isAlive){

//         var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
//         console.log(isAlive,msg);
//     });
// });
let host = '192.168.1.154';
ping.sys.probe(host, function (isAlive) {
    var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
    console.log(isAlive, msg);
}); 