var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var connection_string = '127.3.106.1:27017';
mongoose.connect("mongodb://"+connection_string+"/smartsports");
console.log("Connect....")
var event_schema = new Schema({
   id : String,
   name: String,
   description: String,
   country: String,
   startTime: Date,
   endTime: Date,
   siteURI: String, 
   organizationName: String
});


event_schema.methods.getName = function(){
	return this.name;
}

var Event = mongoose.model("Event", event_schema);





module.exports = Event;