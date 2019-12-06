const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

var OpenOrder = require("../models/open");
var User = require("../models/user");

function verifyToken(req, res, next) {
	var token = req.body.token;
	jwt.verify(token, "toannguyen", (err, decode) => {
		if (err)
			return res.send({
				status: "error",
				message: err.message
			});
		req._id = decode._id;
		req.email = decode.email;
		next();
	});
}

router.post("/add", verifyToken, (req, res) => {
	var userId = req._id;
	var { coinId, type, amount, price } = req.body;
	OpenOrder.create({
		user: userId,
		coin: coinId,
		type,
		amount,
		price
	})
		.then(open => {
			return User.update(
				{ _id: userId },
				{ $push: { open_orders: open._id } }
			)
				.then(user => {
					res.send({
						status: "success",
						message: null,
						data: user
					});
				})
				.catch(err => {
					throw new Error(err.message);
				});
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
