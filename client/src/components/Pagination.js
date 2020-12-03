import React from 'react';
import styled from 'styled-components';
import Constants from '../Constants';
import { scroller } from 'react-scroll';

const PaginationUL = styled.ul`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	list-style-type: none;
	padding: 0;
	margin: 0;
`;
const PaginationLI = styled.li`
	margin: 2px;
	outline: none;
	padding: 0px;
`;
const PaginationLink = styled.button`
	border: 1px solid black;
	border-radius: 8px;
	padding: 3px 10px;
	cursor: pointer;
	outline: none;
	font-size: 12px;
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
const Pagination = ({
	postsPerPage,
	totalPosts,
	currentPage,
	setCurrentPage,
	isBottom = false,
}) => {
	const pageNumbers = [];
	const totalPages = Math.ceil(totalPosts / postsPerPage);
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}
	const onClick = () => {
		isBottom &&
			scroller.scrollTo('scrollToHere', {
				duration: 1500,
				delay: 100,
				smooth: true,
				//containerId: 'ContainerElementID',
				offset: -50, // Scrolls to element + 50 pixels down the page
			});
	};
	return (
		<nav>
			<PaginationUL>
				{currentPage && currentPage > 1 && (
					<PaginationLI onClick={onClick}>
						<PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
							previous
						</PaginationLink>
					</PaginationLI>
				)}
				{pageNumbers.map((number) => (
					<PaginationLI
						onClick={onClick}
						active={currentPage === number}
						key={number}
					>
						<PaginationLink
							active={currentPage === number}
							onClick={() => setCurrentPage(number)}
						>
							{number}
						</PaginationLink>
					</PaginationLI>
				))}
				{currentPage && currentPage < totalPages && (
					<PaginationLI onClick={onClick}>
						<PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
							next
						</PaginationLink>
					</PaginationLI>
				)}
			</PaginationUL>
		</nav>
	);
};

export default Pagination;
