var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var athlete_schema = new Schema({
	id: Number,
	name: String,
	status: String,
	age: Number,
	sex: String
});

var Athlete = mongoose.model("Athlete", event_schema);

module.exports.Athlete = Athlete;