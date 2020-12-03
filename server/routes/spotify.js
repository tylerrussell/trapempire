const express = require('express');
const router = express.Router();
const axios = require('axios');
const btoa = require('btoa');
const chalk = require('chalk');
const db = require('../db');
const Pump = require('../models/Pump');
const querystring = require('querystring');
const url = require('url');
const { token } = require('morgan');

const headers = {
	app: () => {
		const clientid = process.env.SPOTIFY_CLIENT_ID;
		const clientsecret = process.env.SPOTIFY_CLIENT_SECRET;
		return {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + btoa(clientid + ':' + clientsecret),
		};
	},
	user: (token) => {
		return {
			Authorization: 'Bearer ' + token,
		};
	},
};

function promise({
	method,
	url,
	key,
	data = null,
	token = null,
	prop,
	append = null,
	debug = false,
}) {
	return new Promise((resolve, reject) => {
		console.log(chalk.green('PROMISE', method, url, key));

		axios({
			url,
			data,
			headers: token ? headers.user(token) : headers.app(),
			method,
		})
			.then((res) => {
				let data = res.data;
				debug &&
					console.log(chalk.green(JSON.stringify({ arguments }, null, 2)));
				debug && console.log({ 'res.data': data });
				if (prop) {
					if (Array.isArray(prop)) {
						//recursive loop over the object properties to drill down on another value
						debug && console.log(chalk.blue('STARTING RECURSIVE LOOP'));

						do {
							debug && console.log({ data: data, prop });
							data = data[prop[0]];
							prop.splice(0, 1);
							debug && console.log({ data1: data });
						} while (prop.length > 0);
						debug && console.log({ data2: data });
					} else if (typeof prop === 'string') {
						data = res.data[prop];
					} else {
						debug && console.log(chalk.red('Else 3 - elseeee'));
					}
				} else {
					debug && console.log(chalk.red('Else 1 - no prop'));
				}
				//append should be an object
				let obj = append ? append : {};
				debug && console.log({ obj });
				obj[key] = data;
				resolve(obj);
			})
			.catch((e) => {
				reject(`Error, promise rejected: ${e.message}`);
			});
	});
}

const requests = {
	appToken: {
		method: 'post',
		url: 'https://accounts.spotify.com/api/token',
		data: 'grant_type=client_credentials',
		key: 'token',
		prop: 'access_token',
	},
	authToken: (code) => {
		const redirect_uri = process.env.redirect_uri || 'http://localhost:3000/';
		return {
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			data: { grant_type: 'authorization_code', code, redirect_uri },
			key: 'token',
			// prop: 'access_token',
			debug: true,
		};
	},
};

router.post('/authtoken', (req, res) => {
	const { code } = req.body;
	let prom = requests.authToken(code);
	console.log({ prom });
	promise(prom)
		.then((data) => {
			console.log('AUTH TOKEN');
			console.log({ data });
			apiResponse(res, data);
		})
		.catch((e) => {
			console.log(e);
		});
});

const apiResponse = (res, data) => {
	res.type('json');
	res.send(JSON.stringify(data, null, 2));
};

router.post('/profile', function (req, res) {
	const { token } = req.body;
	promise({
		method: 'get',
		url: 'https://api.spotify.com/v1/me',
		headers: headers.user(token),
		key: 'user',
	})
		.then((response) => {
			//const {token} = response;
			apiResponse(res, response);
		})
		.catch((e) => {
			console.log(e);
		});
});

router.get('/token', function (req, res) {
	promise(requests.appToken)
		.then((response) => {
			//const {token} = response;
			apiResponse(res, response);
		})
		.catch((e) => {
			console.log(e);
		});
});

router.get('/genres', function (req, res) {
	promise(requests.appToken)
		.then((response) => {
			const { token } = response;
			promise({
				method: 'get',
				url: 'https://api.spotify.com/v1/browse/categories?locale=sv_US',
				key: 'genres',
				prop: ['categories', 'items'],
				token,
				append: { token },
			})
				.then((response) => {
					apiResponse(res, response);
				})
				.catch((e) => {
					console.log(e);
				});
		})
		.catch((e) => {
			console.log(e);
		});
});

router.post('/playlists', function (req, res, next) {
	const { token, val } = req.body;
	promise({
		method: 'get',
		url: `https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`,
		key: 'playlists',
		prop: ['playlists', 'items'],
		token,
		append: { token },
	})
		.then((response) => {
			apiResponse(res, response);
		})
		.catch((e) => {
			console.log(e);
		});
	// axios
	// 	.get(
	// 		`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`,
	// 		{
	// 			headers: {
	// 				Authorization: "Bearer " + token
	// 			}
	// 		}
	// 	)
	// 	.then(response => {
	// 		let playlists = response.data.playlists.items;
	// 		res.type("json");
	// 		res.send(
	// 			JSON.stringify(
	// 				{
	// 					playlists
	// 				},
	// 				null,
	// 				2
	// 			)
	// 		);
	// 	})
	// 	.catch(e => {
	// 		console.log({ error: e.message });
	// 	});
});

