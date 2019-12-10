const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var balanceSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		coin: { type: Schema.Types.ObjectId, ref: "coin" },
		amount: { type: Number, default: 0 }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("balance", balanceSchema);
