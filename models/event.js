var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var connection_string = '127.3.106.1:27017';
mongoose.connect("mongodb://"+connection_string+"/events");
console.log("Connect....")
var event_schema = new Schema({
   id : Number,
   name: String,
   city: String,
   date: Date,
   description: String,
   hourStart: Number,
   hourEnd: Number,
});

var Event = mongoose.model("Event", event_schema);

module.exports.Event = Event;