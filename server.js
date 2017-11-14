var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
  var users = getUsers(socket);
  socket.emit('message', {
    name: 'System',
    text: 'Current users: ' + users.join(', '),
    timestamp: moment().valueOf
  });
}

function getUsers(socket) {
  var info = clientInfo[socket.id];
  var users = [];
  
  if (typeof info === 'undefined') {
    return;
  }
  
  Object.keys(clientInfo).forEach(function (socketId) {
  var userInfo = clientInfo[socketId];
  
    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });
  return users;
}

// io connection event. We log a console message when a user joins the connection here
// there are plenty of other io events in their documentation
io.on('connection', function (socket) { // socket passed is associated with the individual users socket, but the socket scope isn't required for basic functionality
  console.log('User connect via socket.io!');
  
  socket.on('disconnect', function () {
    var userData = clientInfo[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('message', {
        name: 'System',
        text: userData.name + ' has left the lobby.',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });
  
  socket.on('joinRoom', function (req) {
    var users = [];
    var users = getUsers(socket);
//    var users = req;

    clientInfo[socket.id] = req;
    socket.join(req.room);
    
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: moment().valueOf
    });
    
    // Update Users List
//    if (typeof users === 'undefined') {
//      console.log('users undefined')
//      console.dir(socket.in);
//    } else {
//      socket.emit('userUpdate', {
//        users: users
//      });
//      console.log(typeof users);
//    }
  });
  
  socket.on('message', function (message) {
    console.log('Message recieved: ' + message.text);
    // io.emit sends to everyone
    //socket.broadcast.emit('message', message); // socket.emit sends to everyone except the sender
    
    if (message.text === '@currentUsers') {
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
    }   
  });
  
  // timestamp property
  
  socket.emit('message', {
    name: 'System',
    text: 'Welcome to the chat application!',
    timestamp: moment().valueOf()
  });
  
});

http.listen(PORT, function(){
  console.log('Server started!');
});