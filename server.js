var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

var client_id = "727dae7f";
var user_id = "afguzmans3%40gmail.com";
var user_pass = "c16975b43862ff2fe4537d7eee5566af7b80f9d5";
var hostname = "https://api.chronotrack.com:443";
var event_id = "7849";
var query_event = "/api/event/"+event_id+"?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass;
var user_id = "7445801";
var query_users = "/api/entry/"+user_id+"?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass;
app.get('/event', function(req, res) {
    var url = hostname+query_event;
    console.log(url);
    // request module is used to process the chrotrack url and return the results in JSON format
     request(url, function(err, resp, body) {
       body = JSON.parse(body);
       res.json({body});
     });   
});

app.get('/event/users', function(req, res) {
    var url = hostname+query_users;
    console.log(url);
    // request module is used to process the chrotrack url and return the results in JSON format
     request(url, function(err, resp, body) {
       body = JSON.parse(body);
       res.json({body});
     });   
});
app.listen(port, ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
 });
