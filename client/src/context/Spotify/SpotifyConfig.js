export const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
export const client_id = '089c0e89579c46ae9b28bf07c70471dd';
export const redirect_uri = 'https://trapempire.com/'; //'http://localhost:3000/'; //'http://10.163.1.116:3000/';
export const scopes = [
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
export const response_type = 'code'; //token
export const loginUrl = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join(
	'%20'
)}&response_type=${response_type}&show_dialog=true`;