router.post('/playlist', function (req, res, next) {
	const { token, selectedPlaylist } = req.body;
	promise({
		method: 'get',
		url: `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
		key: 'tracks',
		prop: ['items'],
		token,
		append: { token },
	})
		.then((response) => {
			console.log({ response });
			//response.uris = []
			//uris = tracks.map(item => item.track.uri);
			apiResponse(res, response);
		})
		.catch((e) => {
			console.log({ e });
		});
	// axios
	// 	.get(
	// 		`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks?limit=10`,
	// 		{
	// 			headers: {
	// 				Authorization: "Bearer " + token
	// 			}
	// 		}
	// 	)
	// 	.then(response => {
	// 		let tracks = response.data.items,
	// 			uris = tracks.map(item => item.track.uri);
	// 		res.type("json");
	// 		res.send(
	// 			JSON.stringify(
	// 				{
	// 					tracks,
	// 					uris
	// 				},
	// 				null,
	// 				2
	// 			)
	// 		);
	// 	})
	// 	.catch(e => {
	// 		console.log({ error: e.message });
	// 	});
});
router.get('/pumps', (req, res) => {
	const page = req.query.page || 1;
	const limit = req.query.limit || 12;
	Pump.paginate({}, { page, limit, sort: { _id: -1 } }).then((docs) => {
		let ids = docs.docs.map((x) => x.uri.split(':')[2]);
		promise(requests.appToken)
			.then((response) => {
				const { token } = response;
				axios
					.get(`https://api.spotify.com/v1/tracks?ids=${ids.join(',')}`, {
						headers: { Authorization: 'Bearer ' + token },
					})
					.then((data) => {
						let obj = {
							tracks: data.data.tracks,
							uris: data.data.tracks.map((x) => x.uri),
							db: docs,
						};
						apiResponse(res, obj);
					})
					.catch((e) => console.log(e));
			})
			.catch((e) => console.log(e));
	});
});

router.get('/playlist/:id', function (req, res, next) {
	const { id } = req.params;
	promise(requests.appToken)
		.then((response) => {
			const { token } = response;
			let _tracks = [];
			let initialResponse = {};
			let getPlaylistItems = (url) => {
				promise({
					method: 'get',
					url,
					key: 'playlist',
					token,
					append: { token },
				})
					.then((response) => {
						//Initial request will be formatted different
						const { tracks } = response.playlist;
						if (tracks) {
							initialResponse.playlist = response.playlist;
							response.playlist.tracks.items.forEach((item) =>
								_tracks.push(item)
							);
							const { next } = tracks;
							if (next) {
								getPlaylistItems(next);
							} else {
								initialResponse.uris = _tracks.map((item) => item.track.uri);
								initialResponse.playlist.tracks = _tracks;
								apiResponse(res, initialResponse);
							}
						} else {
							//For processing playlist tracks requests
							response.playlist.items.forEach((item) => _tracks.push(item));
							const { next } = response.playlist;
							if (next) {
								getPlaylistItems(next);
							} else {
								initialResponse.uris = _tracks.map((item) => item.track.uri);
								initialResponse.playlist.tracks = _tracks;
								apiResponse(res, initialResponse);
							}
						}
					})
					.catch((e) => console.log(e));
			};
			getPlaylistItems(`https://api.spotify.com/v1/playlists/${id}`);
		})
		.catch((e) => console.log(e));
	// axios
	// 	.get(
	// 		`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks?limit=10`,
	// 		{
	// 			headers: {
	// 				Authorization: "Bearer " + token
	// 			}
	// 		}
	// 	)
	// 	.then(response => {
	// 		let tracks = response.data.items,
	// 			uris = tracks.map(item => item.track.uri);
	// 		res.type("json");
	// 		res.send(
	// 			JSON.stringify(
	// 				{
	// 					tracks,
	// 					uris
	// 				},
	// 				null,
	// 				2
	// 			)
	// 		);
	// 	})
	// 	.catch(e => {
	// 		console.log({ error: e.message });
	// 	});
});

