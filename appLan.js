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
        //console.log(arg);

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
                    comCashLan(sendToEcr);
                }
                // BCA QRIS
                if (arg['transType'] == '31') {
                    comCashLan(sendToEcr);
                }
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
    if (com == true) {
        client.on('data', function (data) {
            console.log('comClear : ', data.toString('hex'));
        });
    } else {
        console.log("Com not connect");
    }
}

function comTest(sendToEcr) {
    if (com == true) {
        client.write(dataTxtString);
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
    
    if (com == true) {
        console.log("comClose", com);
        client.on('destroyed', function () {
            console.log('destroyed :Connection end');
        });
        client.on('end', function () {
            console.log('client :Connection end');
        });
        
          
    } else {
        console.log("Com Closed");
    }

}

function comCashLan(sendToEcr = []) {
    if (com == true) {
        client.write(sendToEcr['ascii']);

        //Handle data coming from the server
        client.on('data', function (data) {
            console.log('Client comCashLan get on.data  '); 
            let hex = data.toString('hex');
            if(hex == '15'){
                console.log("NAK (15H), NAK indicates that the receiver requests the retransmission of the  last message that was received in error");
                client.write('\x15');
            }else{
                client.write('\x06');
            } 
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


 