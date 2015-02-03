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

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

//var Herald = db('herald');
var Herald = function() {
  this.god;
  
  this.speed = 1;
  this.needs = {
    food: 0,
    gold: 0,
    life: 0
  }
  
  this.memory = {
    locations: [
      {
        x: 12,
        y: 4,
        gauges: {
          food: 50,
          gold: 10
        }
      }
    ]
  }
};

Herald.prototype.calculateNeeds = function() {
  
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

Herald.prototype.tellItToGod = function() {
  this.socket.emit('action');
}

Herald.prototype.animate = function() {
  this.calculateNeeds();
  
  if(this.shouldMove()) {
    this.decideLocation();
    this.move();
  } else {
    this.act();
  }
  
  this.reportToGod();
}

var God = function() {
  this.heralds = [];
  this.artifacts = [];
};

God.prototype.lose = function(artifact) {
  this.artifacts.remove(artifact);
}

God.prototype.giveLife = function() {
  var me = this;
  
  if(me.has('human_seed')) {
    var herald = new Herald();
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
