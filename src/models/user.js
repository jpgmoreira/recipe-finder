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
	tokens: [{
		type: String
	}],
	savedRecipes: [{
		type: Number
	}]
}, {
	timestamps: true
});

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({
		 _id: user._id.toString() 
		},process.env.JWT_SECRET , {
			expiresIn: '10 minutes'
		});
	user.tokens.push(token);
	await user.save();
	return token;
}

userSchema.statics.findByCredentials = async (username, password) => {
	const user = await User.findOne({ username });
	if (!user) {
		throw new Error();
	}
	const isMatch = bcrypt.compareSync(password, user.hashedPassword);
	if (!isMatch) {
		throw new Error();
	}
	return user;
}


const User = mongoose.model('User', userSchema);

module.exports = User;
