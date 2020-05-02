const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const spoonacular = require('../external/spoonacular');
const User = require('../models/user');
const { verifyToken, logged } = require('../middleware/auth');

const router = new express.Router();
router.use(verifyToken);

/**
 * Routes accessible only by clients that are logged in. 
 */

router.get('/logout', logged, async (req, res) => {
	try {
		const { user, token } = req;
		user.tokens = user.tokens.filter(elem => elem !== token);
		await user.save();
		res.clearCookie('JWT', token);
		res.redirect('/home');
	} catch(e) {
		res.render('message', { 
			message: 'An error occurred while trying to log you out.'
		});
	}
});

router.get('/favorites', logged, (req, res) => {
	if (req.user.favoriteRecipes.length === 0) {
		// If the user has no favorite recipes: Render the page directly, saving a request.
		res.render('favorites', {
			results: []
		});
		return;
	}
	spoonacular.favoritesRequest(req.user.favoriteRecipes).then((response) => {
		res.render('favorites', {
			results: response.data
		});
	})
	.catch((error) => {
		try {
			error = error.response.data;
			if (error.code == 400) {  // Response provided no recipes.
				res.render('favorites', {
					results: []
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


router.post('/favorites/remove', logged, async (req, res) => {
	try {
		const user = req.user;
		const id = req.body.id;	
		const index = user.favoriteRecipes.indexOf(id);
		if (index > -1) {
			user.favoriteRecipes.splice(index, 1);
			await user.save();
		}
		if (user.favoriteRecipes.length > 0) {
			res.status(202).send();  // Indicates that favorites list didn't become empty.
		}
		else {
			res.status(205).send();  // Indicates that favorites list became empty.
		}
	} catch (e) {
		res.render('message', {
			user,
			message: 'It was not possible to remove that element from your favorites.'
		});
	}
});

router.post('/favorites/insert', logged, async (req, res) => {
	const user = req.user;
	const id = req.body.id;
	if (user.favoriteRecipes.includes(id)) {
		res.status(302).send();  // Favorites list already contains the element.
		return;
	}
	try {
		user.favoriteRecipes.push(id);
		await user.save();
		res.status(201).send();
	} catch (e) {
		res.render('message', {
			user,
			message: 'It was not possible to insert that element in your favorites.'
		});
	}
});

router.get('/profile', logged, (req, res) => {
	const user = req.user;
	let registeredAt = moment(user.createdAt).format("MMMM Do YYYY, HH:mm");
	registeredAt += ` (${moment(user.createdAt).fromNow()})`;
	res.render('profile', {
		user,
		registeredAt
	});
});

router.get('/profile/delete', logged, async (req, res) => {
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

router.post('/profile/changepass', logged, async (req, res) => {
	const user = req.user;
	const { currPass, newPass } = req.body;
	let message = '';
	try {
		const isMatch = bcrypt.compareSync(currPass, user.hashedPassword);
		if (!isMatch) {
			throw new Error();
		}
		const hashedPassword = bcrypt.hashSync(newPass, 8);
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
