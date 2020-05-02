const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * For all routes: Verify if the client is sending and authentication token.
 */
const verifyToken = async (req, res, next) => {
	const token = req.cookies.JWT;
	if (token) {
		try {
			const _id = jwt.verify(token, process.env.JWT_SECRET);
			const user = await(User.findOne({ _id, tokens: token }));
			if (!user) {
				throw new Error();
			}
			req.token = token;
			req.user = user;
		} catch (e) {
			res.clearCookie('JWT', token);
			if (e.name === 'TokenExpiredError') {  // jwt.verify error.
				res.render('message', {
					message: 'Your session has been expired.'
				});
			}
			else {
				res.render('message',  {
					message: 'We could not verify your identity. Please, log in and try again.'
				});
			}
			return;
		}
	}
	next();
}

/**
 * For routes that require the user to be logged in.
 */
const logged = (req, res, next) => {
	if (!req.user) {
		res.render('message', {
			message: 'You must log in first before accessing this page.'
		});
		return;
	}
	next();
}

/**
 * For routes that require the user to not be logged in.
 */
const unlogged = (req, res, next) => {
	if (req.user) {
		res.render('message', {
			user: req.user,
			message: 'You cannot acces this page while logged in.'
		});
		return;
	}
	next();
}

module.exports = {
	verifyToken,
	logged,
	unlogged
};
