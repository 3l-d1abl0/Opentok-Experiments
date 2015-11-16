var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
//var server = http.createServer(app).listen(8080);
var server = http.Server(app);
var fs=require("fs");
var OpenTok = require('opentok');

var apiKey='45408722';
var apiSecret='eeae237d8d9fdc7effc013ade7432188090ae1f5';

opentok = new OpenTok(apiKey, apiSecret);

app.use(express.static(__dirname+'/pub'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

GLOBAL.session='';
GLOBAL.token='';

//Creating a Session !
opentok.createSession({mediaMode:"routed"}, function(error, session) {
  if (error) {
    console.log("Error creating session:", error)
  } else {

  // save the sessionId
  console.log(session);
  GLOBAL.session= session;
  console.log('Created Session : '+ session.sessionId);
  //db.save('session', session.sessionId, done);
  }
});


app.get('/index/:iid',function(req, res, next){
    console.log('req for index...');
    console.log('Sess '+ session);
    //res.sendFile(__dirname+'/index.html');

    user_id= req.params.iid;

    token = session.generateToken({
          role :       'subscriber',
          data :       'name=Johnny'
    });
    
    token = session.generateToken();

    //console.log('Token : '+ JSON.stringify(token));

    var role='';

    if(user_id==1){
      role='pub'; console.log(role+ ' here...');
    }
    else{
      role='sub'; console.log(role+ 'here....');
    }

    res.status(200);
    res.render('index', { tok : token,
                          APIKey: apiKey,
                          session_id: GLOBAL.session.sessionId,
                          role: role
                         });
});

app.get('/try',function(req, res, next){

    console.log('incoming....');
    //res.redirect('default.html');
    res.sendFile(__dirname+'/try.html');
});

app.get('/session',function(req,res,next){

    var dt={

      apiKey : apiKey,
      sessionId : session.sessionId,
      token : token
    };

    res.status(200);
    res.send(dt);
});

app.get('*',function(err,req, res, next) {
    console.log('REQ::: '+req.url);
  res.status(err.status || 404);
  res.render('error', {
    title: 'Not Found',
    message: err.message,
    short_msg : '404'
  });
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