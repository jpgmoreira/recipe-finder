const path = require('path');
const express = require('express');
const hbs = require('hbs');
const router = require('./routers/router');

// Connect to the database:
require('./db/connect');

// Instantiate app and set port number:
const app = express();
const port = process.env.PORT || 3000;

// Development-specific settings:
if (process.env.NODE_ENV === 'development') {
	require('./http_mock/http_mock');  // Mock HTTP requests to external APIs.
}

// Local paths:
const pubDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars. Set views and partials locations:
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Set static directory:
app.use(express.static(pubDir));

// Allow json and x-www-form-urlencoded as body parsers for POST method:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use router:
app.use(router);

// Start server:
app.listen(port, () => {
	console.log('Server listening on port', port);
});
