//
// var Server = require('socket.io');
// var io = new Server(3050, {});
//PORT to connect to

const PORT = 3051;

//Instantiate socket server
var app = require('http').createServer().listen(PORT);
var io = require('socket.io').listen(app);

//Simple echo server
io.on('connection', function(socketconnection){
    socketconnection.send("Connected to Server-1");

    socketconnection.on('message', function(message){
        socketconnection.send(message);
    });
});
