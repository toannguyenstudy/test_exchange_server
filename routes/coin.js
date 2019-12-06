const express = require("express");
const router = express.Router();

var Coin = require("./../models/coin");

router.post("/add", (req, res) => {
	let { name, symbol } = req.body;
	if (!name || !symbol) {
		return res.send({
			status: "error",
			message: "empty value request"
		});
	}
	Coin.create({ name, symbol })
		.then(coin => {
			res.send({
				status: "success",
				message: null,
				data: coin
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
