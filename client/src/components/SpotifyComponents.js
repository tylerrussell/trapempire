import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import SpotifyPlayerAuth from 'react-spotify-web-playback';
import { Link as LinkImport, useHistory } from 'react-router-dom';
import Typography from './Typography';
import Axios from 'axios';
import { FlexColumn, FlexRow } from './Flex';
import TrackList from './TrackList';
import { GrGroup } from 'react-icons/gr';
import { FiArrowLeft } from 'react-icons/fi';
import { RiSpotifyFill } from 'react-icons/ri';
import Constants from '../Constants';
import SpotifyPlayerPreview from 'react-spotify-player';
import Loading from './Loading';
import { Cards } from 'react-responsive-cards';
import Alert from './Alert';
import { SpotifyContext } from '../context/Spotify';
import PreviewList from './PreviewList';
import { CallToAction, CallToActionLink, ControlButton } from './Button';
import ReactTooltip from 'react-tooltip';
import { BiRefresh } from 'react-icons/bi';
import TimeAgo from 'react-timeago';
const { H1, H5, Tag, P } = Typography;

const ListGroup = styled.ul`
	list-style-type: none;
	padding: 0;
	margin: 3px;
`;

const RelatedImg = styled.img`
	border-radius: 50%;
	width: 20px;
	height: 20px;
	margin-right: 7px;
`;
const AlbumImg = styled.img`
	border-radius: 14px;
	max-width: ${({ minWidth }) => (minWidth ? minWidth : '50px')};
	min-width: ${({ minWidth }) => (minWidth ? minWidth : '50px')};
	margin-right: 7px;
	margin-top: 5px;
`;
const ImgPlaceholder = styled.div`
	background-color: #ccc;
	width: 50px;
	height: 50px;
	border-radius: 14px;
	margin-right: 7px;
	margin-top: 5px;
`;
const RelatedName = styled.span`
	display: inline-block;
	font-weight: 900;
	font-size: 12px;
	position: inherit;
	margin: 0;
	white-space: nowrap;
`;
const CardFooter = styled.div`
	min-width: 300px;
	font-size: 10px;
	text-align: center;
	text-transform: uppercase;
	background-color: transparent;
`;
const ListGroupItem = styled.li`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0;
	margin: 5px;
	overflow-x: hidden;
`;
export const GridContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 0px;
	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
	@media (min-width: 768px) {
		grid-template-columns: 1fr 1fr;
	}
	@media (min-width: 992px) {
		grid-template-columns: 1fr 1fr 1fr;
	}
	@media (min-width: 1200px) {
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}
`;

export const Back = () => {
	let history = useHistory();
	return (
		<>
			<button onClick={() => history.goBack()}>
				<FiArrowLeft /> Back
			</button>
		</>
	);
};

// const AlbumElem = styled.div`
// 	p {
// 		padding: 0;
// 		margin: 0;
// 		font-size: 12px;
// 	}
// `;
const Img = styled.img`
	width: 260px;
`;
// const AlbumArt = ({ album, ...rest }) => {
// 	const { id, images, name, release_date, total_tracks } = album;
// 	return (
// 		<Link to={`/album/${id}`}>
// 			<AlbumElem>
// 				{images.length > 0 && <Img src={images[1].url} alt="" />}
// 				<p>
// 					<b>{name}</b> | {total_tracks} track{total_tracks > 1 && "s"} |{" "}
// 					{release_date}
// 				</p>
// 			</AlbumElem>
// 		</Link>
// 	);
// };
export const Artist = () => {
	let { id } = useParams();
	const [data, setData] = useState(null);
	const [thisUris, setThisUris] = useState([]);
	const [details, setDetails] = useState([]);
	const history = useHistory();
	useEffect(() => {
		Axios.get(`/spotify/artist/${id}`)
			.then((res) => {
				setData(res.data.data);

				setThisUris(res.data.data.uris);
				//console.log(res.data.data);
				document.title = res.data.data.artist.name;
				// if (res.data.data.uris.indexOf(selectedTrack) === -1) {
				// 	setSelectedTrackIndex(0);
				// } else {
				// 	setSelectedTrackIndex(res.data.data.uris.indexOf(selectedTrack));
				// }
			})
			.catch((e) => console.log({ e }));
	}, [id]);
	// useEffect(() => {
	// 	if (data) {
	// 		console.log(data);
	// 	}
	// }, [data]);

	useEffect(() => {
		if (data) {
			let items = [];
			Object.keys(data).forEach((key) => {
				if (key.startsWith('albums')) {
					data[key].items.forEach((album) => {
						items.push(album);
					});
				}
			});
			let arr = items.map((item) => {
				//let {uri} = item
				return {
					title: item.name,
					description: item.artists.map((x) => x.name).join(', '),
					image: item.images[1].url,
					handleOnClick: () => history.push(`/album/${item.id}`),
					renderFooter: (
						<CardFooter>
							{item.album_type} released {item.release_date}
						</CardFooter>
					),
				};
			});
			setDetails(arr);
		}
	}, [data, history]);
	return !data ? (
		<Loading />
	) : (
		<FlexColumn>
			<GridContainer>
				<div>
					{<H1>{!data ? 'Artist' : data.artist.name}</H1>}
					{data &&
						data.artist &&
						data.artist.images &&
						data.artist.images.length > 0 && (
							<img
								style={{ maxWidth: '300px' }}
								src={data.artist.images[1].url}
								alt=''
							/>
						)}
					{data && <FollowingButton artistId={data.artist.id} />}
					<P style={{ fontSize: '10px' }}>
						{data && (
							<>
								{id}&nbsp;&nbsp;&nbsp;
								<GrGroup />
								&nbsp;
								{data.artist.followers.total}
							</>
						)}
					</P>
					{data &&
						data.artist.genres.length > 0 &&
						data.artist.genres.map((genre, index) => [
							<Tag key={`genre-${index}`}>{genre}</Tag>,
						])}
					{/* {data && (
						<div>
							<iframe
								src={`https://open.spotify.com/follow/1/?uri=spotify:artist:${data.artist.id}&size=detail&theme=light`}
								width="300"
								height="56"
								scrolling="no"
								frameborder="0"
								style="border:none; overflow:hidden;"
								allowtransparency="true"
							></iframe>
						</div>
					)} */}
				</div>

				<div>
					<H5>Top Tracks</H5>
					{data && <TrackList playlist={data.topTracks} uris={thisUris} />}
				</div>

				<div>
					<H5>Related artists</H5>
					<ListGroup>
						{data &&
							data.relatedArtists &&
							data.relatedArtists.map((artist, index) => [
								<ListGroupItem key={`list-item-${index}`}>
									<ArtistLink artist={artist} />
								</ListGroupItem>,
							])}
					</ListGroup>
				</div>
				<div>
					<PreviewPlayer />
				</div>
			</GridContainer>
			<H1 style={{ textAlign: 'center' }}>Discography</H1>
			<div>
				{data && data.albums.items.length > 0 && details && (
					<Cards details={details} />
				)}
			</div>
		</FlexColumn>
	);
};

