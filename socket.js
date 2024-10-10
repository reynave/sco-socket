const app = require('express')();
const { addLogs, } = require('./model/logs');
const http = require('http').Server(app);
const port = 3000;
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Ganti dengan URL frontend Angular Anda jika dibutuhkan
    },
});
let user = 0;
io.on('connection', (socket) => {
    user++;
    console.log('a user connected ' + user);

    // Mengirim pesan ke client
    //socket.emit('message', 'Hello from server');

    socket.on("data", (arg) => {
        //console.log("io.emit",arg); 
        io.emit("emiter", arg);
    });

    socket.on('elapsed_time', (data) => { 
        let date = new Date(  data['date'] *1000);
        let hhii = ("0" + date.getHours()).slice(-2)+":"+("0" + date.getMinutes()).slice(-2)+":"+("0" + date.getSeconds()).slice(-2)
        let str  = hhii+','+data['terminalId']+','+data['bill']+','+data['time'];
        addLogs('time',str); 
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
    console.log('listening on *:3000');
});

