var express = require('express');
var http = require('http');
var app = express();
//var server = http.createServer(app).listen(8080);
var server = http.Server(app);
var fs=require("fs");
var OpenTok = require('opentok');

var apiKey='45408722';
var apiSecret='eeae237d8d9fdc7effc013ade7432188090ae1f5';

opentok = new OpenTok(apiKey, apiSecret);

app.use(express.static(__dirname+'/pub'));


app.get('index.html',function(){
    res.sendFile(__dirname+'/index.html');
});


app.get('*',function(req,res){

    console.log('incoming....');
    //res.redirect('default.html');
    res.sendFile(__dirname+'/try.html');
});

/*
app.get('/',function(req,res){
	//res.sendFile(__dirname + '/index.html');

	console.log(req.path);

    fs.readFile('index.html',function (err, data){
        if(!err)
        {
            res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
            res.write(data);
            res.end();
        }
        else
        {
            res.writeHead(400, {'Content-Type': 'text/html'});
            res.end("index.html not found");
        }
    });
});


io.on('connection', function (socket) {

    console.log('a user connected');

    socket.on('send message',function(data){

            io.emit('new message',data);
            //socket.broadcast.emit('new message',data);
    });

});





app.get("/css/*",function(req,res){
	console.log("Request:" +req.url);
	res.sendFile(__dirname + req.url);

});

app.get("/js/*",function(req,res){
    console.log("Request:" +req.url);
    res.sendFile(__dirname + req.url);

});

app.get("/img/*",function(req,res){
	console.log("Request:" +req.url);
	res.sendFile(__dirname + req.url);

});

app.get("*",function(req,res){
    console.log("Request:" +req.url);
    res.send('<center> <h1>What the..??? 404...!!</h1> </center>');

});

*/

server.listen(8080, function(){
  console.log('listening on *: 8080');
});