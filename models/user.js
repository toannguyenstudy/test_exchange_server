const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		name: String,
		phone: String,
		bank: String,
		balance: [
			{
				coin: { type: Schema.Types.ObjectId, ref: "coin" },
				address: { type: String, default: null },
				total_amount: { type: Number, default: 0 },
				available: { type: Number, default: 0 }
			}
		],
		open_orders: [{ type: Schema.Types.ObjectId, ref: "open_order" }]
	},
	{ timestamps: true }
);

userSchema.pre("save", function(next) {
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

module.exports = mongoose.model("user", userSchema);
