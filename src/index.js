const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Set directory to serve static files:
const pubDir = path.join(__dirname, '../public');
app.use(express.static(pubDir));

// Start server:
app.listen(port, () => {
	console.log('Server listening on port', port);
});
