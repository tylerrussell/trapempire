import React from 'react';
import styled from 'styled-components';
import Constants from '../Constants';

const Container = styled.div`
	padding: 20px 10px;
	display: flex;
	flex-direction: row;
	background-color: ${Constants.colors.red};
	font-size: 10px;
	justify-content: center;
	align-items: center;
`;

const Footer = () => {
	return (
		<Container>
			{Constants.footer.copyText} &nbsp;
			<a href={Constants.footer.linkHref}>{Constants.footer.linkText}</a>
		</Container>
	);
};

export default Footer;
