const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		trim: true,
		required: true,
		unique: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	tokens: [{  // Array of jwts: one for each user's active session.
		type: String
	}],
	favoriteRecipes: [{  // Ids of the user's favorite recipes.
		type: Number
	}]
}, {
	timestamps: true
});

/**
 * Generates a jwt for a new user's session and saves it to its tokens array.
 * Returns the jwt generated.
 */
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const payload = { _id: user._id.toString() };
	const options = { expiresIn: '7 days' };
	const token = jwt.sign(payload, process.env.JWT_SECRET, options);
	user.tokens.push(token);
	await user.save();
	return token;
}

/**
 * Search for a user document with the given credentials (username and password).
 * Returns the document found, or throw an Error if something goes badly.
 */
userSchema.statics.findByCredentials = async (username, password) => {
	const user = await User.findOne({ username });
	if (!user) {  // If no user found with the given username:
		throw new Error();
	}
	const isMatch = bcrypt.compareSync(password, user.hashedPassword);
	if (!isMatch) {  // If the given password doesn't match with the user's password:
		throw new Error();
	}
	return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
