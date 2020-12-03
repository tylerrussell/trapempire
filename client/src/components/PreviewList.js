import React, { useState, useEffect } from 'react';
import { ControlButton } from './Button';

const PreviewList = ({ listChildren, previewQuantity = 5 }) => {
	const [expanded, setExpanded] = useState(false);
	const [children, setChildren] = useState(false);
	useEffect(() => {
		if (!expanded) {
			let clone = [...listChildren];
			setChildren(clone.splice(0, previewQuantity));
		} else {
			setChildren(listChildren);
		}
	}, [expanded, listChildren, previewQuantity]);
	return (
		<>
			{children}
			{!expanded && listChildren.length > previewQuantity && (
				<>
					<br />
					<ControlButton
						style={{ textTransform: 'none', marginTop: '20px' }}
						onClick={() => setExpanded(true)}
					>
						View More
					</ControlButton>
				</>
			)}
		</>
	);
};

export default PreviewList;
