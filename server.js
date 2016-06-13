var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ClientOAuth2 = require('client-oauth2')
var port = 8090;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

var chronotrackAuth = new ClientOAuth2({
  clientId: '6e42ab44',
  clientSecret: 'b24fa5fd0a4a2f9e15f8b42b1419a1f5d1635908',
  accessTokenUri: 'https://qa-api.chronotrack.com/oauth2/token',
  authorizationUri: 'https://qa-api.chronotrack.com/oauth2/authorize',
  authorizationGrants: ['credentials'],
  redirectUri: 'http://localhost:8090/auth/callback',
  scopes: ['notifications', 'gist']
}) 
var storeNewToken;
var token = chronotrackAuth.createToken('afguzmans3@gmail.com', 'smartsports', 'bearer')

// Refresh the users credentials and save the updated access token.
token.refresh().then(storeNewToken)

token.request({
  method: 'get',
  url: 'https://qa-api.chronotrack.com/api/event'
})
  .then(function (res) {
    console.log(res) //=> { body: '...', status: 200, headers: { ... } }
})
// test route to make sure everything is working (accessed at GET http://localhost:8090/iot)
app.get('/auth/callback', function(req, res) {
    res.json({test:'successful!'});   
});

app.listen(port);
console.log('The App runs on port: ' +port);