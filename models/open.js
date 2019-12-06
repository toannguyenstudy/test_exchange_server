const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var openOrderSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		coin: { type: Schema.Types.ObjectId, ref: "coin" },
		type: { type: String, enum: ["buy", "sell"] },
		amount: Number,
		price: Number,
		create_at: { type: Number, default: Date.now() }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("open_order", openOrderSchema);
