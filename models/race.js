var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var race_schema = new Schema({
	id: Number,
	date: Date,
	name: String,
	type: String,
	distance: Number,
	timeStart: Number,
	timeEnd: Number
});

var Race = mongoose.model("Race", race_schema);

module.exports.Race = Race;