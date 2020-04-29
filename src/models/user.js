const mongoose = require('mongoose');

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
	savedRecipes: [{
		type: Number
	}]
}, {
	timestamps: true
});


// userSchema.pre('save', async function (next) {
// 	const user = this;
// 	if (user.isModified('hashedPassword')) {
	// 
// 	}
// 	next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
