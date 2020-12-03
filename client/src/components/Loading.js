import React from "react";
import styled from "styled-components";
import { CgSpinnerAlt } from "react-icons/cg";

const Container = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
`;
const InnerContainer = styled.div`
	text-align: center;
	font-size: 12px;
`;
const IconSpinner = styled(CgSpinnerAlt)`
	-webkit-animation: icon-spin 2s infinite linear;
	animation: icon-spin 2s infinite linear;
	font-size: 27px;
	@-webkit-keyframes icon-spin {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(359deg);
			transform: rotate(359deg);
		}
	}

	@keyframes icon-spin {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(359deg);
			transform: rotate(359deg);
		}
	}
`;
const Loading = () => {
	return (
		<Container>
			<InnerContainer>
				<IconSpinner />
				<br />
				Loading
			</InnerContainer>
		</Container>
	);
};

export default Loading;
