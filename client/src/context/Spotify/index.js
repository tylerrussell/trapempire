import React, { createContext, useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { loginUrl } from './SpotifyConfig';
import { toast } from 'react-toastify';
import * as $ from 'jquery';
import Axios from 'axios';

export const urlParams = new URLSearchParams(window.location.search);

export const getParam = (param) => {
	return urlParams.get(param);
};

const initialState = {
	access_token: null,
	refresh_token: null,
	loggedIn: false,
	expires: null,
};

export const SpotifyContext = createContext();

export const SpotifyProvider = (props) => {
	const ACCESS_TOKEN = 'trapnation-spotify-access-token';
	const REFRESH_TOKEN = 'trapnation-spotify-refresh-token';
	const TOKEN_EXPIRES = 'trapnation-spotify-access-expires';

	const [cookies, setCookie, removeCookie] = useCookies([
		ACCESS_TOKEN,
		REFRESH_TOKEN,
		TOKEN_EXPIRES,
	]);

	const [radioPlaylist, setRadioPlaylist] = useState(null);
	const [search, setSearch] = useState('');
	const [userid, setUserid] = useState(null);
	const [loading, setLoading] = useState(false);
	const [uris, setUris] = useState(null);
	const [selectedTrack, setSelectedTrack] = useState(null);
	const [spotifyPlayerState, setSpotifyPlayerState] = useState(null);
	const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
	const [randomTrack, setRandomTrack] = useState(null);
	const [playing, setPlaying] = useState(true);
	const [playlist, setPlaylist] = useState(null);
	const playlists = ['2JRnEhWea6tkwdzIcG4g9t', '2ztL8VpxM3iuFd4EABoBvg'];
	const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);
	const [radioSettingsState, setRadioSettings] = useState({
		target_popularity: 0.5,
		target_energy: 75,
		target_danceability: 75,
		quantity: 25,
	});
	const [credentials, setCredentials] = useState({
		access_token: cookies[ACCESS_TOKEN] || null,
		refresh_token: cookies[REFRESH_TOKEN] || null,
		loggedIn: (cookies[ACCESS_TOKEN] && cookies[REFRESH_TOKEN]) || null,
		expires: cookies[TOKEN_EXPIRES] || null,
	});

	const [state, setState] = useState({
		token: cookies[ACCESS_TOKEN] || null,
		item: null,
		is_playing: false,
		needs_token: false,
		progress_ms: 0,
		no_data: true,
	});

	let expiresIsoDate = () => {
		return new Date(
			(Math.floor(new Date() / 1000) + 3600) * 1000
		).toISOString();
	};

	useEffect(() => {
		if (cookies[TOKEN_EXPIRES]) {
			console.log(cookies[TOKEN_EXPIRES]);
		}
	}, []);

	useEffect(() => {
		const code = getParam('code');
		if (code !== null) {
			console.log({ code });
			Axios.post('/api/authtoken', { code })
				.then((res) => {
					if (
						res.data.hasOwnProperty('access_token') &&
						res.data.hasOwnProperty('refresh_token')
					) {
						let expires = expiresIsoDate();
						setCredentials({
							access_token: res.data.access_token,
							refresh_token: res.data.refresh_token,
							loggedIn: true,
							expires,
						});
						setCookie(ACCESS_TOKEN, res.data.access_token, { path: '/' });
						setCookie(TOKEN_EXPIRES, expires, { path: '/' });
						setCookie(REFRESH_TOKEN, res.data.refresh_token, { path: '/' });
						toast.success('Successfully logged into Spotify');
					}
				})
				.catch((e) => console.log(e));
			window.history.replaceState({}, document.title, '/');
		}
	}, [setCookie]);

	const logout = () => {
		removeCookie(ACCESS_TOKEN);
		removeCookie(REFRESH_TOKEN);
		removeCookie(TOKEN_EXPIRES);
		setCredentials(initialState);
		setState({
			token: null,
			item: null,
			is_playing: false,
			needs_token: null,
			progress_ms: 0,
			no_data: false,
		});
	};

	const refreshAuthToken = () => {
		const { access_token, refresh_token } = credentials;
		Axios.post('/api/refreshauthtoken', { access_token, refresh_token })
			.then((res) => {
				if (res.data.hasOwnProperty('access_token')) {
					let expires = expiresIsoDate();
					setCredentials({
						access_token: res.data.access_token,
						refresh_token: credentials.refresh_token,
						loggedIn: true,
						expires,
					});
					setCookie(ACCESS_TOKEN, res.data.access_token, { path: '/' });
					setCookie(TOKEN_EXPIRES, expires, { path: '/' });
					window.location.reload();
				}
			})
			.catch((e) => console.log(e));
	};

	const getCurrentlyPlaying = (token) => {
		$.ajax({
			url: 'https://api.spotify.com/v1/me/player',
			type: 'GET',
			beforeSend: (xhr) => {
				xhr.setRequestHeader('Authorization', 'Bearer ' + token);
			},
			success: (data) => {
				// Checks if the data is not empty
				if (!data) {
					setState((prevState) => {
						return { ...prevState, no_data: true };
					});
					return;
				}
				setState((prevState) => {
					return {
						...prevState,
						item: data.item,
						is_playing: data.is_playing,
						needs_token: false,
						progress_ms: data.progress_ms,
						no_data: false,
					};
				});
			},
			error: (error) => {
				if (error.status === 401) {
					setState((prevState) => {
						return { ...prevState, needs_token: true };
					});
				} else {
					console.log('error', error.message);
				}
			},
		});
	};
	const intervalRef = useRef();

	useEffect(() => {
		const tick = () => {
			if (state.token) {
				getCurrentlyPlaying(state.token);
			}
		};
		intervalRef.current = tick;
	}, [state.token]);

	// useEffect(() => {
	// 	if (state.is_playing === false && state.needs_token) {
	// 		console.log(
	// 			'RUN SCRIPT TO UPDATE TOKEN, SAVE PLAYLIST INDEX AS QUERY VARIABLE, REFRESH PAGE AND JUMP BACK IN TO MIX AUTO PLAY '
	// 		);
	// 		alert('RUN SCRIPT');
	// 	}
	// }, [state.is_playing, state.needs_token]);

	useEffect(() => {
		if (credentials.loggedIn) {
			setState((prevState) => {
				return { ...prevState, token: credentials.access_token };
			});
			getCurrentlyPlaying(credentials.access_token);
			Axios.get('https://api.spotify.com/v1/me', {
				headers: {
					Authorization: 'Bearer ' + credentials.access_token,
				},
			})
				.then((data) => {
					setUserid(data.data.id);
				})
				.catch((e) => console.log(e));
		}
	}, [credentials]);

	useEffect(() => {
		function tick() {
			intervalRef.current();
		}

		let delay = 5000;

		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, []);

	/**
	 * Now Playing, need to detect if screen is small then resize it
	 */
	const [screenWidth, setScreenWidth] = useState(null);
	const [isSmallScreen, setIsSmallScreen] = useState(null);
	const smallScreenWidth = 630;
	useEffect(() => {
		const updateWindowDimensions = () => {
			setScreenWidth(window.innerWidth);
		};
		window.addEventListener('resize', updateWindowDimensions);
		return () => {
			window.removeEventListener('resize', updateWindowDimensions);
		};
	}, []);
	useEffect(() => {
		if (screenWidth) {
			if (screenWidth <= smallScreenWidth) {
				setIsSmallScreen(true);
			} else {
				setIsSmallScreen(false);
			}
		}
	}, [screenWidth]);
	return (
		<SpotifyContext.Provider
			value={{
				loginUrl,
				credentials,
				logout,
				refreshAuthToken,
				playlist,
				setPlaylist,
				selectedPlaylist,
				setSelectedPlaylist,
				playlists,
				userid,
				state,
				playing,
				setPlaying,
				selectedTrack,
				setSelectedTrack,
				selectedTrackIndex,
				setSelectedTrackIndex,
				uris,
				setUris,
				search,
				setSearch,
				randomTrack,
				setRandomTrack,
				spotifyPlayerState,
				setSpotifyPlayerState,
				radioPlaylist,
				setRadioPlaylist,
				radioSettingsState,
				setRadioSettings,
				loading,
				setLoading,
				isSmallScreen,
			}}
			{...props}
		/>
	);
};
