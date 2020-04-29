const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
	const token = req.cookies.JWT;
	if (!token) {
		next();
		return;
	}
	try {
		const _id = jwt.verify(token, process.env.JWT_SECRET);
		user = await User.findOne({ _id, 'tokens': token });
		if (!user) {
			throw new Error();
		}
		req.user = user;
		next();
	}
	catch (e) {
		res.clearCookie('JWT', token);
		if (e.name === 'TokenExpiredError') {
			res.render('error', {
				message: 'Your session has been expired. Log-in Again!'
			});
		}
		else {
			res.render('error', {
				message: "The server could not verify your identity. Please, Log-in and try again."
			});
		}
	}
}

module.exports = auth;
