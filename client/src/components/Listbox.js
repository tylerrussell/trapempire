import React from "react";

const Listbox = props => {
	// const clicked = e => {
	// 	e.preventDefault();
	// };
	return (
		<div>
			{props.items.map((item, index) => {
				return (
					<button
						// onClick={onClick}
						key={`list-box-item-${index}`}
						id={item.track.id}
					>
						{item.track.name}
					</button>
				);
			})}
		</div>
	);
};

export default Listbox;
