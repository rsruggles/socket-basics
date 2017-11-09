var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

// io connection event. We log a console message when a user joins the connection here
// there are plenty of other io events in their documentation
io.on('connection', function () {
  console.log('User connect via socket.io!');
});

http.listen(PORT, function(){
  console.log('Server started!');
});