router.get('/artist/:id', function (req, res, next) {
	const { id } = req.params;

	const _promise = (url, token, key) => {
		return new Promise((resolve, reject) => {
			axios
				.get(url, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				})
				.then((res) => {
					let data = res.data;
					//special conditions
					if (key === 'relatedArtists') {
						data = data.artists;
					} else if (key === 'topTracks') {
						data = data.tracks;
						let uris = data.map((item) => item.uri);
						resolve({ topTracks: data, uris });
					}
					resolve({ [key]: data });
				})
				.catch((e) => {
					reject(e.message);
				});
		});
	};
	const promises = (token, totalAlbums) => {
		let totalRequests = Math.ceil(totalAlbums / 20);
		let arr = [];
		arr.push(
			_promise(`https://api.spotify.com/v1/artists/${id}`, token, 'artist')
		);
		arr.push(
			_promise(
				`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`,
				token,
				'topTracks'
			)
		);
		arr.push(
			_promise(
				`https://api.spotify.com/v1/artists/${id}/related-artists`,
				token,
				'relatedArtists'
			)
		);
		for (let i = 0; i < totalRequests; i++) {
			let limit = 20,
				offset = i * limit;
			let url = (id) => {
				return `https://api.spotify.com/v1/artists/${id}/albums?offset=${offset}&limit=${limit}&include_groups=album,single,compilation,appears_on`;
			};

			arr.push(_promise(url(id), token, `albums${i > 0 ? i : ''}`));
		}
		return arr;
	};

	//high level request to figure out how many requests we need to make for the albums
	promise(requests.appToken)
		.then((response) => {
			const { token } = response;
			axios
				.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				})
				.then((albumsResponse) => {
					let albums = albumsResponse.data;

					Promise.all(promises(token, albums.total)).then((data) => {
						let obj = {};
						for (let i = 0; i < data.length; i++) {
							Object.keys(data[i]).forEach((key) => {
								obj[key] = data[i][key];
							});
						}
						// console.log({ obj });
						res.type('json');
						res.send(
							JSON.stringify(
								{
									data: obj,
								},
								null,
								2
							)
						);
					});
				})
				.catch((e) => {
					console.log({ e });
				});
		})
		.catch((e) => {
			console.log({ e });
		});
});

router.get('/album/:id', function (req, res, next) {
	const { id } = req.params;

	const promises = (token) => {
		return [
			new Promise((resolve, reject) => {
				axios
					.get(`https://api.spotify.com/v1/albums/${id}`, {
						headers: {
							Authorization: 'Bearer ' + token,
						},
					})
					.then((res) => {
						let album = res.data;
						resolve({ album });
					})
					.catch((e) => {
						reject(e.message);
					});
			}),
			new Promise((resolve, reject) => {
				axios
					.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
						headers: {
							Authorization: 'Bearer ' + token,
						},
					})
					.then((res) => {
						let tracks = res.data;
						resolve({ tracks });
					})
					.catch((e) => {
						reject(e.message);
					});
			}),
		];
	};

	promise(requests.appToken)
		.then((response) => {
			const { token } = response;
			Promise.all(promises(token)).then((data) => {
				console.log({ data });
				let obj = {};
				for (let i = 0; i < data.length; i++) {
					Object.keys(data[i]).forEach((key) => {
						obj[key] = data[i][key];
					});
				}
				res.type('json');
				res.send(
					JSON.stringify(
						{
							data: obj,
						},
						null,
						2
					)
				);
			});
		})
		.catch((e) => {
			console.log({ e });
		});

	// axios
	// 	.post(
	// 		"https://accounts.spotify.com/api/token",
	// 		"grant_type=client_credentials",
	// 		{
	// 			headers: {
	// 				"Content-Type": "application/x-www-form-urlencoded",
	// 				Authorization: "Basic " + btoa(clientid + ":" + clientsecret)
	// 			}
	// 		}
	// 	)
	// 	.then(tokenResponse => {
	// 		const token = tokenResponse.data.access_token;
	// 		console.log({ token });
	// 		axios
	// 			.get(`https://api.spotify.com/v1/artists/${id}`, {
	// 				headers: {
	// 					Authorization: "Bearer " + token
	// 				}
	// 			})
	// 			.then(artistResponse => {
	// 				let artist = artistResponse.data;
	// 				console.log({ artist });
	// 				axios
	// 					.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
	// 						headers: {
	// 							Authorization: "Bearer " + token
	// 						}
	// 					})
	// 					.then(albumsResponse => {
	// 						let albums = albumsResponse.data;
	// 						console.log({ albums });
	// 						axios
	// 							.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
	// 								headers: {
	// 									Authorization: "Bearer " + token
	// 								}
	// 							})
	// 							.then(topTracksResponse => {
	// 								let topTracks = topTracksResponse.data;
	// 								console.log({ topTracks });
	// 								axios
	// 									.get(
	// 										`https://api.spotify.com/v1/artists/${id}/related-artists`,
	// 										{
	// 											headers: {
	// 												Authorization: "Bearer " + token
	// 											}
	// 										}
	// 									)
	// 									.then(relatedArtistsResponse => {
	// 										let relatedArtists = relatedArtistsResponse.data;
	// 										console.log({ relatedArtists });
	// 										res.type("json");
	// 										res.send(
	// 											JSON.stringify(
	// 												{
	// 													artist,
	// 													albums,
	// 													topTracks,
	// 													relatedArtists
	// 												},
	// 												null,
	// 												2
	// 											)
	// 										);
	// 									})
	// 									.catch(e => {
	// 										console.log({ error4: e });
	// 									});
	// 							})
	// 							.catch(e => {
	// 								console.log({ error3: e });
	// 							});
	// 					})
	// 					.catch(e => {
	// 						console.log({ error2: e });
	// 					});
	// 			})
	// 			.catch(e => {
	// 				console.log({ error1: e });
	// 			});
	// 	});
});

