import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import Typography from './Typography';
import Alert from './Alert';
const { H1 } = Typography;
export const HeroContent = styled.div`
	z-index: 3;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
`;

export const Checkmark = styled(IoIosCheckmarkCircle)`
	font-size: 24px;
`;

export const StatusMsg = styled.p`
	margin-top: 24px;
	color: #fff;
	font-size: 16px;
	text-align: center;
	max-width: 600px;
	background-color: green;
	border-radius: 8px;
	transition: 0.2s ease-in-out;
	@media screen and (max-width: 768px) {
		font-size: 24px;
	}
	@media screen and (max-width: 480px) {
		font-size: 18px;
	}
`;

export const StatusTextWrapper = styled.div`
	display: flex;
	align-items: center;
	padding: 5px 10px;
`;

export const StatusText = styled.span`
	font-size: 16px;
`;

export const HeroInput = styled.input`
	width: 100%;
	padding: 5px 10px;
`;

export const HeroButton = styled.button`
	width: 100%;
	background: #000;
	color: #fff;
	cursor: pointer;
	padding: 5px 10px;
`;
export const HeroH1 = styled.h1`
	color: #000;
	font-size: 48px;
	text-align: center;
	width: 100%;
	white-space: @media screen and (max-width: 768px) {
		font-size: 40px;
	}
	@media screen and (max-width: 480px) {
		font-size: 32px;
	}
`;

export const HeroTextArea = styled.textarea`
	width: 100%;
	padding: 5px 10px;
`;

export const HeroDiv = styled.div`
	width: 100%;
	margin-top: 24px;
	color: #fff;
	font-size: 24px;
	text-align: center;
	@media screen and (max-width: 768px) {
		font-size: 24px;
	}
	@media screen and (max-width: 480px) {
		font-size: 18px;
	}
`;

export const HeroBtnWrapper = styled.div`
	width: 100%;
	margin-top: 20px;
	margin-bottom: 60px;
`;

const Contact = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [statusMsg, setStatusMsg] = useState(null);

	const sendMessage = (e) => {
		e.preventDefault();
		Axios.post('/api/message', { name, email, message }).then((data) => {
			console.log({ data });
			setName('');
			setEmail('');
			setMessage('');
			setStatusMsg('Message sent successfully.');
			setTimeout(() => {
				setStatusMsg('I will get back to you soon!');
			}, 3000);
			setTimeout(() => {
				setStatusMsg(null);
			}, 6000);
		});
	};
	return (
		<HeroContent>
			<H1 style={{ textAlign: 'center' }}>Send a message!</H1>
			<Alert
				message={
					'Welcome! TrapNation Ent was built on Spotify. To get the most of this app (full songs, playlist functionality, ability to like/follow) you need to log-in to Spotify, on the top right...otherwise only 30 second previews are available. Your spotify authorization token will be stored as a cookie on your web browser. Sometimes you will need to refresh the app to reset functionality and/or sign out and back in. Still working out some bugs. When everything is working correctly you will see the song that is playing on the top right corner. Enjoy!'
				}
			/>
			{statusMsg && (
				<StatusMsg>
					<StatusTextWrapper>
						<Checkmark />
						&nbsp;
						<StatusText>{statusMsg}</StatusText>
					</StatusTextWrapper>
				</StatusMsg>
			)}

			<form onSubmit={sendMessage}>
				<HeroDiv>
					<HeroInput
						placeholder={'Name'}
						name={'name'}
						type={'text'}
						required={true}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</HeroDiv>
				<HeroDiv>
					<HeroInput
						placeholder={'Email'}
						name={'email'}
						type={'email'}
						required={true}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</HeroDiv>
				<HeroDiv>
					<HeroTextArea
						placeholder={'Message'}
						name={'message'}
						required={true}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</HeroDiv>
				<HeroBtnWrapper>
					<HeroButton theme={'dark'} type={'submit'}>
						Send Message
					</HeroButton>
				</HeroBtnWrapper>
			</form>
		</HeroContent>
	);
};

export default Contact;
