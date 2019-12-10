const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

var User = require("../models/user");
var Coin = require("../models/coin");
var Balance = require("../models/balance");
var Address = require("../models/address");

/**
 * middleware check Json Web Token valid
 * @param {any} req data request from client
 * @param {any} res will reponse to client
 * @param {function} next callback function to next step
 */
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

router.post("/register", (req, res) => {
	var { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).send({
			status: "error",
			message: "email or password is empty",
			data: null
		});
	}

	User.findOne({ email: email })
		.then(u => {
			if (u) throw new Error("email existed");

			return User.create({ email, password })
				.then(user => {
					var token = jwt.sign(
						{
							_id: user._id,
							email: user.email
						},
						"toannguyen",
						{
							expiresIn: "5m"
						}
					);

					res.send({
						status: "success",
						message: null,
						data: {
							_id: user._id,
							email: user.email,
							token
						}
					});
				})
				.catch(err => {
					return new Error(err.message);
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

router.post("/login", (req, res) => {
	var { email, password } = req.body;
	User.findOne({ email })
		.then(user => {
			if (!user) throw new Error("email not exist");

			var isTrue = bcrypt.compareSync(password, user.password);
			if (!isTrue) throw new Error("login failed");

			var token = jwt.sign(
				{
					_id: user._id,
					email: user.email
				},
				"toannguyen",
				{
					expiresIn: "5m"
				}
			);

			res.send({
				status: "success",
				message: null,
				data: {
					token,
					email,
					_id: user._id
				}
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

router.post("/data", async (req, res) => {
	var balance = await Balance.findOne({
		user: "5def1e1a9244822038fc62f8",
		coin: "5deb59da0298820b382490db"
	});
	// .populate("user", "email")
	// .populate("coin");
	if (!balance) return res.send("nothing!!!");
	res.send(balance);
});

//! Deposit coin
//? { user_id } : Id of user
//? { coin_id } : Id of coin
//? { amount } : amount of coin deposit
//! if balance exist with {coin_id & user_id} then update amount
//! if balance not exist then add new balance
router.post("/deposit", (req, res) => {
	var { user_id, coin_id, amount } = req.body;

	Balance.findOne(
		{
			user: user_id,
			coin: coin_id
		},
		(err, balance) => {
			if (err) {
				return res.send({ status: "error", message: err, data: null });
			}
			if (balance) {
				balance.amount += amount;
			} else {
				balance = new Balance({
					user: user_id,
					coin: coin_id,
					amount
				});
			}
			balance
				.save()
				.then(result => {
					return User.updateOne(
						{ _id: user_id },
						{
							$addToSet: { balance: result._id }
						}
					)
						.then(update => {
							res.send({
								status: "success",
								message: null,
								data: update
							});
						})
						.catch(err => {
							throw new Error(err.message);
						});
				})
				.catch(err => {
					res.send(err.message);
				});
		}
	);
});

router.post("/generate", (req, res) => {
	var { user_id, coin_id } = req.body;
	Address.findOne({
		user: user_id,
		coin: coin_id
	}).then(address => {
		if (address) throw new Error("address generated already");
		Coin.findOne({ _id: coin_id })
			.select("symbol")
			.then(coin => {
				let coinAddress = generateAddress(coin.symbol);
				address = new Address({
					user: user_id,
					coin: coin_id,
					address: coinAddress
				});

				address
					.save()
					.then(result => {
						User.updateOne(
							{ _id: user_id },
							{
								$addToSet: {
									address: result._id
								}
							}
						)
							.then(ok => {
								res.send(ok);
							})
							.catch(err => {
								res.send(err.message + "219");
							});
					})
					.catch(err => {
						res.send(err.message + "223");
					});
			})
			.catch(err => {
				res.send(err.message + "227");
			});
	});
});

router.get("/", (req, res) => {
	User.find()
		.populate("balance")
		.populate("coin")
		.exec((err, result) => {
			res.send(result);
		});
});

function generateAddress(coin) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < 34; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return `${coin}-${result}`;
}

module.exports = router;
