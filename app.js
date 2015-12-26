var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
var path = require('path');
var fs = require('fs');
var OpenTok = require('opentok');
//var server = http.createServer(app).listen(8080);

var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8',function(){
						console.log('Cannot load Server PrivateKey');
		});
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8',function(){
				console.log('Cannot load Server Certificate !');
});
var credentials = {key: privateKey, cert: certificate};

//var server = http.Server(app);
//var httpServer = http.createServer(app);

//Https Configurations
var httpsServer = https.createServer(credentials, app);

app.use(express.static(__dirname+'/pub'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

GLOBAL.session='';
GLOBAL.token='';
GLOBAL.arch='';

var count=10;
var apiKey='you api key';
var apiSecret='Your api secret';
opentok = new OpenTok(apiKey, apiSecret);


//Creating a Session !
opentok.createSession({mediaMode:"routed"}, function(error, session) {
  if (error) {
    console.log("Error creating session:", error)
  } else {
      // save the sessionId
      console.log('Session Created, Details : ');
      console.log(session);
      GLOBAL.session= session;
      console.log('############################');
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

  var role='';
  var dataStr= '';

    if(user_id==1){
      role='publisher'; dataStr='name='+user_name;
      console.log(user_id+'  '+role+ ' here...');
    }else{
      role='subscriber'; dataStr='name='+user_name;
      console.log(user_id+'  '+role+ ' here....');
    }

    token = session.generateToken({
          role :   role,
          data :   dataStr
      });
    
    token = session.generateToken();

    console.log('Token for '+user_name+' : '+ token);

    res.status(200);
    res.render('again', { tok : token,
                          APIKey: apiKey,
                          session_id: GLOBAL.session.sessionId,
                          role: role,
                          user_name: user_name
                         });
});

app.get('/startIt',function(req,res,next){

    var archiveOptions = {
      name: 'Ten Users '+ count,
      //outputMode: 'individual'
      hasVideo: true  // Record audio only
    };

    count++;

    opentok.startArchive(GLOBAL.session.sessionId, archiveOptions, function(err, archive) {
        if (err) {
           console.log('Start archiveErr : '+err);
           res.status(200);
           res.send({stat: 'NO'});
        } else {
          // The id property is useful to save off into a database
              GLOBAL.arch=archive;
              console.log("new archive:" + archive.id);
              console.log(GLOBAL.arch);
              fs.appendFile('archives.txt', JSON.stringify(GLOBAL.arch)+"\r\n\n", function (err) {
                    if(err){ console.log('Could not write to file...'); }
              });
              
              res.status(200);
              res.send({stat: 'YO'});
        }
    });
});
app.get('/stopIt',function(req,res,next){

      console.log(GLOBAL.arch.id);

      opentok.stopArchive(GLOBAL.arch.id, function(err, archive) {
        if (err){
            console.log('Stop archiveErr : '+err);
            res.status(200);
            res.send({stat: 'NO'});
        } 

        else{
            console.log("Stopped archive:" + GLOBAL.arch.id);
            res.status(200);
            res.send({stat: 'YO'});
        }

      });

      /*archive.stop(function(err, archive) {
        if (err) return console.log(err);
      });*/
});
app.get('/getDetails',function(){ 

    opentok.getArchive(GLOBAL.arch.archiveId, function(err, archive) {
    if (err) return console.log(err);

    console.log(archive);
    });

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