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
//var query_result_by_race = "/api/race/"+race_id+"results?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"page=1&size=1600&mode=ctlive";

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
function checkRepitedAthletes(arrayAthletes) {
  for(var i=0; i<arrayAthletes.length;i++){
    if(arrayAthletes[i]!=undefined){
      arrayAthletes[i].races = [];
      arrayAthletes[i].races.push(arrayAthletes[i].race_name);
      for(var j=i+1;j<arrayAthletes.length;j++){
        if(arrayAthletes[j]!=undefined && (arrayAthletes[i].entry_name == arrayAthletes[j].entry_name)){
          arrayAthletes[i].races.push(arrayAthletes[j].race_name);
          delete arrayAthletes[j];      
        }
      }
    }
  }
}
function getAtletas(){
    var urls = hostname+query_users;
    // request module is used to process the chrotrack url and return the results in JSON format
     request(urls, function(err, resp, body) {
       body = JSON.parse(body);
       athletes = body.event_entry;
       checkRepitedAthletes(athletes);
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
            athlete_id: value.athlete_id, 
            entry_name: value.entry_name,
            entry_status: value.entry_status,
            entry_bib: value.entry_bib, 
            races: value.races,
            bracket_name: value.bracket_name
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

/** 
  @method overallStanding
  @description 
  @param bracket
  @param res
**/
function overallStanding(bracket,res){
  var theBracket = bracket.replace(" ","%20")
  var query_results_total = "/api/event/"+event_id+"/results?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"&page=1&size=1600";
  var query_results_total_with_bracket = "/api/event/"+event_id+"/results?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"&page=1&size=1600&bracket="+theBracket;
  if(bracket=="overall"){
    var uri_crhono = hostname + query_results_total;
    request(uri_crhono,function(err,resp,body){
      body = JSON.parse(body);
      var theTotalResults = body.event_results; 
      var JSONToSend = processTotalResult(theTotalResults);
      bubbleSort(JSONToSend);
      res.json(JSONToSend);
      //console.log(JSONToSend);
    });
  }else{
    var uri_crhono_bracket = hostname + query_results_total_with_bracket;
    //console.log(uri_crhono_bracket);
    request(uri_crhono_bracket,function(err,resp,body){
      body = JSON.parse(body);
      //console.log(body.event_results);
      var theTotalResults = body.event_results; 
      var JSONByBracket = processTotalResult(theTotalResults);
      bubbleSort(JSONByBracket);
      res.json(JSONByBracket);
    });
  }

}
/** 
  @method processTotalResult
  @description 
  @param theTotalResults
  @return secondJSON
**/
function processTotalResult(theTotalResults){
  var secondJSON =[]; 
  for(var i=0; i<theTotalResults.length;i++){
    var theName = theTotalResults[i].results_first_name + " - " + theTotalResults[i].results_last_name;
    var search = searchAthleteInResults(secondJSON,theName); 
    if(search.exists){
      var totalTime = secondJSON[search.index].time;
      var currentTime = theTotalResults[i].results_time_with_penalty;
      secondJSON[search.index].time = addTimes(totalTime,currentTime);
    }else{
      var objectToAdd = {
        riders: theTotalResults[i].results_first_name + " - " + theTotalResults[i].results_last_name,
        riders_no: theTotalResults[i].results_bib,
        time: theTotalResults[i].results_time_with_penalty,
        gap: 0,
        bracket: theTotalResults[i].results_primary_bracket_name
      }
      secondJSON.push(objectToAdd);
    }
  }
  return secondJSON;
}
/** 
  @method searchAthleteInResults
  @description 
  @param theTotalResults
  @param athleteName
  @return theReturn
**/
function searchAthleteInResults(theTotalResults,athleteName){
  var theReturn = {
    exists: false, 
    index: -1
  };
  for(var i=0;i<theTotalResults.length;i++){
    var theName = theTotalResults[i].riders;
    if(theName==athleteName){
      theReturn =  {
        exists: true, 
        index: i
      }
      break;
    }
  }
  return theReturn;
}
/** 
  @method bubbleSort
  @description 
  @param myArr
  @return myArr
**/
function bubbleSort(myArr){
  if(myArr != undefined && myArr != null){
    var size = myArr.length;
    for( var pass = 1; pass < size; pass++ ){ // outer loop
        for( var left = 0; left < (size - pass); left++){ // inner loop
          var right = left + 1;
          var first = HHMMSSToSeconds(myArr[left].time);
          var next = HHMMSSToSeconds(myArr[right].time);
          if( first > next ){
            myArr[left].time = secondsToHMS(next);
            myArr[right].time = secondsToHMS(first);
          }
        }
    }
  }
  return myArr;
}
/** 
  @method HHMMSSToSeconds
  @description 
  @param time
  @return timeToSeconds
**/
function HHMMSSToSeconds(time){

  //console.log("Lo que entra al HHMMSSToSeconds: " + time)

  var timeSplit = time.split(":"); 
  return timeToSeconds = (+timeSplit[0]) * 60 * 60  + (+timeSplit[1]) * 60 + (+timeSplit[2]);

}
/** 
  @method addTimes
  @description 
  @param totalTime
  @param currentTime
  @return timeToSeconds
**/
function addTimes(totalTime,currentTime){
  
  var newTotalTime = totalTime.replace(".0","");
  var newCurrentTime = currentTime.replace(".0","");
  
  //console.log(newTotalTime);
  //console.log(newCurrentTime);

  var totalTimeToSeconds = HHMMSSToSeconds(newTotalTime);
  var totalCurrentToSeconds = HHMMSSToSeconds(newCurrentTime);

  var addedTime = totalTimeToSeconds + totalCurrentToSeconds; 

  return secondsToHMS(addedTime); 
}
/** 
  @method secondsToHMS
  @description 
  @param seconds
  @return time
**/
var secondsToHMS = function (seconds){
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    return ((h < 10 ? "0":"") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

/** 
  @method getStageStanding
  @description 
  @param id
  @return res
**/
function getStageStanding(id,res){
  var race_id = races[id].race_id;
  //console.log(client_id)
  var query_result_by_race = "/api/race/"+race_id+"/results?format=json&client_id="+client_id+"&user_id="+user_id+"&user_pass="+user_pass+"&page=1&size=1600&mode=ctlive";
  var uri_crhono = hostname+query_result_by_race;
  request(uri_crhono,function(err,resp,body){
    body = JSON.parse(body);
    //console.log(body.race_results)
    var theResults = body.race_results; 
    var JSONToSend = processRaceResults(theResults);
    res.json(JSONToSend);
  });

}
/** 
  @method processRaceResults
  @description 
  @param theResults
  @return objectToSend
**/
function processRaceResults(theResults){
  var objectToSend = []; 
  theResults.forEach(function(value,index){
    objectToSend[index] = {
      rank: theResults[index].results_rank,
      riders: theResults[index].results_first_name + " - " + theResults[index].results_last_name,
      riders_no: theResults[index].results_bib,
      time: theResults[index].results_time_with_penalty,
      bracket: theResults[index].results_primary_bracket_name
    }
  });
  return objectToSend;
}

//HTTP GET /Overall Call for the overall standing
app.get('/Overall', function(req, res) {
    var bracket = req.query.bracket; 
    overallStanding(bracket,res); 
});

//HTTP GET /Stage call for the 7 stages 
app.get('/Stage', function(req, res) {
    var index = req.query.id;
    //console.log("Este es el id que llega por GET: " + index);
    getStageStanding(index - 1,res);
      
});

app.listen(port, ipaddress, function() {
  getEvent();
  getAtletas();
  getRace();
  console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), ipaddress, port);
 });