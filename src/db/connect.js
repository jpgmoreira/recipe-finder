const mongoose = require('mongoose');

const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
