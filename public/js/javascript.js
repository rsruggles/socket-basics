//////////////////
//  NAVIGATION  //
//////////////////
$('.menu-btn').click(function() {
  console.log('toggle navigation');
  $('.menu').slideToggle(200);
});

$(window).resize(function(){
  if ($(window).width() > 680) {
    if ( $('.menu').css('display') == 'none' ){
      $('.menu').show();
    }
  } else {
    $('.menu').hide();
  }
});



function scrollSmooth (id) {
  var div = document.getElementById(id);
  $('#' + id).animate({
    scrollTop: div.scrollHeight - div.clientHeight
  }, 300);
}



//////////////////////
//  SOCKET.IO INIT  //
//////////////////////
var name = getQueryVariable('name') || 'Guest' + (Math.floor(Math.random() * 9999) + 1000);
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

jQuery('.room-title').text(room);

socket.on('connect', function () {
  console.log('Connected to socket.io server!');
  socket.emit('joinRoom', {
    name: name,
    room: room
  });
});

socket.on('message', function (message) {
  var momentTimeStamp = moment.utc(message.timestamp);
  var $message = jQuery('.messages')
  console.log('New Message:');
  console.log(message.text);
  
  $message.append('<p>' + momentTimeStamp.local().format('h:mm') + ' <strong>' + message.name + ':</strong> ' +  message.text + '</p><br/>');
  scrollSmooth('msgBody');
  //$message.append('<p>' + message.text + '</p>');
});

//socket.on('userUpdate', function (userList) {
//  var $users = jQuery('.users');  
//  $users.html(userList.users);
//  console.log('USERS: ' + userList.users)
//});

// Handles Submitting New Message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
  event.preventDefault();
  var $txtInput = $form.find('input[name=message]');
  socket.emit('message', {
    name: name,
    text: $txtInput.val() //pulls text from an input on $form named 'message' (our input.type = text name = message)
  });
  $txtInput.val('');
});