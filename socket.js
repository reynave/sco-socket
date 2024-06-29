const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);  
const env_port = 3000;
 
let user = 0; 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(env_port, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    user++;
    console.log('a user connected ' + user);

    socket.on("data", (arg) => { 
            console.log("io.emit");
            io.emit("emiter", arg); 
    });

});
 