var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
var path = require('path');
var fs = require('fs');
//var server = http.createServer(app).listen(8080);

var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8',function(){
						console.log('Cannot load Server PrivateKey');
		});
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8',function(){
				console.log('Cannot load Server Certificate !');
});
var credentials = {key: privateKey, cert: certificate};

var server = http.Server(app);

//Https Configurations

//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

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

app.get('/check',function(req, res, next){

token = session.generateToken({
          role :       'subscriber',
          data :       'name=Jim'
    });
    
    token = session.generateToken();
    res.status(200);
    res.render('check', { tok : token,
                          APIKey: apiKey,
                          session_id: GLOBAL.session.sessionId
                         });

});

app.get('/again/:idd/:name',function(req, res, next){ 

  var user_id= req.params.idd;
  var user_name= req.params.name;
	console.log(user_id+'  '+user_name+'  incoming...');

  var role='';
  var dataStr= '';

    if(user_id==1){
      role='publisher'; dataStr='name='+user_name;
      console.log(role+ ' here...');
    }
    else{
      role='subscriber'; dataStr='name='+user_name;
      console.log(role+ 'here....');
    }


token = session.generateToken({
          role :   role,
          data :   dataStr
      });
    
    token = session.generateToken();

    
    res.status(200);
    res.render('again', { tok : token,
                          APIKey: apiKey,
                          session_id: GLOBAL.session.sessionId,
                          role: role,
                          user_name: user_name
                         });

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

/*server.listen(8080, function(){
  console.log('listening on *: 8080');
});*/

httpsServer.listen(8080, function(){
	console.log('Listening on ... * : 8080');
});