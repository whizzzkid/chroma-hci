/////////// Server Part
var stdin = process.stdin;
var express = require('express'),
    app = express();

var server = app.listen(55555,function(){
    console.log('Port:',this.address().port);
});

var io = require('socket.io')(server);
// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

// on any data into stdin
stdin.on( 'data', function( key ){
    // ctrl-c ( end of text )
    if ( key === '\u0003' ) {
        process.exit();
    }
    // write the key to stdout all normal like
    process.stdout.write( key );

    if(waitList.length){
        console.log('lengt is above 0');
        var f = waitList.shift();
        f(key);
    }

});

var waitList = [];

io.on('connection', function(socket) {
    socket.on('select:eech', function(msg){
        console.log(msg);

        (function(s){
            waitList.push(function(item){
                console.log('waitList');
                s.emit('res', "hi"+item);
            })
        })(socket);
    });

});


/////////// Client Part

var socket = require('socket.io-client')('http://localhost:55555');

socket.emit('select:eech', "hello world!");

socket.on('res', function(msg){
    console.log(msg);
});
