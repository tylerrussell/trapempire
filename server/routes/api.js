const express = require('express');
const router = express.Router();
const {
	appAccessToken,
	apiResponse,
	scopes,
	credentials,
} = require('../config/utils');
const SpotifyWebApi = require('spotify-web-api-node');

router.get('/', async function (req, res) {
	const _appAccessToken = await appAccessToken();
	const spotifyApi = new SpotifyWebApi(credentials);
	spotifyApi.setAccessToken(_appAccessToken);

	spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
		function (data) {
			console.log('Artist albums', data.body);
			apiResponse(res, data.body);
		},
		function (err) {
			console.error(err);
		}
	);
});

router.get('/authurl', function (req, res) {
	let authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'trapnation');
	apiResponse(res, { authorizeURL });
});

router.post('/authtoken', function (req, res) {
	const { code } = req.body;
	console.log({ code });
	const spotifyApi = new SpotifyWebApi(credentials);
	console.log({ credentials });
	// Retrieve an access token and a refresh token
	spotifyApi.authorizationCodeGrant(code).then(
		function (data) {
			apiResponse(res.status(200), data.body);
		},
		function (err) {
			console.log({ err });
			apiResponse(res.status(500), {
				message: 'Something went wrong',
				error: err,
			});
		}
	);
});

router.post('/refreshauthtoken', function (req, res) {
	const { access_token, refresh_token } = req.body;
	const spotifyApi = new SpotifyWebApi(credentials);
	spotifyApi.setAccessToken(access_token);
	spotifyApi.setRefreshToken(refresh_token);
	spotifyApi.refreshAccessToken().then(
		function (data) {
			apiResponse(res.status(200), data.body);
		},
		function (err) {
			apiResponse(res.status(500), {
				message: 'Could not refresh access token',
				error: err,
			});
			console.log();
		}
	);
});

router.post('/newreleases', function (req, res) {
	const { access_token } = req.body;
	const spotifyApi = new SpotifyWebApi();
	spotifyApi.setAccessToken(access_token);
	spotifyApi.getNewReleases().then(
		function (data) {
			apiResponse(res.status(200), data.body);
		},
		function (err) {
			console.log({ err });
			apiResponse(res.status(500), {
				message: 'Something went wrong',
				error: err,
			});
		}
	);
});

module.exports = router;
