const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const net = require('net');
const env_port = 80;
const env_host = '192.168.1.154';
let dataTxtString = "P010000005500000000000000001688700627201892   251000000000000000  N00000                                                                              ";
// DOC https://github.com/nodejs/node/issues/2237

let user = 0;
const client = new net.Socket();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});




io.on('connection', (socket) => {
    user++;
    console.log('a user connected ' + user);
    let date = new Date();
    socket.on("data", (arg) => {
        console.log(arg);

        if (arg['action'] == 'ajax') {
            // Self only (ex ajax)
            if (arg['msg'] == 'bcaEcrCom') {
                console.log(arg);
                let hex = Buffer.from(arg['txt']);
                let ascii = hexToAscii(hex);

                // DEBIT CASH 
                let sendToEcr = {
                    ascii: ascii,
                    socket: socket,
                    transType: arg['transType'],
                }
                if (arg['transType'] == '01') {
                    ecrCashLan(sendToEcr);
                }
                // BCA QRIS
                if (arg['transType'] == '31') {

                }
            }

            if (arg['msg'] == 'comClose') {
                client.on('close', function () {
                    console.log('Cleint 1 :Connection Closed');
                });

            }

            if (arg['msg'] == 'ercClear') {

            }

        } else {
            // Broadcase
            console.log("io.emit");
            io.emit("emiter", arg);
        }

    });

});

function hexToAscii(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}
function ecrClearLan() {
    client.connect({ host: env_host, port: env_port }, function () {
        for (var i = 0; i <= 2; i++) {
            client.on('data', function (data) {
                console.log('ecrClearLan : ', data.toString('hex'));
            });
        }
    });

}


function ecrCashLan(sendToEcr = []) {
    client.connect({ host: env_host, port: env_port }, function () {
        //Log when the connection is established
        console.log(`Client 1 :Connected to server on port  ${env_port}`);

        //Try to send data to the server 
        client.write(dataTxtString);

        //Handle data coming from the server
        client.on('data', function (data) {
            console.log('Client 1 received from server : ', data.toString('hex'));
            client.write('\x06');
        });
        // Handle connection close 
        client.on('close', function () {
            console.log('Cleint 1 :Connection Closed');
        });
        //Handle error
        client.on('error', function (error) {
            console.error(`Connection Error ${error}`);
        });

    });

}
