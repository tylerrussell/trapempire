const SpotifyWebApi = require('spotify-web-api-node');
const btoa = require('btoa');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

const headers = {
	app: () => {
		return {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
		};
	},
	user: (token) => {
		return {
			Authorization: 'Bearer ' + token,
		};
	},
};

const apiResponse = (res, data) => {
	res.type('json');
	res.send(JSON.stringify(data, null, 2));
};

const scopes = [
	'user-top-read',
	'user-read-currently-playing',
	'user-read-playback-state',
	'streaming',
	'user-read-email',
	'user-read-private',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-library-read',
	'user-library-modify',
	'user-follow-read',
	'user-follow-modify',
];

const credentials = {
	clientId,
	clientSecret,
	redirectUri,
};

const appAccessToken = async () => {
	var spotifyApi = new SpotifyWebApi({
		clientId,
		clientSecret,
	});
	// Retrieve an access token.
	const {
		body: { access_token },
	} = await spotifyApi.clientCredentialsGrant();
	return access_token;
};

module.exports = {
	headers,
	apiResponse,
	clientId,
	clientSecret,
	redirectUri,
	credentials,
	scopes,
	appAccessToken,
};
