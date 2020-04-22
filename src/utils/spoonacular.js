const axios = require('axios');

const spoonacular = (search_text) => {
	const URI_search_text = encodeURIComponent(search_text);
	return axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${URI_search_text}&apiKey=${process.env.SPOONACULAR_API_KEY}`);
}

module.exports = spoonacular;
