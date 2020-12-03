import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Constants from '../Constants';
import { Link } from 'react-router-dom';
import { AiTwotoneHome } from 'react-icons/ai';
import { BiMessageRoundedEdit } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { RiFileMusicFill } from 'react-icons/ri';
import { IoIosRadio } from 'react-icons/io';
import ReactTooltip from 'react-tooltip';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Contact from './Contact';
import { ControlButton } from './Button';

const Container = styled.div`
	z-index: 99999;
	position: fixed;
	width: 80px;
	height: 100vh;
	min-width: 80px;
	max-width: 80px;
	top: 0;
	left: 0;
	background-color: ${Constants.colors.dark};
`;
const HomeIcon = styled(AiTwotoneHome)`
	color: white;
	font-size: 24px;
`;
const ContactIcon = styled(BiMessageRoundedEdit)`
	color: white;
	font-size: 24px;
`;
const MusicIcon = styled(RiFileMusicFill)`
	color: white;
	font-size: 24px;
`;
const SearchIcon = styled(BsSearch)`
	color: white;
	font-size: 24px;
`;
const RadioIcon = styled(IoIosRadio)`
	color: white;
	font-size: 24px;
`;
const HiddenButton = styled.button`
	cursor: pointer;
	padding: 0;
	margin: 0;
	margin-top: -5px;
	width: 100%;
	background-color: ${Constants.colors.dark};
	border: 0;
	outline: none;
`;

const sideBarMenu = [
	{
		linkTo: '/search',
		name: 'menu-search',
		title: 'Search',
		icon: <SearchIcon />,
	},
	{
		linkTo: '/',
		name: 'menu-home',
		title: 'Featured Tracks',
		icon: <HomeIcon />,
	},
	{
		linkTo: '/radio',
		name: 'menu-radio',
		title: 'Radio',
		icon: <RadioIcon />,
	},
	{
		linkTo: '/trap',
		name: 'menu-featured',
		title: 'Featured Playlists',
		icon: <MusicIcon />,
	},
];

const SidebarItem = ({ item }) => {
	return (
		<>
			<motion.div
				className='sidebarItem'
				whileHover={{ scale: 0.8, rotate: 360 }}
				whileTap={{ scale: 0.6, rotate: 0, borderRadius: '100%' }}
				data-tip
				data-for={item.name}
			>
				<motion.div
					whileHover={{ scale: 1.8 }}
					whileTap={{ scale: 0.9, borderRadius: '100%' }}
				>
					{item.icon}
				</motion.div>
			</motion.div>
			<ReactTooltip place='right' id={item.name} effect='solid'>
				<span>{item.title}</span>
			</ReactTooltip>
		</>
	);
};

const Sidebar = () => {
	return (
		<Container>
			{sideBarMenu.map((item, index) => {
				return (
					<Link key={`sidebar-item-${index}`} to={item.linkTo}>
						<SidebarItem item={item} />
					</Link>
				);
			})}

			<Popup
				modal={true}
				style={{ borderRadius: '8px' }}
				trigger={
					<HiddenButton>
						<SidebarItem
							item={{
								name: 'menu-contact',
								title: 'Info and Contact',
								icon: <ContactIcon />,
							}}
						/>
					</HiddenButton>
				}
			>
				{(close) => (
					<>
						<Contact />
						<div style={{ position: 'absolute', top: '0', right: '0' }}>
							<ControlButton onClick={close}>&times;</ControlButton>
						</div>
					</>
				)}
			</Popup>
		</Container>
	);
};

export default Sidebar;
