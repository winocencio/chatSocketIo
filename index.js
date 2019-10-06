var app = require('express')();
var http = require('http').createServer(app);
var express = require('express');
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('usuario connectado: ' + socket.id);
    socket.broadcast.emit('userConnect', { userId : socket.id});

    socket.on('message', function(msg){
        io.emit('envMessage',{userId : socket.id, msg });
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});