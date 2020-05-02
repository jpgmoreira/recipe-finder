const axios = require('axios');

/**
 * Request for information to put on search results page.
 * Returns a Promise.
 */
const searchRequest = (searchText, pageNumber, resultsPerPage) => {
	const encodedText = encodeURIComponent(searchText);
	let offset = (pageNumber - 1) * resultsPerPage;
	offset = Math.min(offset, 990);  // Spoonacular API allows a maximum offset of 990.
	const options = `&addRecipeInformation=true&number=${resultsPerPage}&offset=${offset}`;
	return axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${encodedText}${options}&apiKey=${process.env.SPOONACULAR_API_KEY}`);
}

/**
 * Request for information to put on recipe pages.
 * Returns a Promise.
 */
const recipeRequest = (id) => {
	return axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`);
}

/**
 * Request for "information bulk" about all the favorite recipes of a user.
 * Receives an array of recipes' ids. Returns a Promise.
 */
const favoritesRequest = (ids) => {
	const commaSep = ids.join(',');
	return axios.get(`https://api.spoonacular.com/recipes/informationBulk?ids=${commaSep}&apiKey=${process.env.SPOONACULAR_API_KEY}`);
}

/**
 * Returns an error string according to the HTTP status code.
 */
const errorMessage = (code) => {
	let message = "";
	switch (code) {
		case 402:
			message = "The maximum number of daily requests was reached. Try again tomorrow!";
			break;
		case 0:
		case 404:
			message = "It was not possible to find the information you requested.";
			break;
		default:
			message = "Unfortunately, your request resulted in an unhandled error.";
	}
	return message;
}

module.exports = {
	searchRequest,
	recipeRequest,
	favoritesRequest,
	errorMessage
};
