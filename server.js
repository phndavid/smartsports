var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
//var Event = require("./model/event").Event;
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
if (typeof ipaddress === "undefined") {
          //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
          //  allows us to run/test the app locally.
          console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
          ipaddress = "127.0.0.1";
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

var client_id = "727dae7f";
var user_id = "afguzmans3%40gmail.com";
var user_pass = "c16975b43862ff2fe4537d7eee5566af7b80f9d5";
var hostname = "https://api.chronotrack.com:443";
var event_id = "22643";
var query_event = "/api/event/"+event_id+"?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass;
var query_users = "/api/event/"+event_id+"/entry?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"&size=1600&include_test_entries=true&elide_json=false;";
var query_result = "/api/event/"+event_id+"/results?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"&size=1600&include_test_entries=true&elide_json=false;"


app.get('/event', function(req, res) {
    var url = hostname+query_event;
    console.log(url);
    // request module is used to process the chrotrack url and return the results in JSON format
     request(url, function(err, resp, body) {
       body = JSON.parse(body);
       res.json(body);
     });   
});
app.get('/event/users', function(req, res) {
    var urls = hostname+query_users;
    console.log(urls);
    // request module is used to process the chrotrack url and return the results in JSON format
     request(urls, function(err, resp, body) {
       body = JSON.parse(body);
       res.json(body);
     });   
});
app.get('/event/users/results', function(req, res) {
    var urls = hostname+query_result;
    console.log(urls);
    // request module is used to process the chrotrack url and return the results in JSON format
     request(urls, function(err, resp, body) {
       body = JSON.parse(body);
       res.json(body);
     });   
});
app.listen(port, ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), ipaddress, port);
 });
