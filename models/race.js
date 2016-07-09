var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var race_schema = new Schema({
	id: Number,
	name: String,
	type: String,
	subType: String,
	distance: Number,
	distanceUnit: String, 
	plannedStartTime: Date,
	plannedFinishTime: Date, 
	raceActualStartTime: Date, 
	raceActualFinishTime: Date
});

var Race = mongoose.model("Race", race_schema);

module.exports.Race = Race;