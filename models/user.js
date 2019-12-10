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
				type: Schema.Types.ObjectId,
				ref: "balance"
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
