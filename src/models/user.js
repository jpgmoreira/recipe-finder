const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		trim: true,
		required: true,
		unique: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	},
	savedRecipes: [{
		type: Number
	}]
}, {
	timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
