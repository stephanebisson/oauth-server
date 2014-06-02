var express = require('express'),
	mongoose = require('mongoose'),
  oauthserver = require('node-oauth2-server'),
  hanson = require('hanson');

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

app.get('/user', app.oauth.authorise(), function (req, res) {
	var user = hanson.parse(req.user.id.replace(/(_id\:.*?,)/, ''));
  res.json(200, {
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		bsauth_id: 12345
  });
});

var OAuthUsersSchema = require('./user.js');

app.post('/users', function(req, res, next) {
	console.log('creating user with', req.body);
	var user = new OAuthUsersSchema(req.body);
	user.save(function(err){
		if (err) {
			console.log('error creating user', err);
			res.send(500, err);
		} else {
			res.send(201);
		}
	});
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


