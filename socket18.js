const app = require('express')();
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
        console.log("io.emit");
        io.emit("emiter", arg);
    });

    // socket.on('disconnect', () => {
    //     console.log('A user disconnected');
    // });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
    console.log('listening on *:3000');
});

