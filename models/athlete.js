var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//pendiente modelar tiempos por carrera y en total
var athlete_schema = new Schema({
	athlete_id: String,
	entry_name: String,
	entry_status: String,
	number: Number,
	races: [], 
	bracket_name: String
});

var Athlete = mongoose.model("Athlete", athlete_schema);

module.exports = Athlete;