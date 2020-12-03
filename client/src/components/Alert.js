import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import Constants from '../Constants';

const AlertContainer = styled.div`
	margin: 15px;
`;
const AlertElem = styled.div`
	background-color: white;
	border-radius: 7px;
	border: 1px solid #ccc;
	padding: 10px;
	display: flex;
	width: 100%;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
`;
const Message = styled.div`
	margin-right: auto;
	display: flex;
	align-items: center;
`;

const CloseBtn = styled.button`
	padding: 3px;
	border: 0;
	border-radius: 7px;
	background-color: white;
	outline: none;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${Constants.colors.red};
	&:hover {
		background-color: ${Constants.colors.red};
		color: white;
	}
`;

const CloseBtnIcon = styled(AiOutlineCloseSquare)`
	font-size: 22px;
	padding: 0;
	margin: 0;
`;

const Alert = ({ show = true, message, callback, ...rest }) => {
	const [visible, setVisible] = useState(show);
	const onClick = () => {
		setVisible(false);
		if (callback) {
			callback();
		}
	};
	return (
		visible && (
			<AlertContainer>
				<Row>
					<AlertElem {...rest}>
						<Message>{message}</Message>
						<CloseBtn onClick={onClick}>
							<CloseBtnIcon />
						</CloseBtn>
					</AlertElem>
				</Row>
			</AlertContainer>
		)
	);
};

export default Alert;
