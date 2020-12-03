import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ControlButton } from '../components/Button';
import { FlexColumn } from '../components/Flex';
import Loading from '../components/Loading';
import {
	ArtistLink,
	GridContainer,
	PreviewPlayer,
} from '../components/SpotifyComponents';
import TrackList from '../components/TrackList';
import Typography from '../components/Typography';
import { SpotifyContext } from '../context/Spotify';
import styled from 'styled-components';
const Input = styled.input`
	font-size: 20px;
	width: 50px;
`;
const { H1 } = Typography;
const Radio = () => {
	document.title = `TrapNation.com Radio`;
	const [data, setData] = useState(null);
	const [_uris, _setUris] = useState([]); //temp storage until played
	const {
		radioPlaylist,
		setRadioPlaylist,
		radioSettingsState,
		setRadioSettings,
		loading,
		setLoading,
	} = useContext(SpotifyContext);

	const getData = (randomize = true) => {
		setLoading(true);
		Axios.get(
			'/spotify/random' +
				`?target_danceability=${radioSettingsState.target_danceability / 100}` +
				`&target_energy=${radioSettingsState.target_energy / 100}` +
				// `&target_popularity=${radioSettingsState.target_popularity}` +
				`&randomize=${randomize}` +
				`&quantity=${radioSettingsState.quantity}`
		)
			.then((res) => {
				const { tracks, uris } = res.data;
				localStorage.setItem(
					'trapnation-radio-playlist',
					JSON.stringify({ tracks, uris })
				);

				setRadioPlaylist(tracks);
				_setUris(uris);
				setData(res.data);
				setLoading(false);
			})
			.catch((e) => console.log(e));
	};

	useEffect(() => {
		if (radioPlaylist === null) {
			let cache = localStorage.getItem('trapnation-radio-playlist');
			if (cache === null) {
				getData(true);
			} else {
				cache = JSON.parse(cache);
				let { tracks, uris } = cache;
				setRadioPlaylist(tracks);
				_setUris(uris);
				setData({ tracks, uris });
				setLoading(false);
			}
		} else {
			setData(true);
		}
	}, [radioPlaylist]);

	const processStateChange = (key, value, min, max) => {
		if (value < min) {
			value = min;
		} else if (value > max) {
			value = max;
		}
		setRadioSettings((prevState) => {
			return {
				...prevState,
				[key]: value,
			};
		});
	};

	const ParameterInput = ({ title, name, value, min, max }) => {
		return (
			<tr>
				<td>
					<b>{title}</b>:
				</td>
				<td>
					<Input
						type='number'
						// step='1'
						value={value}
						min={min}
						max={max}
						onChange={(e) => processStateChange(name, e.target.value, min, max)}
					/>
				</td>
			</tr>
		);
	};

	return loading || !data ? (
		<Loading />
	) : (
		<FlexColumn>
			<GridContainer>
				<div>
					<H1>Radio</H1>
					<hr />
					Generate a new random playlist:
					<br />
					<br />
					<ControlButton
						onClick={() => getData(false)}
						style={{ textTransform: 'none', fontWeight: 'normal' }}
					>
						Certified Bangers Only
					</ControlButton>
					<br />
					<br />
					Or use Spotify's help (values 0 to 100):
					<br />
					<br />
					<table>
						<tbody>
							{/* <ParameterInput
								title={'Target Popularity'}
								name={'target_popularity'}
								value={radioSettingsState.target_popularity}
							/> */}
							<ParameterInput
								title={'Target Energy'}
								name={'target_energy'}
								min={0}
								max={100}
								value={radioSettingsState.target_energy}
							/>
							<ParameterInput
								title={'Target Danceability'}
								name={'target_danceability'}
								min={0}
								max={100}
								value={radioSettingsState.target_danceability}
							/>
							<ParameterInput
								title={'Quantity'}
								name={'quantity'}
								min={10}
								max={100}
								value={radioSettingsState.quantity}
							/>
						</tbody>
					</table>
					<br />
					<ControlButton
						onClick={() => getData(true)}
						style={{ textTransform: 'none', fontWeight: 'normal' }}
					>
						Include Recommendations
					</ControlButton>
					<br />
					<hr />
				</div>
				<div>
					{radioPlaylist && <TrackList playlist={radioPlaylist} uris={_uris} />}
				</div>

				<div>
					<PreviewPlayer />
				</div>
				{/* {randomTrack && (
				<div>
					<div>
						<H1 style={{ display: 'inline-block' }}>
							{randomTrack.track.name}
						</H1>
						<br />
						<p style={{ padding: 0, margin: 0, marginBottom: 5 }}>
							by&nbsp;
							{randomTrack.track.artists.map((artist, index) => [
								index > 0 && <span key={`spacer-${index}`}>,&nbsp;</span>,
								<ArtistLink key={`artist-${index}`} artist={artist} />,
							])}
						</p>
					</div>
					<img
						style={{ maxHeight: 640, maxWidth: 640 }}
						src={randomTrack.track.album.images[0].url}
						alt={randomTrack.track.name}
					/>
				</div>
			)} */}
			</GridContainer>
		</FlexColumn>
	);
};

export default Radio;
