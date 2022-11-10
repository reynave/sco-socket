const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { SerialPort } = require('serialport')
let dataTxtString = "P17000000000000000000000000                       00000000000000  N00000                                                                              ";

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
            if (arg['msg'] == 'bcaCash') {
                 bcaEcr(arg);
                console.log("debit masuk");
            }
           // setInterval(function () {
                date = new Date();
                socket.emit("emiter",{data:"ERC loop "+date});
           //     io.emit("emiter",{msg2:"ERC loop "+date});
           // }, 1000);
            
        } else {
            // Broadcase
            io.emit("emiter", arg);
        }


    });

});


server.listen(3000, () => {
    console.log('listening on *:3000');
});

function bcaEcr(arg) {
   
    port.open(function (res) {
        if (res) {
            console.log(res.name, ', opening port: ', res.message);
        } else {
            console.log('com3 Open');
        }

        port.write(arg['txt'], function (err) {
            if (err) throw err;
        });
        let i = 0;
        let read = "";
        setInterval(function () {
            i++;
           
            //if( port.read() != null){ 
                console.log(i, port.read()?.toString('hex')||'' );
            //}
            //console.log(" loop i ", i);
        }, 250);

    });
}