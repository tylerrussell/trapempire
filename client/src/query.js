export const urlParams = new URLSearchParams(window.location.search);

export const getParam = (param) => {
	return urlParams.get(param);
};
