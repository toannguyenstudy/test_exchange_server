const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

var User = require("../models/user");

router.post("/register", (req, res) => {
	var user = req.body;

	User.create({ ...user, balance: [] })
		.then(u => {
			res.send(u);
		})
		.catch(err => {
			res.send(err.message);
		});
});

router.post("/login", (req, res) => {
	var { email, password } = req.body;
	User.findOne({ email })
		.then(result => {
			if (!result) throw new Error("email not exist");

			var isTrue = bcrypt.compareSync(password, result.password);
			if (!isTrue) throw new Error("login failed");

			res.send(result);
		})
		.catch(err => {
			res.send({
				status: "error",
				message: err.message,
				data: null
			});
		});
});

module.exports = router;