export const Track = () => {
	let { id } = useParams();
	return (
		<div>
			<H1>Track</H1>
			{id}
		</div>
	);
};

export const Album = () => {
	let { id } = useParams();
	const [data, setData] = useState(null);
	const [thisUris, setThisUris] = useState([]);
	useEffect(() => {
		Axios.get(`/spotify/album/${id}`)
			.then((res) => {
				setData(res.data.data);
				setThisUris(res.data.data.uris);
				//console.log(res.data);
				document.title = `${
					res.data.data.album.name
				} by ${res.data.data.album.artists.map((x) => x.name).join(', ')}`;
			})
			.catch((e) => console.log({ e }));
	}, [id]);
	// useEffect(() => {
	// 	if (data) {
	// 		console.log(data);
	// 	}
	// }, [data]);
	return !data ? (
		<Loading />
	) : (
		<FlexColumn>
			<div>
				<Back />
			</div>
			<H1>{!data ? 'Album' : data.album.name}</H1>
			<GridContainer>
				<div>
					{data && `${data.album.album_type} by `}
					{data &&
						data.album.artists.map((artist, index) => [
							index > 0 && ', ',
							<ArtistLink key={`artist-${index}`} artist={artist} />,
						])}
					<br />
					{data && data.album.images && data.album.images.length > 0 && (
						<AlbumImg minWidth='300px' src={data.album.images[1].url} />
					)}

					{data && (
						<P style={{ fontSize: '10px' }}>
							<b>Released:</b> {data.album.release_date}
						</P>
					)}
					<P style={{ fontSize: '10px' }}>{id}</P>
				</div>
				<div>
					<H5>Tracklist</H5>
					{data && (
						<TrackList playlist={data.album.tracks.items} uris={thisUris} />
					)}
				</div>
				<div>
					<PreviewPlayer />
				</div>
			</GridContainer>
		</FlexColumn>
	);
};

