var express = require('express'),
	mongoose = require('mongoose'),
  oauthserver = require('node-oauth2-server');

var app = express();

app.configure(function() {
  app.oauth = oauthserver({
    model: require('./model'),
    grants: ['password'],
    debug: true
  });
  app.use(express.bodyParser()); // REQUIRED
});

app.all('/oauth/token', function(req, res, next) {
	// console.log(req);
	return next();
}, app.oauth.grant());

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});

app.use(app.oauth.errorHandler());

mongoose.connect(process.env.MONGOHQ_URL, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to mongo. ' + err);
  } else {
    console.log ('Succeeded connected to mongo');
    var port = Number(process.env.PORT || 3000);
    app.listen(port);
  }
});


