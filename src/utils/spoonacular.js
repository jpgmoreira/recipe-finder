const axios = require('axios');

const request = (search_text) => {
	const URI_search_text = encodeURIComponent(search_text);
	return axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${URI_search_text}&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_API_KEY}`);
}

// Returns error text according to the HTTP status code received from the API.
const errorMessage = (code) => {
	let message;
	switch (code) {
		case 402:
			message = "The maximum daily number of requests to the API was reached :(. Try again tomorrow!";
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
