const path = require('path');
const nock = require('nock');

// Mock any requests to a specific host:
// https://github.com/nock/nock/issues/495#issuecomment-328501637
nock('https://api.spoonacular.com')
	.persist()
	.get(() => true)
	.delay(500)
	.replyWithFile(200, path.join(__dirname, 'responses/search.json') , {'Content-Type': 'application/json'});
