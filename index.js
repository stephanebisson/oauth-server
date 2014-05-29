var express = require('express'),
  oauthserver = require('node-oauth2-server');

var app = express();

app.configure(function() {
  app.oauth = oauthserver({
    model: {
    	getAccessToken: function (bearerToken, callback) {
    		console.log('getAccessToken', arguments);
    		return callback(null, {expires: null, userId: 1});
    	},
    	getClient: function(clientId, clientSecret, callback) {
    		console.log('getClient', arguments);
    		return callback(null, {clientId: clientId});
    	},
    	grantTypeAllowed: function(clientId, grantType, callback) {
    		console.log('grantTypeAllowed', arguments);
    		var allowed = clientId === 1 && grantType === 'password';
    		return callback(null, true);
    	},
    	saveAccessToken: function(accessToken, clientId, expires, user, callback) {
    		console.log('saveAccessToken', arguments);
    		return callback(null);
    	},
    	getUser: function(username, password, callback) {
    		console.log('getUser', arguments);
    		return callback(null, {id: 1});
    	}
    },
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

app.listen(3000);