const HeatMapContainer = styled.div`
	margin 20px;
`;
const HeatMapCard = styled.div`
	border-radius: 8px;
	border: 1px solid #ccc;
	background-color: white;
`;
const HeatMapItems = styled.div`
	display: block;
	text-align: center;
`;

export const ArtistHeatMap = ({ playlist }) => {
	const [elems, setElems] = useState(null);
	useEffect(() => {
		let artistData = {};
		playlist.forEach((item) => {
			if (item.hasOwnProperty('track')) {
				item = item.track;
			}
			item.artists.forEach((artist) => {
				if (typeof artistData[artist.name] === 'object') {
					artistData[artist.name].count++;
				} else {
					artistData[artist.name] = {
						artist,
						count: 1,
					};
				}
			});
		});
		artistData = Object.keys(artistData)
			.map((key) => {
				return artistData[key];
			})
			.sort((a, b) => {
				return b.count - a.count;
			})
			.map((item, index) => {
				let max = 45,
					calc = 12 + item.count * 6,
					fontSize = calc < max ? calc : max;
				return (
					<ArtistLink
						key={`artist-heatmap-${index}`}
						style={{
							fontSize,
							padding: 5,
							margin: 0,
							display: 'inline-block',
						}}
						artist={item.artist}
					/>
				);
			});

		setElems(artistData);
	}, [playlist]);

	return (
		elems && (
			<HeatMapContainer>
				<HeatMapCard>
					<HeatMapItems>
						<PreviewList listChildren={elems} previewQuantity={10} />
					</HeatMapItems>
				</HeatMapCard>
			</HeatMapContainer>
		)
	);
};

const MenuItem = styled(LinkImport)`
	font-size: 12px;
	text-transform: uppercase;
	margin-right: 20px;
`;

const TitleItem = styled.b`
	font-size: 12px;
	text-transform: uppercase;
	margin-right: 20px;
	color: ${Constants.colors.red};
`;

export const Playlist = () => {
	let { id } = useParams();
	const { playlists, playlist, setPlaylist, selectedPlaylist } = useContext(
		SpotifyContext
	);
	const [data, setData] = useState(null);

	const [_uris, _setUris] = useState([]); //temp storage until played
	useEffect(() => {
		Axios.get(`/spotify/playlist/${id}`)
			.then((res) => {
				//console.log({ res });
				setPlaylist(res.data.playlist.tracks);
				_setUris(res.data.uris);
				setData(res.data);
				document.title = `${res.data.playlist.name} (playlist)`;
			})
			.catch((e) => {
				console.log({ e });
			});
	}, [id, selectedPlaylist, setPlaylist, _setUris]); // eslint-disable-line

	return !data ? (
		<Loading />
	) : (
		<FlexColumn>
			<Alert
				message={
					<>
						Want to maintain a featured spotify playlist? Send it to&nbsp;
						<a href='mailto:i@tyzel.com'>i@tyzel.com</a>
					</>
				}
			/>
			<H1>Playlist</H1>
			<FlexRow>
				<TitleItem>featured playlists</TitleItem>
				{playlists.map((p, i) => {
					return (
						<MenuItem key={`playlist-${i}`} to={`/playlist/${p}`}>
							{i}
						</MenuItem>
					);
				})}
			</FlexRow>
			<GridContainer>
				<div>
					{data && data.playlist.images.length === 3 && (
						<Img src={data.playlist.images[1].url} alt='' />
					)}
					<br />
					{data && <P>{data.playlist.name}</P>}
				</div>
				<div>{playlist && <TrackList playlist={playlist} uris={_uris} />}</div>
				<div>
					<H1 style={{ margin: 0, textAlign: 'center' }}>
						Artists <small>on this playlist</small>
					</H1>
					{playlist && <ArtistHeatMap playlist={playlist} />}
				</div>
			</GridContainer>
		</FlexColumn>
	);
};

