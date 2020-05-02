const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sendgrid = require('../external/sendgrid');
const { verifyToken, unlogged } = require('../middleware/auth');

const router = new express.Router();
router.use(verifyToken);

/**
 * Routes accessible only by clients that are not logged in. 
 */

router.get('/signup', unlogged, (req, res) => {
	res.render('signup');
});

router.get('/signin', unlogged, (req, res) => {
	res.render('signin');
});

router.post('/signup', unlogged, async (req, res) => {
	try {
		const { email, username, password, welcomeEmail } = req.body;
		const hashedPassword = bcrypt.hashSync(password, process.env.BCRYPT_ROUNDS);	
		const user = new User({ username, hashedPassword });
		await user.save();
		if (email && email !== '' && welcomeEmail) {
			// Send welcome email:
			sendgrid.sendWelcomeEmail(username, email);
		}
		// generate user's jwt to start a new stateless session:
		const token = await user.generateAuthToken();
		const cookieOptions = {
			httpOnly: true,
			secure: true
		};
		if (process.env.NODE_ENV === 'development') {
			cookieOptions.secure = false;
		}
		res.cookie('JWT', token, cookieOptions);
		res.redirect('/home');
	} catch(e) {
		if (e.code === 11000) {  // mongoDB error: Document with given username already exists.
			res.render('signup', {
				usernameExists: true
			});
		}
		else {
			res.render('signup', {
				error: 'Sorry, but it was not possible to create a new account due to an unknown error.'
			});
		}
	}
});

router.post('/signin', unlogged, async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findByCredentials(username, password);
		const token = await user.generateAuthToken();
		const cookieOptions = {
			httpOnly: true,
			secure: true
		};
		if (process.env.NODE_ENV === 'development') {
			cookieOptions.secure = false;
		}
		res.cookie('JWT', token, cookieOptions);
		res.redirect('/home');
	} catch(e) {
		res.render('signin', {
			error: 'An error has occurred.'
		});
	}
});

module.exports = router;
