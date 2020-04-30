const path = require('path');
const nock = require('nock');

// Side note: mock any requests to a specific host:
// https://github.com/nock/nock/issues/495#issuecomment-328501637

nock('https://api.spoonacular.com')
	.persist()
	.get('/recipes/complexSearch')
	.query(true)
	.replyWithFile(200, path.join(__dirname, 'responses/search.json'), {'Content-Type': 'application/json'});

nock('https://api.spoonacular.com')
	.persist()
	.get(/recipes\/\d*\/information$/)
	.query(true)
	.replyWithFile(200, path.join(__dirname, 'responses/yogurt.json'), {'Content-Type': 'application/json'});

nock('https://api.spoonacular.com')
	.persist()
	.get('/recipes/informationBulk')
	.query(true)
	.replyWithFile(200, path.join(__dirname, 'responses/favorites.json'), {'Content-Type': 'application.json'});
