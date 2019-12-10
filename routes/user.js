const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

var User = require("../models/user");
var Balance = require("../models/balance");

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

router.post("/tokenvalid", (req, res) => {
	var token = req.body.token;
	jwt.verify(token, "toannguyen", (err, decode) => {
		if (err) {
			return res.send({
				status: "error"
			});
		} else {
		}
	});
});

router.post("/deposit", async (req, res) => {
	var { user_id, coin_id, amount } = req.body;

	//check balance created
	var balanceExisted = await Balance.findOne({
		user: user_id,
		coin: coin_id
	});

	if (balanceExisted) {
		var update = await Balance.update(
			{
				user: user_id,
				coin: coin_id
			},
			{ amount: amount + balanceExisted.amount }
		);

		if (update.nModified) {
			res.send({
				status: "success",
				message: null,
				data: update
			});
		} else {
			res.send({
				status: "error",
				message: "cannot update",
				data: null
			});
		}
	} else {
		Balance.create({ user: user_id, coin: coin_id, amount })
			.then(balance => {
				return User.updateOne(
					{ _id: user_id },
					{
						$addToSet: { balance: balance._id }
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
				res.send({
					status: "error",
					message: err.message,
					data: null
				});
			});
	}
});

router.get("/", (req, res) => {
	User.find()
		.populate("balance")
		.populate("coin")
		.exec((err, result) => {
			res.send(result);
		});
});

module.exports = router;
