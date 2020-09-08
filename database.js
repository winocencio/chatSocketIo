var loki = require('lokijs');
var db = new loki('db.json');

db.removeCollection('scoreboard');
db.addCollection('scoreboard');
db.saveDatabase();

module.exports = db;