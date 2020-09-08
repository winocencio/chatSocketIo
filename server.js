var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var db = require('./database.js');

app.use(express.static(__dirname + '/static'));

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res){
    res.sendFile(__dirname + '/cannon.html');
});

io.on('connection', function(client){
    console.log('client connectado: ' + client.id + " - " + client.handshake.query.name);

    var user = { id : client.id , name: client.handshake.query.name , score: 0};
    db.getCollection('scoreboard').insert(user);
    db.saveDatabase();
    var all = db.getCollection('scoreboard').data;
    io.emit('someoneScore',all);

    client.broadcast.emit('userConnect', user);

    client.on('envMessage', function(data){
        var user = { id : client.id , name: data.userName}
        io.emit('envMessage',{user, message : data.message});
    });

    client.on('disconnect', () => {
        console.log('client desconectado: ' + client.id);
        db.getCollection('scoreboard').removeWhere({id : client.id});
        db.saveDatabase();
        var all = db.getCollection('scoreboard').data;
        io.emit('someoneScore',all);
    });

    client.on('meScore', function(){
        db.getCollection('scoreboard').chain().find({id : client.id}).update(function(obj){
            obj.score += 1; 
        });
        db.saveDatabase();

        
        var all = db.getCollection('scoreboard').data;
        io.emit('someoneScore',all);
    });
});

http.listen(80, function(){
    console.log('listening on *:80');
});