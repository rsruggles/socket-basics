var moment = require('moment');

var now = moment();

//console.log(now.format());

// UNIX time (seconds since 12:00am UTC January first 1970)
//console.log(now.format('X'));
//
//console.log(now.format('x'));

var timeStamp = 1510284856406;

var timeStampMoment = moment.utc(timeStamp);

console.log(timeStampMoment.local().format('h:mma'));

//console.log(now.format('h:mma'));
//
//console.log(now.format('MMM Do YYYY, h:mma'));