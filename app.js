const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { SerialPort } = require('serialport')
let dataTxtString = "P17000000000000000000000000                       00000000000000  N00000                                                                              ";
var refreshIntervalId = false;
let user = 0;

const port = new SerialPort({
    path: 'com3',
    baudRate: 9600,
    autoOpen: false,
}, (err) => console.log(err));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    user++;
    console.log('a user connected ' + user);
    let date = new Date();
    socket.on("data", (arg) => {
        console.log(arg);

        if (arg['action'] == 'ajax') {
            // Self only (ex ajax)
            if (arg['msg'] == 'BcaECR') {
                clearInterval(refreshIntervalId);
                console.log(arg); 
                let hex = Buffer.from( arg['txt']); 
                let ascii = hexToAscii(hex);
                console.log("debit masuk","ascii : ",ascii);
                bcaEcr(ascii);
            }

            if (arg['msg'] == 'comClose') { 
                clearInterval(refreshIntervalId);
                if(refreshIntervalId._idleTimeout > 1){
                    port.close();
                }
                console.log(refreshIntervalId._idleTimeout);
              
            }
            // setInterval(function () {
                date = new Date();
                const resp = {
                    data :"ERC loop " + date,
                    action : 'bca01',
                }
                socket.emit("emiter", resp );
            //     io.emit("emiter",{msg2:"ERC loop "+date});
            // }, 1000);

        } else {
            // Broadcase
            io.emit("emiter", arg);
        }


    });

});
 
server.listen(3000, () => {
    console.log('listening on *:3000', 0x06);
});

function bcaEcr(ascii) {
    let i = 0;
    port.open(function (res) {
        if (res) {
            console.log(res.name, ', opening port: ', res.message);
        } else {
            console.log('com3 Open');
        }
   
        port.write(ascii, function (err) {
            if (err) throw err;
        });
   
        let read = "";
        refreshIntervalId = setInterval(function () {
            i++;
            let resp = port.read()?.toString('hex') || ''; 
            console.log(i, resp);
            if(resp){ 
                port.write( Buffer.from('06', 'utf8'), function (err) {
                    if (err) throw err; 
                });
                console.log(" PORT WRITE back ", i);
            }
            if(i > 500 ){
                clearInterval(refreshIntervalId);
                port.close();
            }
           
        }, 250);

    });
}



function hexToAscii(str1)
{
   var hex  = str1.toString();
   var str = '';
   for (var n = 0; n < hex.length; n += 2) {
       str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
   }
   return str;
}
