import styled from 'styled-components';

const H1 = styled.h1`
	margin-bottom: 0;
	font-size: 48px;
	white-space: @media screen and (max-width: 768px) {
		font-size: 40px;
	}
	@media screen and (max-width: 480px) {
		font-size: 32px;
	}
`;

const H5 = styled.h5`
	margin-bottom: 0;
	white-space: nowrap;
`;
const P = styled.p`
	margin: 0;
	padding: 0;
`;

const Tag = styled.span`
	border-radius: 4px;
	background-color: #333;
	color: white;
	font-weight: 700;
	font-size: 10px;
	margin-right: 3px;
`;

const Typography = { H1, H5, P, Tag };
export default Typography;
