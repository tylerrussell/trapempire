import styled from 'styled-components';
import { IoIosCheckmarkCircle } from 'react-icons/io';

export const HeroContainer = styled.div`
	background: #0c0c0c;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 30px;
	height: 800px;
	position: relative;
	z-index: 1;

	:before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(
				180deg,
				rgba(0, 0, 0, 0.2) 0%,
				rgba(0, 0, 0, 0.6) 100%
			),
			linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
		z-index: 2;
	}
`;

export const HeroBg = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
`;

export const HeroInput = styled.input`
	width: 350px;
`;

export const HeroButton = styled.input`
	width: 350px;
	background: #000;
	color: #fff;
	cursor: pointer;
`;

export const HeroTextArea = styled.textarea`
	width: 350px;
`;

export const VideoBg = styled.video`
	width: 100%;
	height: 100%;
	-o-object-fit: cover;
	object-fit: cover;
	background: #232a34;
`;

export const ImgBg = styled.img`
	width: 100%;
	height: 100%;
	-o-object-fit: cover;
	object-fit: cover;
	background: #232a34;
`;

export const HeroContent = styled.div`
	z-index: 3;
	max-width: 1200px;
	position: absolute;
	padding: 8px 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const HeroH1 = styled.h1`
	color: #fff;
	font-size: 48px;
	text-align: center;
	@media screen and (max-width: 768px) {
		font-size: 40px;
	}
	@media screen and (max-width: 480px) {
		font-size: 32px;
	}
`;

export const HeroP = styled.p`
	margin-top: 24px;
	color: #fff;
	font-size: 24px;
	text-align: center;
	max-width: 600px;
	@media screen and (max-width: 768px) {
		font-size: 24px;
	}
	@media screen and (max-width: 480px) {
		font-size: 18px;
	}
`;

export const HeroBtnWrapper = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
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
