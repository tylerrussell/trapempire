import React, { useState } from 'react';
import {
	HeroContainer,
	HeroBg,
	ImgBg,
	HeroContent,
	HeroH1,
	HeroP,
	HeroInput,
	HeroTextArea,
	HeroBtnWrapper,
	Checkmark,
	StatusMsg,
	StatusTextWrapper,
	StatusText,
} from './ContactElements';
import background from '../../images/nycbg.jpeg';
import { Button } from '../Button';
import Axios from 'axios';
const ContactSection = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [statusMsg, setStatusMsg] = useState(null);

	const sendMessage = (e) => {
		e.preventDefault();
		Axios.post('/tzapi/message', { name, email, message }).then((data) => {
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
		<HeroContainer id={'contact2'}>
			<HeroBg>
				<ImgBg src={background} />
			</HeroBg>
			<HeroContent>
				<HeroH1>Send me a message!</HeroH1>
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
					<HeroP>
						<HeroInput
							placeholder={'Name'}
							name={'name'}
							type={'text'}
							required={true}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</HeroP>
					<HeroP>
						<HeroInput
							placeholder={'Email'}
							name={'email'}
							type={'email'}
							required={true}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</HeroP>
					<HeroP>
						<HeroTextArea
							placeholder={'Message'}
							name={'message'}
							required={true}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</HeroP>
					<HeroBtnWrapper>
						<Button theme={'dark'} type={'submit'}>
							Send Message
						</Button>
					</HeroBtnWrapper>
				</form>
			</HeroContent>
		</HeroContainer>
	);
};

export default ContactSection;