router.get('/track/:id', function (req, res, next) {
	const { id } = req.params;
	promise(requests.appToken).then((response) => {
		const { token } = response;
		axios
			.get(`https://api.spotify.com/v1/tracks/${id}`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				let track = response.data;
				res.type('json');
				res.send(
					JSON.stringify(
						{
							track,
						},
						null,
						2
					)
				);
			})
			.catch((e) => {
				console.log({ error: e.message });
			});
	});
});
// router.post("/artist", function(req, res, next) {
// 	const { token, id } = req.body;
// 	axios
// 		.get(`https://api.spotify.com/v1/artists/${id}`, {
// 			headers: {
// 				Authorization: "Bearer " + token
// 			}
// 		})
// 		.then(response => {
// 			let artist = response.data.item;
// 			res.type("json");
// 			res.send(
// 				JSON.stringify(
// 					{
// 						artist
// 					},
// 					null,
// 					2
// 				)
// 			);
// 		})
// 		.catch(e => {
// 			console.log({ error: e.message });
// 		});
// });

router.post('/pump', (req, res) => {
	const { uri, username } = req.body;
	console.log({ uri, username });

	if (username && uri) {
		try {
			let pump = new Pump({ uri, username });
			pump.save();
			apiResponse(res, pump);
		} catch (e) {
			console.log(e.message);
		}
	}
});

router.get('/pump', (req, res) => {
	Pump.find({})
		.sort({ _id: -1 })
		.then((data) => apiResponse(res, data));
});

router.get('/search', (req, res) => {
	const q = req.query.q || '';
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;
	const url = `https://api.spotify.com/v1/search?query=${q}&type=album,artist,playlist,track&limit=${limit}&offset=${offset}`;
	promise(requests.appToken)
		.then((response) => {
			const { token } = response;
			axios({
				url,
				headers: {
					Authorization: 'Bearer ' + token,
				},
				method: 'GET',
			})
				.then((response) => {
					apiResponse(res, response.data);
				})
				.catch((e) => console.log(e));
		})
		.catch((e) => console.log(e.message));
});

router.get('/random', async (req, res) => {
	const { randomize, quantity = 25, ...rest } = req.query;
	const queryString = Object.keys(rest)
		.map((key) => key + '=' + rest[key])
		.join('&');
	const getRandomInt = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	};

	const randomDoc = async () => {
		let count = await Pump.countDocuments({});
		let rand = getRandomInt(0, count);
		let doc = await Pump.findOne().skip(rand);
		return doc;
	};

	const repeatVal = async (n, valFn) => {
		let arr = [];
		for (let i = 0; i < n; i++) {
			arr.push(await valFn());
		}
		return arr;
	};

	const limit = quantity - 5;

	const selections = randomize
		? await repeatVal(5, randomDoc)
		: await repeatVal(limit, randomDoc);

	const ids = selections.map((x) => x.uri.split(':')[2]);

	const seed_tracks = ids;

	promise(requests.appToken)
		.then(async (response) => {
			const { token } = response;
			const {
				data: { tracks },
			} = await axios.get(
				`https://api.spotify.com/v1/tracks?ids=${ids.join(',')}`,
				{
					headers: { Authorization: 'Bearer ' + token },
				}
			);
			const trackUris = tracks.map((x) => x.uri);
			let obj = {};
			if (randomize) {
				const {
					data: { tracks: recomendations },
				} = await axios.get(
					`https://api.spotify.com/v1/recommendations?limit=${limit}&seed_tracks=${seed_tracks}&${queryString}`,
					{
						headers: { Authorization: 'Bearer ' + token },
					}
				);
				const recUris = recomendations.map((x) => x.uri);
				obj.tracks = [...tracks, ...recomendations];
				obj.uris = [...trackUris, ...recUris];
			} else {
				obj.tracks = [...tracks];
				obj.uris = [...trackUris];
			}
			obj.db = selections;
			apiResponse(res, obj);
		})
		.catch((e) => console.log(chalk.red(e.message)));
});
module.exports = router;
