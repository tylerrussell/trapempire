import React, { useContext } from 'react';
import styled from 'styled-components';
import Constants from '../Constants';
import { Link } from 'react-router-dom';
import { RiVipCrownFill } from 'react-icons/ri';
import ReactTypingEffect from 'react-typing-effect';
import { motion } from 'framer-motion';
import { NowPlaying } from '../components/SpotifyComponents';
import { SpotifyContext } from '../context/Spotify';
import { FlexColumn } from './Flex';
const Container = styled.nav`
	padding: 20px 10px;
	display: flex;
	flex-direction: row;
	position: fixed;
	background-color: ${Constants.colors.light1};
	align-items: center;
	border-bottom: 1px solid #ccc;
	z-index: 999;
	width: 100%;
`;
const Logo = styled(Link)`
	font-family: 'Roboto Slab', serif;
	font-size: 18px;
	font-weight: 600;
	color: ${Constants.colors.red};
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		text-decoration: none;
	}
`;
const Menu = styled.div`
	padding: 0;
	margin: 0;
	margin-left: auto;
	position: fixed;
	right: 25px;
`;

const LogoIcon = styled(RiVipCrownFill)`
	font-size: 24px;
	margin-left: 10px;
`;
const LogoText = styled.span`
	font-size: 24px;
	margin-left: 15px;
	// @media (max-width: 576px) {
	// 	font-size: 14px;
	// }
`;

const MotionDiv = styled(motion.div)``;

const Navbar = ({ setSidebarOpen, sidebarOpen }) => {
	const { isSmallScreen } = useContext(SpotifyContext);
	return (
		<Container id='navbar'>
			<FlexColumn>
				<>
					<MotionDiv whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
						<Logo to='/' onClick={() => setSidebarOpen(!sidebarOpen)}>
							<LogoIcon />
							<LogoText>
								<ReactTypingEffect
									text={[
										'TrapNation.com',
										'PremiumTrap.com',
										'TrapEmpire.com',
										'ThatTrapShit.com',
										// 'TrapXxx.com',
										// 'PositiveThots.com',
										'NativeEarthFestival.com',
										'LightNobility.com',
									]}
									speed={25}
									eraseSpeed={1}
									eraseDelay={10000}
									typingDelay={0}
								/>
							</LogoText>
						</Logo>
					</MotionDiv>
					<Menu className='navbar'>{!isSmallScreen && <NowPlaying />}</Menu>
				</>
				{isSmallScreen && (
					<div style={{ marginTop: '20px' }}>
						<NowPlaying />
					</div>
				)}
			</FlexColumn>
		</Container>
	);
};

export default Navbar;
