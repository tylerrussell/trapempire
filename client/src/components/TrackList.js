import React, { useContext } from 'react';
import { FlexRow } from './Flex';
import styled from 'styled-components';
import Constants from '../Constants';
import { ArtistLink } from './SpotifyComponents';
import { SpotifyContext } from '../context/Spotify';

const ListButton = styled.button`
	text-align: left;
	display: block;
	width: 300px;
	font-size: 22px;
	cursor: pointer;
	border-radius: 6px;
	border: 1px solid ${Constants.colors.red};
	background-color: ${({ selectedTrack, uri }) =>
		selectedTrack === uri ? Constants.colors.red : 'white'};
	span {
		display: inherit;
		font-size: 10px;
	}
	&:hover {
		color: white;
		background-color: ${Constants.colors.red};
	}
`;
const ArtistsWrapper = styled.span`
	display: flex;
	flex-wrap: wrap;
`;
const TrackList = ({ playlist, uris: thisUris }) => {
	const {
		uris,
		setUris,
		selectedTrack,
		setPlaying,
		setSelectedTrack,
		setSelectedTrackIndex,
	} = useContext(SpotifyContext);

	const handleClick = (item) => {
		let index;
		if (item.hasOwnProperty('track')) {
			index = playlist.findIndex((x) => x.track.uri === item.uri);
		} else {
			index = playlist.findIndex((x) => x.uri === item.uri);
		}
		// console.log({ playlist, item, index });
		setSelectedTrackIndex(index);
		if (uris) {
			if (uris[index] !== item.uri) {
				setUris(thisUris);
			}
		} else {
			let list = playlist.map((x) => x.uri);
			if (list[0] === undefined) {
				list = playlist.map((x) => x.track.uri);
			}
			//console.log({ list });
			setUris(list);
		}
		setSelectedTrack(item.uri);
		setPlaying(true);
	};
	//console.log({ playlist });
	return (
		<FlexRow>
			<div>
				{playlist &&
					playlist.map((item, index) => {
						if (item.hasOwnProperty('track')) {
							item = item.track;
						}
						return (
							<ListButton
								key={`track-list-${index}`}
								id={item.id}
								selectedTrack={selectedTrack}
								uri={item.uri}
								onClick={() => handleClick(item)}
							>
								{item.name}
								<FlexRow>
									<ArtistsWrapper>
										{item.artists.map((artist, index) => [
											index > 0 && <span key={`spacer-${index}`}>,&nbsp;</span>,
											<ArtistLink
												key={`${item.id}-artist-${index}`}
												artist={artist}
											/>,
										])}
									</ArtistsWrapper>
								</FlexRow>
							</ListButton>
						);
					})}
			</div>
		</FlexRow>
	);
};

export default TrackList;
