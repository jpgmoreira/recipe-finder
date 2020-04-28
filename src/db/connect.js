const mongoose = require('mongoose');

const connectionUrl = 'mongodb://127.0.0.1:27017/dbtest1';

mongoose.connect(connectionUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
