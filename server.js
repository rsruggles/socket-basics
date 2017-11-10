var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// io connection event. We log a console message when a user joins the connection here
// there are plenty of other io events in their documentation
io.on('connection', function (socket) { // socket passed is associated with the individual users socket, but the socket scope isn't required for basic functionality
  console.log('User connect via socket.io!');
  
  socket.on('joinRoom', function (req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: moment().valueOf
    });
  });
  
  socket.on('message', function (message) {
    console.log('Message recieved: ' + message.text);
    // io.emit sends to everyone
    //socket.broadcast.emit('message', message); // socket.emit sends to everyone except the sender
    message.timestamp = moment().valueOf();
    io.to(clientInfo[socket.id].room).emit('message', message);
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