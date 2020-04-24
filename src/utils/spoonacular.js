const axios = require('axios');

// Returns a Promise.
const request = (searchText, pageNumber, resultsPerPage) => {
	const encodedText = encodeURIComponent(searchText);
	let offset = (pageNumber - 1) * resultsPerPage;
	offset = Math.min(offset, 990);  // Spoonacular API allows a maximum offset of 990.
	const options = `&addRecipeInformation=true&number=${resultsPerPage}&offset=${offset}`;
	return axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${encodedText}${options}&apiKey=${process.env.SPOONACULAR_API_KEY}`);
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
