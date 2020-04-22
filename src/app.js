const path = require('path');
const express = require('express');
const hbs = require('hbs');
const spoonacular = require('./utils/spoonacular');

const app = express();
const port = process.env.PORT || 3000;

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
	const searchText = req.query['search-input'];
	spoonacular.request(searchText)
		.then((response) => {
			res.render('search', { result: response.data, query: searchText });
		})
		.catch((error) => {
			error = error.response.data;
			error.message = spoonacular.errorMessage(error.code);
			res.render('search', { error, query: searchText });
		});
});

// -------------------------------------------------------------------

// Start server:
app.listen(port, () => {
	console.log('Server listening on port', port);
});
