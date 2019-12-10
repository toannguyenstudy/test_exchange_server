const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var addressSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "user" },
	coin: { type: Schema.Types.ObjectId, ref: "coin" },
	address: String
});

module.exports = mongoose.model("address", addressSchema);
