const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let com = false;
const net = require('net');
const env_port = 80;
const env_host = '192.168.1.154';
let dataTxtString = "P17000000000000000000000000                       00000000000000  N00000                                                                              ";
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

    socket.on("data", (arg) => {

        if (arg['action'] == 'ajax') {
            // Self only (ex ajax)
            if (arg['msg'] == 'bcaEcrCom') {

                let hex = Buffer.from(arg['txt']);
                let ascii = hexToAscii(hex);

                // DEBIT CASH
                let sendToEcr = {
                    ascii: ascii,
                    socket: socket,
                    transType: arg['transType'],
                }
                if (arg['transType'] == '01') {
                    console.log(" call comCashLan(sendToEcr) 01 ");
                    comCashLan(sendToEcr);
                }
                // BCA QRIS
                if (arg['transType'] == '31') {
                    console.log(" call comCashLan(sendToEcr) 03 ");
                    comCashLan(sendToEcr);
                }
            }

            if (arg['msg'] == 'transType31') {
                let sendToEcr = {
                    socket: socket,
                    data: arg
                }
                transType31(sendToEcr);

            }

            if (arg['msg'] == 'comClose') {
                comClose();
            }

            if (arg['msg'] == 'comClear') {
                comClear();

            }
            if (arg['msg'] == 'comTest') {
                let sendToEcr = {
                    socket: socket,
                }
                comTest(sendToEcr);
            }

            if (arg['msg'] == 'comConn') {
                if (com == false) {
                    const comResp = client.connect({ host: arg['host'], port: arg['port'] }, function () {
                        console.log(`Client  : ERC Connected to server on  ${env_host}:${env_port}`);
                    });
                    com = comResp.connecting;
                    const sendBack = {
                        msg: ` ${com}  : ERC Connected to server on  ${env_host}:${env_port}`,
                    }
                    socket.emit("emiter", sendBack);
                    client.on('data', function (data) {
                        console.log(data);
                    });
                } else {
                    console.log('already connect!');
                    const sendBack = {
                        msg: 'already connect!',
                    }
                    socket.emit("emiter", sendBack);
                }

            }


        } else {
            // Broadcase
            console.log("io.emit");
            io.emit("emiter", arg);
        }

    });

});

function hexToAscii(str1) {
    let hex = str1.toString();
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

function comClear() {
    let date = new Date();
    console.log("com Clear");
    client.connect({ host: env_host, port: env_port }, function () {
        console.log(`Client  : ERC Connected to server on  ${env_host}:${env_port}`);
        console.log("Read Data 1");
        client.on('data', function (data) { 
            console.log('on Data : ', date); 
        });
        console.log("Read Data 2");
        client.on('data', function (data) { 
            console.log('on Data : ', date); 
        });
        console.log("Read Data 3");
        client.on('data', function (data) { 
            console.log('on Data : ', date); 
        });

    });

    // if (com == true) {
    //     client.on('data', function (data) {
    //         console.log('comClear : ', data.toString('hex'));
    //     });
    // } else {
    //     console.log("Com not connect");
    // }
}

function comTest(sendToEcr) {
    com = true;
    if (com == true) {
        let date = new Date();
        console.log("send : \n\n");

        client.connect({ host: env_host, port: env_port }, function () {
            console.log(`Client  : ERC Connected to server on  ${env_host}:${env_port}`);
            client.write(dataTxtString);
            // client.on('data', function (data) {
            //     client.write('\x06');
            //     date = new Date();
            //     console.log('on Data : ', date);
            setTimeout(function () {
                // client.end();
                client.destroy();
                console.log("COM END");
            }, 250);

            // });

        });




        // client.write(dataTxtString); 
        // client.on('data', function (data) {
        //     client.write('\x06');
        //     date = new Date();
        //     console.log('on Data : ',date);
        //     setTimeout(function(){
        //         client.end();
        //         console.log("COM END");
        //         com =false;
        //     },1000);

        // });
        // client.on('end', function() { 
        //     console.log('disconnected from server');
        //  });

        const sendBack = {
            msg: 'Testing Success',
        }
        sendToEcr['socket'].emit("emiter", sendBack);
    } else {
        console.log("Com not connect");
        const sendBack = {
            msg: 'Com not connect',
        }
        sendToEcr['socket'].emit("emiter", sendBack);
    }
}

function comClose() {
    console.log('comClose Request');
    client.destroy();
    if (com == true) {
        client.end();
        console.log("COM END");
        com = false;

    } else {
        console.log("Com Closed");
    }

}

function comCashLan(sendToEcr = []) {
    let i = 0;
    let data = new Date();
    let bufferLock = false;
    if (com == true) {
        client.write(sendToEcr['ascii']);
        console.log("\n\n", "Start Write ", i, Math.random() * 100);

        if (bufferLock == false) {
            //Handle data coming from the server
            client.on('data', function (data) {
                i++;
                console.log('Client comCashLan get on.data  ');
                let hex = data.toString('hex');
                if (hex == '15') {
                    console.log("NAK (15H), NAK indicates that the receiver requests the retransmission of the  last message that was received in error");
                    client.write('\x15');
                }

                if (hex == '06') {
                    console.log('ACK (06H)');
                    client.write('\x06');
                }
                bufferLock = true;
                let respString = hexToAscii(hex);
                const sendBack = {
                    hex: hex,
                    ascii: respString,
                    respCode: respString.slice(53, 55),
                    transType: sendToEcr['transType'],
                }
                sendToEcr['socket'].emit("emiter", sendBack);

                console.log("i", i, Math.random() * 100, hex, bufferLock,);

            });
        }

    } else {
        console.log("Com not connect");
        const sendBack = {
            respCode: 'ER01',
            transType: sendToEcr['transType'],
        }
        sendToEcr['socket'].emit("emiter", sendBack);
    }
}


function transType31(sendToEcr = []) {
    if (com == true) {
        const sendBack = {
            msg: 'waiting',
            data: sendToEcr['data'],
        }
        sendToEcr['socket'].emit("emiter", sendBack);

        client.write(hexToAscii(sendToEcr['data']['hex']));
        client.on('data', function (data) {

            let hex = data.toString('hex');
            if (hex == '15') {
                console.log("NAK (15H), NAK indicates that the receiver requests the retransmission of the  last message that was received in error");
                client.write('\x15');
            }

            if (hex == '06') {
                console.log('ACK (06H)');
                client.write('\x06');
            }
            bufferLock = true;
            let respString = hexToAscii(hex);
            const sendBack = {
                hex: hex,
                ascii: respString,
                respCode: respString.slice(53, 55),
                transType: sendToEcr['transType'],
            }
            sendToEcr['socket'].emit("emiter", sendBack);
        });
    } else {
        console.log("Com not connect");
        const sendBack = {
            respCode: 'ER01',
            transType: sendToEcr['transType'],
        }
        sendToEcr['socket'].emit("emiter", sendBack);
    }
}

