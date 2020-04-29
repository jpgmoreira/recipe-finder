const express = require('express');
const bcrypt = require('bcryptjs');
const spoonacular = require('../utils/spoonacular');
const appUtils = require('../utils/app_utils');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

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
	const hashRounds = 8; 
	const hashedPassword = bcrypt.hashSync(password, hashRounds);
	try {
		const user = new User({ username, hashedPassword });
		await user.save();
		if (email && email !== '' && welcomeEmail) {
			// send welcome email.
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

router.post('/signin', auth, (req, res) => {
	if (req.user) {
		res.redirect('/home');
		return;
	}	
	res.status(200).send(req.body);
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
			res.render('error', {
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
			res.render('error', {
				message: spoonacular.errorMessage(error.code),
				user: req.user
			});
		});
});

module.exports = router;
