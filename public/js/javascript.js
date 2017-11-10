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

//////////////////////
//  SOCKET.IO INIT  //
//////////////////////
var name = getQueryVariable('name') || 'Guest' + (Math.floor(Math.random() * 9999) + 1000);
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);


socket.on('connect', function () {
  console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
  var momentTimeStamp = moment.utc(message.timestamp);
  var $message = jQuery('.messages')
  console.log('New Message:');
  console.log(message.text);
  
  $message.append('<p><strong>' + message.name + ' ' + momentTimeStamp.local().format('h:mm a') + '</strong></p>');
  $message.append('<p>' + message.text + '</p>');
});

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