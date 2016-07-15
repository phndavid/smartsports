var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var connection_string = '127.0.0.1:27017';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
} 
mongoose.connect('mongodb://' + connection_string);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); 
console.log('Hey, database Node module is loaded')
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