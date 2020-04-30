const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const spoonacular = require('../utils/spoonacular');
const appUtils = require('../utils/app_utils');
const User = require('../models/user');
const auth = require('../middleware/auth');
const sendgrid = require('../utils/sendgrid');

const router = new express.Router();

const hashRounds = 8;

router.get(['/', '/home'], auth, (req, res) => {
	res.render('index', {
		user: req.user
	});
});

router.get('/about', auth, (req, res) => {
	res.render('about', {
		user: req.user
	});
});

// - SignIn and SignUp:

router.get('/signup', auth, (req, res) => {
	if (req.user) {
		res.redirect('/home');
		return;
	}
	res.render('signup');
});

router.get('/signin', auth, (req, res) => {
	if (req.user) {
		res.redirect('/home');
		return;
	}
	res.render('signin');
});

router.post('/signup', auth, async (req, res) => {
	if (req.user) {
		res.redirect('/home');
		return;
	}
	const { email, username, password, welcomeEmail } = req.body;
	const hashedPassword = bcrypt.hashSync(password, hashRounds);
	try {
		const user = new User({ username, hashedPassword });
		await user.save();
		if (email && email !== '' && welcomeEmail) {
			// Send welcome email:
			sendgrid.sendWelcomeEmail(username, email);
		}
		// generate user's jwt for initiating a new stateless session:
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
		if (e.code === 11000) {
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

router.post('/signin', auth, async (req, res) => {
	if (req.user) {
		res.redirect('/home');
		return;
	}
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
			error: 'An error occurred'
		});
	}
});

//

router.get('/search', auth, (req, res) => {
	const searchText = req.query.searchText;
	const pageNumber = Math.max(req.query.pageNumber, 1);  // Prevents page number <= 0.
	const resultsPerPage = 10;  // Spoonacular API allows a maximum of 10 results per request.
	spoonacular.searchRequest(searchText, pageNumber, resultsPerPage)
		.then((response) => {
			response = response.data;
			const totalResults = response.totalResults;
			let pagination = false;  // If no results found, do not show pagination bar.
			if (totalResults > 0) {
				pagination = appUtils.searchPagination(searchText, pageNumber, resultsPerPage, totalResults);
			}

			// Filter results contents:
			const results = [];
			response.results.forEach((result) => {
				const { id, title, image, summary, dishTypes } = result;
				const newRes = {
					id,
					image,
					title: appUtils.filterBadWords(title),
					summary: appUtils.filterBadWords(summary),
					dishTypes: dishTypes.map(appUtils.filterBadWords)
				}
				results.push(newRes);
			});
		
			res.render('search', {
				results,
				searchText,
				pagination,
				user: req.user
			});		
		})
		.catch((error) => {
			error = error.response.data;
			res.render('message', {
				message: spoonacular.errorMessage(error.code),
				user: req.user
			});
		});
});

router.get('/recipe', auth, (req, res) => {
	spoonacular.recipeRequest(req.query.id)
		.then((response) => {
			response = response.data;
			// analyzedInstructions is (by some reason) provided as an array with at most one object.
			if (response.analyzedInstructions.length > 0) {
				response.instructionsSteps = response.analyzedInstructions[0].steps;
			}
			else {
				response.instructionsSteps = undefined;
			}
			response.hasSource = (response.sourceUrl || response.sourceName || response.creditsText);

			// Since the recipe view uses several informations from the response object, the simpler approach
			//  below was chosen instead of filtering each text property separately, such as it's done
			//  in the search route above.
			response = JSON.parse(appUtils.filterBadWords(JSON.stringify(response)));
			
			res.render('recipe', { 
				response,
				user: req.user
			});
		})
		.catch((error) => {
			error = error.response.data;
			res.render('message', {
				message: spoonacular.errorMessage(error.code),
				user: req.user
			});
		});
});

router.get('/logout', auth, async (req, res) => {
	if (!req.token) {
		res.redirect('/home');
		return;
	}
	try {
		req.user.tokens = req.user.tokens.filter(token => token !== req.token);
		await req.user.save();
		res.clearCookie('JWT', req.token);
		res.redirect('/home');
	} catch(e) {
		res.render('message', { 
			message: 'An error occurred while trying to log you out.'
		});
	}
});

router.get('/favorites', auth, (req, res) => {
	if (!req.user) {
		res.redirect('/home');
		return;
	}
	spoonacular.favoritesRequest(req.user.savedRecipes)
		.then((response) => {
			res.render('favorites', {
				results: response.data
			});
		})
		.catch((error) => {
			try {
				error = error.response.data;
				if (error.code == 400) {  // No recipes provided to the request.
					res.render('favorites', {
						results: undefined
					});
				}
				else {
					throw new Error();
				}
			} catch (e) {
				res.render('message', {
					message: 'It seems that an unexpected error occurred with your favorite recipes list!'
				});
			} 
		});
});

router.post('/favorites/remove', auth, async (req, res) => {
	if (!req.user) {
		res.redirect('/home');
		return;
	}
	const id = req.body.id;
	try {
		const index = user.savedRecipes.indexOf(id);
		if (index > -1) {
			user.savedRecipes.splice(index, 1);
			await user.save();
		}
		if (user.savedRecipes.length > 0) {
			res.status(202).send();
		}
		else {
			res.status(205).send();
		}
	} catch (e) {
		res.render('message', {
			user: req.user,
			message: 'It was not possible to remove that element from your favorites.'
		});
	}
});

router.get('/profile', auth, (req, res) => {
	if (!req.user) {
		res.redirect('/home');
		return;
	}
	let registeredAt = moment(user.createdAt).format("MMMM Do YYYY, h:mm a");
	registeredAt += ` (${moment(user.createdAt).fromNow()})`;
	res.render('profile', {
		user: req.user,
		registeredAt
	});
});

router.get('/profile/delete', auth, async (req, res) => {
	if (!req.user) {
		res.redirect('/home');
		return;
	}
	let message = '';
	try {
		res.clearCookie('JWT', req.token);
		await User.deleteOne({ _id : req.user._id });
		message = 'Your account was successfully deleted!';
	} catch (e) {
		message = 'An error occurred while trying to delete your account!';
	}
	res.render('message', {
		message
	});
});

router.post('/profile/changepass', auth, async (req, res) => {
	if (!req.user) {
		res.redirect('/home');
		return;
	}
	const user = req.user;
	const { currPass, newPass } = req.body;
	let message = '';
	try {
		const isMatch = bcrypt.compareSync(currPass, user.hashedPassword);
		if (!isMatch) {
			throw new Error();
		}
		const hashedPassword = bcrypt.hashSync(newPass, hashRounds);
		user.hashedPassword = hashedPassword;
		await user.save();
		message = 'Password sucessfully updated!';
	} catch (e) {
		message = 'Error while trying to update your password!';
	}
	res.render('message', {
		user,
		message
	});
});


module.exports = router;
