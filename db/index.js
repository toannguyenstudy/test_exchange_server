const mongoose = require("mongoose");

mongoose.connect(
	"mongodb://localhost:27017/exchange",
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	err => {
		if (err) return console.log("connect database failed: ", err);
		console.log("connect database success");
	}
);
