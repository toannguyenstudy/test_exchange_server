const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: String,
		name: String,
		phone: String,
		bank: { type: String, required: true },
		balance: [
			{
				coin: { type: Schema.Types.ObjectId, ref: "coin" },
				address: { type: String, default: null },
				total_amount: { type: Number, default: 0 },
				available: { type: Number, default: 0 }
			}
		]
	},
	{ timestamps: true }
);

userSchema.pre("save", function(next) {
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

module.exports = mongoose.model("user", userSchema);
