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
var socket = io();

socket.on('connect', function () {
  console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
  console.log('New Message:');
  console.log(message.text);
  
  jQuery('.messages').append('<p>' + message.text + '</p>');
});

// Handles Submitting New Message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
  event.preventDefault();
  var $txtInput = $form.find('input[name=message]');
  socket.emit('message', {
    text: $txtInput.val() //pulls text from an input on $form named 'message' (our input.type = text name = message)
  });
  $txtInput.val('');
});