import React, { useContext } from 'react';
import { SpotifyContext } from '../context/Spotify';
import { loginUrl } from '../context/Spotify/SpotifyConfig';
import TimeAgo from 'react-timeago';
import styled from 'styled-components';
import Typography from '../components/Typography';
import { ControlButton } from '../components/Button';

const { H1 } = Typography;
const TextArea = styled.textarea`
	width: 100%;
	height: 35px;
`;
const Login = () => {
	const { credentials, logout, refreshAuthToken } = useContext(SpotifyContext);
	document.title = credentials.loggedIn
		? 'Logged In to Spotify'
		: 'Log In via Spotify';
	return (
		<div>
			{!credentials.loggedIn ? (
				<a href={loginUrl}>Sign In</a>
			) : (
				<ControlButton
					style={{ textTransform: 'none', fontWeight: 'normal' }}
					onClick={logout}
				>
					Sign Out
				</ControlButton>
			)}
			<br />
			{credentials.loggedIn && (
				<>
					<H1>Spotify Credentials</H1>
					<p>
						You need to refresh the access token every hour. Click the button
						below to refresh the token.
					</p>
					<br />
					<b>Access token</b>: <br />
					<TextArea defaultValue={credentials.access_token} /> <br />
					<b>Expires</b>:&nbsp;
					<TimeAgo date={credentials.expires} />
					&nbsp;
					<ControlButton
						style={{ textTransform: 'none', fontWeight: 'normal' }}
						onClick={refreshAuthToken}
					>
						Refresh Access Token
					</ControlButton>
					<br />
					<b>Refresh token</b>: <br />
					<TextArea defaultValue={credentials.refresh_token} />
				</>
			)}
		</div>
	);
};

export default Login;
