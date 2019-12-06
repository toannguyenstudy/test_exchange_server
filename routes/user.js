const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

var User = require("../models/user");

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

router.post("/data", verifyToken, (req, res) => {
	res.send({
		status: "success",
		message: null,
		data: {
			_id: req._id,
			email: req.email
		}
	});
});

router.post("/tokenvalid", (req, res) => {
	var token = req.body.token
	jwt.verify(token, 'toannguyen', (err, decode) => {
		if(err){
			return res.send({
				status: 'error'
			})
		}else{
			
		}
	})
})

module.exports = router;
