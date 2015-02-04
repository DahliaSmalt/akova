//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var db = require('mongoose')
db.connect(process.env.MONGOLAB_URI);

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

var Herald = db.model('Herald', {});

Herald.prototype.makeAListOfMyNeeds = function() {
  
}

Herald.prototype.shouldMove = function() {
  
}

Herald.prototype.bowTo = function(god) {
  this.god = god;
}

Herald.prototype.youCanSpeakToMeVia = function(socket) {
  this.socket = socket;
}

Herald.prototype.stopReportToMeBecauseIAfk = function() {
  delete this.socket;
}

Herald.prototype.tellItToMyGod = function() {
  this.socket.emit('action');
}

Herald.prototype.animate = function() {
  var me = this;
  me.makeAListOfMyNeeds();
  
  me.decideWhatToDo();
  
  if(me.shouldMove()) {
    me.decideWhereToGo();
    me.move();
  } else {
    me.doIt();
  }
  
  me.tellItToMyGod();
}

var God = db.model('God', {});

God.prototype.lose = function(artifact) {
  this.artifacts.remove(artifact);
}

God.prototype.giveLife = function() {
  var me = this;
  
  if(me.has('human_seed')) {
    var herald = new Herald();
    herald.speed = 1;
    herald.bowTo(me);
    me.heralds.push(herald);
    me.lose('human_seed');
  }
}

io.on('connection', function (socket) {
  var me = new God();
  
  me.heralds.forEach(function(herald) {
    herald.youCanSpeakToMeVia(socket); // God has appeared, heralds must bow and tell everything to his god.
  });
  
  socket.on('giveLife', function() {
    me.giveLife();
  });
  
  socket.on('disconnect', function () {
    me.heralds.forEach(function(herald) {
      herald.stopReportToMeBecauseIAfk();
    });
  });
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
