import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Typography from '../components/Typography';
import { SearchLink, GridContainer } from '../components/SpotifyComponents';
import { SpotifyContext } from '../context/Spotify';
import { useDebounce } from 'use-debounce';
import { ControlButton } from '../components/Button';
import PreviewList from '../components/PreviewList';

const { H1 } = Typography;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;
const Input = styled.input`
	padding: 15px 20px;
	border: 1px solid #ccc;
	border-radius: 8px;
	outline: none;
`;
const Search = () => {
	const { search, setSearch } = useContext(SpotifyContext);
	const [value] = useDebounce(search, 500);
	const [data, setData] = useState(null);
	document.title = `🔍 ${search ? search : 'Search'}`;

	useEffect(() => {
		if (value) {
			Axios.get(`/spotify/search?q=${value}`)
				.then((res) => {
					console.log({ res });
					setData(res.data);
				})
				.catch((e) => console.log(e.message));
		} else {
			setData(null);
		}
	}, [value]);
	return (
		<Container>
			<Input
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder={'Search for an artist/album/playlist/track...'}
			/>
			<GridContainer>
				{data && (
					<div>
						<H1>Artists</H1>
						<PreviewList
							listChildren={data.artists.items.map((item, index) => [
								<SearchLink
									key={`artist-${index}`}
									linkTo={`/artist/${item.id}`}
									images={item.images}
									name={item.name}
									description={''}
								/>,
							])}
						/>
					</div>
				)}
				{data && (
					<div>
						<H1>Albums</H1>
						<PreviewList
							listChildren={data.albums.items.map((item, index) => [
								<SearchLink
									key={`album-${index}`}
									linkTo={`/album/${item.id}`}
									images={item.images}
									name={item.name}
									description={
										<>
											{item.artists.map((artist, index) => [
												index > 0 && ', ',
												artist.name,
											])}
										</>
									}
								/>,
							])}
						/>
					</div>
				)}
				{data && (
					<div>
						<H1>Playlists</H1>
						<PreviewList
							listChildren={data.playlists.items.map((item, index) => [
								<SearchLink
									key={`playlist-${index}`}
									linkTo={`/playlist/${item.id}`}
									images={item.images}
									name={item.name}
									description={''}
								/>,
							])}
						/>
					</div>
				)}
				{data && (
					<div>
						<H1>Tracks</H1>
						<PreviewList
							listChildren={data.tracks.items.map((item, index) => [
								<SearchLink
									key={`track-${index}`}
									linkTo={`/album/${item.album.id}`}
									images={item.album.images}
									name={item.name}
									description={''}
								/>,
							])}
						/>
					</div>
				)}
			</GridContainer>
		</Container>
	);
};

export default Search;