const Link = styled(LinkImport)`
	color: black;
	&:hover {
		border-bottom: 1px dotted;
	}
`;

export const ArtistLink = ({ artist, ...rest }) => {
	const { id, name, images } = artist;
	return (
		<Link to={`/artist/${id}`}>
			{images && Array.isArray(images) && images.length === 3 && (
				<RelatedImg src={images[2].url} />
			)}
			<RelatedName {...rest}>{name}</RelatedName>
		</Link>
	);
};

export const AlbumLink = ({ album }) => {
	const { id, album_type, name, images, artists } = album;
	return (
		<Link to={`/album/${id}`}>
			<FlexRow>
				{images && Array.isArray(images) && images.length === 3 && (
					<AlbumImg src={images[2].url} />
				)}
				<FlexColumn>
					<RelatedName>{name}</RelatedName>
					<FlexRow>
						{album_type} by&nbsp;
						{artists &&
							artists.map((artist, index) => [
								index > 0 && <div key='spacer-0'>,&nbsp;</div>,
								<ArtistLink
									key={`${artist.id}-artist-${index}`}
									artist={artist}
								/>,
							])}
					</FlexRow>
				</FlexColumn>
			</FlexRow>
		</Link>
	);
};

export const SearchLink = ({ linkTo, images, name, description }) => {
	return (
		<Link to={linkTo}>
			<FlexRow>
				{images && Array.isArray(images) && images.length === 3 ? (
					<AlbumImg src={images[2].url} />
				) : (
					<ImgPlaceholder />
				)}
				<FlexColumn>
					<RelatedName>{name}</RelatedName>
					<FlexRow>{description}</FlexRow>
				</FlexColumn>
			</FlexRow>
		</Link>
	);
};

export const TrackLink = ({ track }) => {
	const { id, name } = track;
	return <Link to={`/track/${id}`}>{name}</Link>;
};
export const PlaylistLink = ({ playlist }) => {
	const { id, name } = playlist;
	return <Link to={`/playlist/${id}`}>{name}</Link>;
};
export const SpotifyPlayer = () => {
	const {
		selectedTrack,
		setSelectedTrack,
		selectedTrackIndex,
		playing,
		uris,
		setSelectedTrackIndex,
		userid,
		credentials,
		setSpotifyPlayerState,
	} = useContext(SpotifyContext);
	let urisSource = uris ? uris : selectedTrack ? [selectedTrack] : null;
	return (
		<div>
			{userid && selectedTrackIndex >= 0 && credentials.loggedIn && urisSource && (
				<SpotifyPlayerAuth
					autoPlay={true}
					token={credentials.access_token}
					uris={urisSource}
					showSaveIcon={true}
					play={playing}
					offset={selectedTrackIndex}
					magnifySliderOnHover={true}
					syncExternalDevice={true}
					callback={(state) => {
						setSpotifyPlayerState(state);
						if (state.track.uri && selectedTrack !== state.track.uri) {
							let { uri } = state.track;
							setSelectedTrack(uri);
							try {
								let index = uris.indexOf(uri);
								setSelectedTrackIndex(index);
							} catch (e) {
								console.log(e);
							}
						}
					}}
				/>
			)}
		</div>
	);
};

