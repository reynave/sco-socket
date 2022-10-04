const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let user = 0;

app.get('/', (req, res) => { 
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    user++;
    console.log('a user connected ' + user);
 
    socket.on("data", (arg) => {
        console.log(arg);
        // Broadcase
        io.emit("emiter",arg); 

        // Self only (ex ajax)
        // socket.emit("fromServer",{msg2:"sudah terima"});
    });

});


server.listen(3000, () => {
    console.log('listening on *:3000');
});