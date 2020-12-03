import React from 'react';
import styled from 'styled-components';
import Constants from '../Constants';

const Select = styled.select`
	padding: 10px;
	width: 200px;
	cursor: pointer;
	color: white;
	border: 0;
	outline: none;
	background-color: ${Constants.colors.red};
	&:hover {
		color: ${Constants.colors.red};
		background-color: white;
	}
`;
const Dropdown = (props) => {
	const dropdownChanged = (e) => {
		props.changed(e.target.value);
	};
	return (
		<div>
			<Select value={props.selectedValue} onChange={dropdownChanged}>
				<option value='' disabled>
					{props.placeholder}
				</option>
				{props.options.map((item, index) => (
					<option key={`${props.name}-option-${index}`} value={item.id}>
						{item.name}
					</option>
				))}
			</Select>
		</div>
	);
};

export default Dropdown;
