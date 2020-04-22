const axios = require('axios');

// Returns a Promise.
const request = (searchText) => {
	const encodedText = encodeURIComponent(searchText);
	return axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${encodedText}&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_API_KEY}`);
}

// Returns an error string according to the HTTP status code passed.
const errorMessage = (code) => {
	let message = "";
	switch (code) {
		case 402:
			message = "The maximum number of daily requests was reached :(. Try again tomorrow!";
			break;
		default:
			message = "Unfortunately, your request resulted in an unhandled error :(";
	}
	return message;
}

module.exports = {
	request,
	errorMessage
};
