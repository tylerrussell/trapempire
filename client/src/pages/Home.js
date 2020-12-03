import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { Cards } from 'react-responsive-cards';
import Typography from '../components/Typography';
import Loading from '../components/Loading';
import { FlexColumn } from '../components/Flex';
import {
	PreviewPlayer,
	ArtistLink,
	ArtistHeatMap,
} from '../components/SpotifyComponents';
import Pagination from '../components/Pagination';
import styled from 'styled-components';
import { Element } from 'react-scroll';
import { SpotifyContext } from '../context/Spotify';
const PaginationWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;
const { H1 } = Typography;
const Home = () => {
	document.title = '🔥🔊Featured trap/dubstep tracks';
	const { setUris, setSelectedTrack, setSelectedTrackIndex } = useContext(
		SpotifyContext
	);
	const [details, setDetails] = useState(null);
	const [store, setStore] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(48);
	const [total, setTotal] = useState(null);

	useEffect(() => {
		const fetch = async () => {
			const res = await Axios.get(
				`/spotify/pumps?page=${currentPage}&limit=${limit}`
			);
			setStore(res.data);
			setCurrentPage(res.data.db.page);
			setTotal(res.data.db.totalDocs);
			setLimit(res.data.db.limit);
			let arr = res.data.tracks.map((track, index) => {
				return {
					title: track.name,
					description: (
						<>
							{track.artists.map((x, index) => [
								index > 0 && ', ',
								<ArtistLink key={`artist-${index}`} artist={x} />,
							])}
						</>
					),
					image: track.album.images[1].url,
					handleOnClick: () => {
						setUris(res.data.uris);
						setSelectedTrack(track.uri);
						setSelectedTrackIndex(index);
					},
					//handleOnClick: () => history.push(`/track/${track.id}`),
					renderFooter: <div style={{ minWidth: '300px' }}></div>,
				};
			});
			setDetails(arr);
		};
		fetch();
	}, [setSelectedTrack, setSelectedTrackIndex, setUris, currentPage, limit]);
	return !details ? (
		<Loading />
	) : (
		<FlexColumn>
			<H1 style={{ textAlign: 'center', padding: 0, margin: 0 }}>
				Featured Tracks
			</H1>
			<p style={{ textAlign: 'center', padding: 0, margin: 0 }}>
				Explore featured trap/dubstep/edm artists and tracks!
			</p>
			{store && (
				<>
					<ArtistHeatMap playlist={store.tracks} />
				</>
			)}
			<PreviewPlayer />
			<Element name='scrollToHere' />
			<PaginationWrapper>
				{store && (
					<Pagination
						setCurrentPage={setCurrentPage}
						currentPage={currentPage}
						postsPerPage={limit}
						totalPosts={total}
					/>
				)}
			</PaginationWrapper>
			<Cards details={details} />
			<PaginationWrapper>
				{store && (
					<Pagination
						setCurrentPage={setCurrentPage}
						currentPage={currentPage}
						postsPerPage={limit}
						totalPosts={total}
						isBottom={true}
					/>
				)}
			</PaginationWrapper>
		</FlexColumn>
	);
};

export default Home;
