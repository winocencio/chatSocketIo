var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client){
    console.log('client connectado: ' + client.id + " - " + client.handshake.query.name);

    client.broadcast.emit('userConnect', { id : client.id , name: client.handshake.query.name});

    client.on('envMessage', function(data){
        var user = { id : client.id , name: data.userName}
        io.emit('envMessage',{user, message : data.message});
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});