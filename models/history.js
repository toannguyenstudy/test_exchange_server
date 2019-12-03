const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var historySchema = new Schema({
	buyer: { type: Schema.Types.ObjectId, ref: "user" },
	seller: { type: Schema.Types.ObjectId, ref: "user" },
	coin: { type: Schema.Types.ObjectId, ref: "coin" },
	type: ["buy", "sell"],
	amount: Number,
	price: Number,
	date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("history", historySchema);
