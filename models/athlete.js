var mongoose = require("mongoose");
var Schema = mongoose.Schema;


//pendiente modelar tiempos por carrera y en total
var athlete_schema = new Schema({
	id: Number,
	name: String,
	status: String,
	age: Number,
	number: Number,
	sex: String,
});

var Athlete = mongoose.model("Athlete", event_schema);

module.exports.Athlete = Athlete;