const SpotifyLoginButton = styled.a`
	padding: 5px;
	background-color: ${Constants.colors.red};
	color: white;
	&:hover {
		background-color: white;
		color: ${Constants.colors.red};
	}
`;
export const PreviewPlayer = () => {
	const size = {
		width: '100%',
		height: 300,
	};
	const view = 'list'; // or 'coverart'
	const theme = 'black'; // or 'white'

	const { loginUrl, selectedTrack, credentials } = useContext(SpotifyContext);
	return (
		<div style={{ maxWidth: '300px' }}>
			{!credentials.loggedIn && (
				<>
					<SpotifyLoginButton href={loginUrl}>
						Login to Spotify for full track
					</SpotifyLoginButton>
					{selectedTrack && (
						<SpotifyPlayerPreview
							uri={selectedTrack}
							size={size}
							view={view}
							theme={theme}
						/>
					)}
				</>
			)}
			{/* {!selectedTrack ? (
				<p style={{ padding: "0 10px" }}>Select a track</p>
			) : (
				<Track id={selectedTrack} />
			)} */}
		</div>
	);
};
const FollowingButtonElem = styled.button`
	border-radius: 8px;
	border: 1px solid black;
	outline: none;
	cursor: pointer;
`;
export const FollowingButton = ({ artistId }) => {
	const [following, setFollowing] = useState(false);
	const { credentials } = useContext(SpotifyContext);

	useEffect(() => {
		if (credentials.loggedIn) {
			let url = `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artistId}`;
			Axios.get(url, {
				headers: { Authorization: 'Bearer ' + credentials.access_token },
			})
				.then((data) => {
					setFollowing(data.data[0]);
				})
				.catch((e) => console.log(e));
		}
	}, [credentials, artistId]);

	const follow = () => {
		if (!following) {
			Axios({
				url: `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`,
				method: 'put',
				headers: {
					Authorization: 'Bearer ' + credentials.access_token,
				},
			})
				.then((data) => {
					setFollowing(true);
				})
				.catch((e) => console.log(e));
		}
	};

	return (
		<div>
			{credentials.access_token && (
				<FollowingButtonElem onClick={follow}>
					<RiSpotifyFill /> {following ? 'Following' : 'Follow'}
				</FollowingButtonElem>
			)}
		</div>
	);
};

const NowPlayingImage = styled.img`
	height: 40px;
	width: 40px;
`;

export const NowPlaying = () => {
	const { state, credentials, loginUrl, logout } = useContext(SpotifyContext);
	return state && state.is_playing ? (
		<FlexRow>
			<NowPlayingImage src={state.item.album.images[2].url} /> &nbsp;{' '}
			<div>
				<TrackLink track={state.item} />
				<br />
				<small style={{ display: 'flex', flexWrap: 'wrap', width: '200px' }}>
					{state.item.artists.map((artist, index) => [
						index > 0 && <div key={`spacer-${index}`}>,&nbsp;</div>,
						<ArtistLink artist={artist} key={`artist=${index}`} />,
					])}
				</small>
			</div>
		</FlexRow>
	) : credentials.loggedIn ? (
		<CallToAction onClick={logout}>Sign Out</CallToAction>
	) : (
		<CallToActionLink href={loginUrl}>Sign In</CallToActionLink>
	);
};

const Icon = styled(BiRefresh)`
	@keyframes spinner {
		to {
			transform: rotate(360deg);
		}
	}
	font-size: 18px;
	animation: spinner 2s linear infinite;
`;
export const LoginRefreshButton = () => {
	const { credentials, state } = useContext(SpotifyContext);
	const isExpired = credentials.expires < new Date().toISOString();
	return credentials.loggedIn ? (
		<>
			<Link
				data-tip={`When your Spotify login credentials ${
					isExpired ? 'expired' : 'expires'
				}`}
				data-for='token-button'
				to={'/login'}
				style={{ border: 0 }}
			>
				<ControlButton style={{ fontSize: '14px' }}>
					<Icon />
					&nbsp;
					<TimeAgo date={credentials.expires} />
					&nbsp; {state && state.needs_token && ' | Your token is expired!'}
				</ControlButton>
			</Link>
			<ReactTooltip
				id='token-button'
				className='extraClass'
				delayHide={1000}
				effect='solid'
				place='right'
			/>
		</>
	) : (
		<span>
			<b>Pro tip</b>: Sign in to Spotify!
		</span>
	);
};
