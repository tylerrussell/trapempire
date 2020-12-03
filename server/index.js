require('dotenv').config();
const express = require('express');
const app = express();
const chalk = require('chalk');
const morgan = require('morgan');
const PORT = process.env.PORT || 5000;
const apiRouter = require('./routes/api');
const spotifyRouter = require('./routes/spotify');
const path = require('path');
const connectDB = require('./config/db');

connectDB();

app.use(function (req, res, next) {
	const host = req.get('Host');
	if (req.get('X-Forwarded-Proto') !== 'https') {
		if (process.env.NODE_ENV === 'production' && host === 'trapempire.com') {
			res.redirect('https://' + req.get('Host') + req.url);
		}
	} else next();
});

app.use(morgan('combined'));

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

const pubdir = {
	development: 'public/',
	production: 'build/',
};

let root = path.join(__dirname, '..', 'client', pubdir[process.env.NODE_ENV]);

app.use(express.static(root));

app.use('/api', apiRouter);
app.use('/spotify', spotifyRouter);

app.listen(PORT, () => {
	console.log(
		chalk.yellow(`Backend server running at http://localhost:${PORT}`)
	);
});
