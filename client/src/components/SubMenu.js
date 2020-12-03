import React from 'react';
import styled from 'styled-components';
import Constants from '../Constants';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { ControlButton } from './Button';
import { LoginRefreshButton } from './SpotifyComponents';

const Container = styled.div`
	padding: 20px 10px;
	display: flex;
	flex-direction: row;
	background-color: ${Constants.colors.light1};
	align-items: center;
`;

export const Back = () => {
	let history = useHistory();
	return (
		<>
			<ControlButton onClick={() => history.goBack()}>
				<FiArrowLeft />
			</ControlButton>
		</>
	);
};
export const Forward = () => {
	let history = useHistory();
	return (
		<>
			<ControlButton onClick={() => history.goForward()}>
				<FiArrowRight />
			</ControlButton>
		</>
	);
};

const SubMenu = () => {
	//const { isSmallScreen } = useContext(SpotifyContext);

	return (
		<Container className='subMenu'>
			{/* {!isSmallScreen && <LoginRefreshButton />} */}
			<LoginRefreshButton />
			<div style={{ marginLeft: 'auto' }}>
				<Back />
				<Forward />
			</div>
		</Container>
	);
};

export default SubMenu;
