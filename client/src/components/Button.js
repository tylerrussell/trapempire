import React from 'react';
import styled from 'styled-components';
import Constants from '../Constants';

const ButtonElem = styled.button`
	padding: 10px;
	width: 200px;
	cursor: pointer;
	color: white;
	border: 0;
	border-top: 1px dotted white;
	outline: none;
	background-color: ${Constants.colors.red};
	&:hover {
		color: ${Constants.colors.red};
		background-color: white;
	}
`;

export const Button = (props) => {
	return <ButtonElem {...props} />;
};

export const CallToAction = styled.button`
	border-radius: 8px;
	padding: 5px 10px;
	outline: none;
	border: 1px solid #ccc;
	cursor: pointer;
	color: ${Constants.colors.red};
	background-color: white;
	&:hover {
		background-color: ${Constants.colors.red};
		color: white;
	}
`;

export const CallToActionLink = styled.a`
	border-radius: 8px;
	padding: 5px 10px;
	outline: none;
	border: 1px solid ${Constants.colors.red};
	cursor: pointer;
	color: ${Constants.colors.red};
	&:hover {
		background-color: ${Constants.colors.red};
		color: white;
	}
`;

export const ControlButton = styled.button`
	border: 1px solid #ccc;
	border-radius: 8px;
	padding: 2px 10px;
	cursor: pointer;
	outline: none;
	font-size: 16px;
	font-weight: 600;
	text-transform: uppercase;
	background-color: ${({ active }) =>
		active ? Constants.colors.red : 'white'};
	color: ${({ active }) => (active ? 'white' : Constants.colors.red)};
	&:hover {
		background-color: ${Constants.colors.red};
		color: white;
	}
`;
