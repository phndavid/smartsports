var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');

var Event = require("./models/event.js");
var Athlete = require("./models/athlete.js");
var Race = require ("./models/race.js");

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
var query_result = "/api/event/"+event_id+"/results?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"&size=1600&include_test_entries=true&elide_json=false;";
var query_race = "/api/event/"+event_id+"/race?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"&page=1&size=50&include_not_wants_results=true";

var event;
//Se registra el evento
function getEvent(){
    var url = hostname+query_event;
      request(url, function(err, resp, body) {
        body = JSON.parse(body);
        event = body.event;
        registerEvent(event);
      });      
}
function registerEvent(event){
  //Registra el evento si no se ha registrado
  Event.find({},function(err,events){
    if(err){
      console.log("algo paso");
    }else{
        var newEvent = Event({
          id: event.event_id,
          name: event.event_name,
          description: event.event_description,
          country: event.location_country,
          startTime: new Date(Number(event.event_start_time)*1000),
          endTime: new Date(Number(event.event_end_time)*1000),
          siteURI: event.event_site_uri,
          organizationName: event.organization_name
        });
        newEvent.save(function(err){
          if(err){
            console.log("algo paso:" + err);
          }else{
          }
        });
    }
  });
}

//Se registran los atletas
var athletes = [];
function getAtletas(){
    var urls = hostname+query_users;
    // request module is used to process the chrotrack url and return the results in JSON format
     request(urls, function(err, resp, body) {
       body = JSON.parse(body);
       athletes = body.event_entry;
       registerAthletes();
     });   

}
function registerAthletes(){
  Athlete.find({},function(err,athls){
    if(err){
      console.log("algo paso");
    }else{
      if(athls.length==0){
        athletes.forEach(function(value,index){
          var newAthlete = Athlete({
            id: value.athlete_id, 
            name: value.entry_name,
            status: value.entry_status,
            age: 15,
            number: 15, 
            sex: value.athlete_sex
          });
          newAthlete.save(function(err){
            if(err){
              console.log("algo paso: " + err);
            }
          });
        });
      }
    }
  });
}

// Se registran las carreras
var races = [];
function getRace(){
var url = hostname+query_race;
      request(url, function(err, resp, body) {
        body = JSON.parse(body);
        console.log(body)
        races = body.event_race;
        registerRace(races);
      }); 
}
function registerRace(race){
   Race.find({},function(err,racs){
    if(err){
      console.log("algo paso");
    }else{
      if(racs.length==0){
        races.forEach(function(value,index){
          var newRace = Race({
            id: value.race_id,
            name: value.race_name,
            type: value.race_type,
            subType: value.race_subtype,
            distance: value.race_course_distance,
            distanceUnit: value.race_pref_distance_unit, 
            plannedStartTime: new Date(Number(value.race_planned_start_time)*1000),
            plannedFinishTime: new Date(Number(value.race_planned_end_time)*1000),
            raceActualStartTime: new Date(Number(value.race_actual_end_time)*1000), 
            raceActualFinishTime: new Date(Number(value.race_age_ref_time)*1000)
          });
          newRace.save(function(err){
            if(err){
              console.log("algo paso: " + err);
            }
          });
        });
      }
    }
  });
}
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
  getEvent();
  getAtletas();
  getRace();
    console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), ipaddress, port);
 });