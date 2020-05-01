const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Authentication middleware.
 * If the client sends a valid authentication token, this function
 *  reads the corresponding user document from the database
 * 	and forward the token and the user as req properties.
 */
const auth = async (req, res, next) => {
	const token = req.cookies.JWT;
	if (!token) {
		next();
		return;
	}
	try {
		// JWT payload is just the user's document _id.
		const _id = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id, tokens: token });
		if (!user) {
			throw new Error();
		}
		req.user = user;
		req.token = token;
		next();
	}
	catch (e) {
		res.clearCookie('JWT', token);
		if (e.name === 'TokenExpiredError') {
			res.render('message', {
				message: 'Your session has been expired.'
			});
		}
		else {
			res.render('message', {
				message: "We could not verify your identity. Please, Log-in and try again."
			});
		}
	}
}

module.exports = auth;
