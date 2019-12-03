const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var openOrderSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		coin: { type: Schema.Types.ObjectId, ref: "coin" },
		type: ["buy", "sell"],
		amount: Number,
		price: Number
	},
	{ timestamps: true }
);

module.exports = mongoose.model("open_order", openOrderSchema);
