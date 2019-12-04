const express = require("express");
const app = express();
require("./db");
var cors = require("cors");

const bodyParser = require("body-parser");

app.use(
	cors({
		origin: "http://localhost:8100"
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", require("./routes/user"));
app.use("/coin", require("./routes/coin"));
app.use("/open", require("./routes/open"));
app.use("/history", require("./routes/history"));

app.listen(3000, () => console.log("starting"));
