const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var coinSchema = new Schema({
	name: String,
	symbol: String,
	last_price: { type: Number, default: 0 },
	current_price: { type: Number, default: 0 }
});

module.exports = mongoose.model("coin", coinSchema);
