const path = require('path');
const express = require('express');
const hbs = require('hbs');
const spoonacular = require('./utils/spoonacular');
const appUtils = require('./utils/app_utils');

const app = express();
const port = process.env.PORT || 3000;

// Development-specific settings:
if (process.env.NODE_ENV === 'development') {
	require('./http_mock/http_mock');  // Mock HTTP requests to external APIs.
}

// Paths:
const pubDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars. Set views and partials locations:
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set static directory:
app.use(express.static(pubDir));

// -------------------------------------------------------------------

// Routes:
app.get(['/', '/home'], (req, res) => {
	res.render('index');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/search', (req, res) => {
	const searchText = req.query.searchText;
	const pageNumber = Math.max(req.query.pageNumber, 1);
	const resultsPerPage = 10;  // Spoonacular API allows a maximum of 10 results per request.
	spoonacular.searchRequest(searchText, pageNumber, resultsPerPage)
		.then((response) => {
			const totalResults = response.data.totalResults;
			const results = response.data.results;
			let pagination = false;
			if (totalResults > 0) {
				pagination = appUtils.searchPagination(searchText, pageNumber, resultsPerPage, totalResults);
			}
			res.render('search', {
				results,
				zeroResults: totalResults == 0,
				query: searchText,
				pagination
			});
		})
		.catch((error) => {
			error = error.response.data;
			error.message = spoonacular.errorMessage(error.code);
			res.render('search', {
				error,
				query: searchText
			});
		});
});

app.get('/recipe', (req, res) => {
	spoonacular.recipeRequest(req.query.id)
		.then((response) => {
			res.status(200).send(response.data);
		})
		.catch((error) => {
			error = error.response.data;
			error.message = spoonacular.errorMessage(error.code);
			res.status(404).send(error.message);
		});
});

// -------------------------------------------------------------------

// Start server:
app.listen(port, () => {
	console.log('Server listening on port', port);
});
