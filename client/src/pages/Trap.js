import React, { useEffect, useContext, useState } from 'react';
import Axios from 'axios';
import Typography from '../components/Typography';
import TrackList from '../components/TrackList';
import { PreviewPlayer } from '../components/SpotifyComponents';
import { FlexRow } from '../components/Flex';
import { SpotifyContext } from '../context/Spotify';

const { H1 } = Typography;

const Trap = () => {
	const { playlists, playlist, setPlaylist, selectedPlaylist } = useContext(
		SpotifyContext
	);
	const [_uris, _setUris] = useState([]); //temp storage until played

	useEffect(() => {
		Axios.get(`/spotify/playlist/${playlists[0]}`)
			.then((res) => {
				console.log({ res });
				setPlaylist(res.data.playlist.tracks);
				_setUris(res.data.uris);
			})
			.catch((e) => {
				console.log({ e });
			});
	}, [selectedPlaylist, setPlaylist, _setUris]); // eslint-disable-line
	return (
		<div>
			<H1>Playlist </H1>
			<FlexRow>
				{playlist && <TrackList playlist={playlist} uris={_uris} />}
				<PreviewPlayer />
			</FlexRow>
		</div>
	);
};

export default Trap;
