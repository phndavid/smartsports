var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//pendiente modelar tiempos por carrera y en total
var athlete_schema = new Schema({
	id: String,
	name: String,
	status: String,
	age: Number,
	number: Number,
	sex: String,
});

var Athlete = mongoose.model("Athlete", athlete_schema);

module.exports = Athlete;