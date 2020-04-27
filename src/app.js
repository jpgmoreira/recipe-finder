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

// Allow json and urlencoded (form data) as body parsers for POST method:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------------

// Routes:
app.get(['/', '/home'], (req, res) => {
	res.render('index');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/signup', (req, res) => {
	res.render('signup');
});

app.get('/signin', (req, res) => {
	res.render('signin');
});

app.post('/signup', (req, res) => {
	res.status(200).send(req.body);
});

app.post('/signin', (req, res) => {
	res.status(200).send(req.body);
});

app.get('/search', (req, res) => {
	const searchText = req.query.searchText;
	const pageNumber = Math.max(req.query.pageNumber, 1);  // Prevents page number <= 0.
	const resultsPerPage = 10;  // Spoonacular API allows a maximum of 10 results per request.
	spoonacular.searchRequest(searchText, pageNumber, resultsPerPage)
		.then((response) => {
			response = response.data;
			const totalResults = response.totalResults;
			let pagination = false;  // If no results found, do not show pagination bar.
			if (totalResults > 0) {
				pagination = appUtils.searchPagination(searchText, pageNumber, resultsPerPage, totalResults);
			}

			// Filter results contents:
			const results = [];
			response.results.forEach((result) => {
				const { id, title, image, summary, dishTypes } = result;
				const newRes = {
					id,
					image,
					title: appUtils.filterBadWords(title),
					summary: appUtils.filterBadWords(summary),
					dishTypes: dishTypes.map(appUtils.filterBadWords)
				}
				results.push(newRes);
			});
		
			res.render('search', {
				results,
				searchText,
				pagination
			});		
		})
		.catch((error) => {
			error = error.response.data;
			res.render('error', {
				message: spoonacular.errorMessage(error.code)
			});
		});
});

app.get('/recipe', (req, res) => {
	spoonacular.recipeRequest(req.query.id)
		.then((response) => {
			response = response.data;
			// analyzedInstructions is (by some reason) provided as an array with at most one object.
			if (response.analyzedInstructions.length > 0) {
				response.instructionsSteps = response.analyzedInstructions[0].steps;
			}
			else {
				response.instructionsSteps = undefined;
			}
			response.hasSource = (response.sourceUrl || response.sourceName || response.creditsText);

			// Since the recipe view uses several informations from the response object, the simpler approach
			//  below was chosen instead of filtering each text property separately, such as it's done
			//  in the search route above.
			response = JSON.parse(appUtils.filterBadWords(JSON.stringify(response)));
			
			res.render('recipe', { response });
		})
		.catch((error) => {
			error = error.response.data;
			res.render('error', {
				message: spoonacular.errorMessage(error.code)
			});
		});
});

// -------------------------------------------------------------------

// Start server:
app.listen(port, () => {
	console.log('Server listening on port', port);
});
