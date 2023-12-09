export const isHeadless = () => {
	return process.env.DEV_HEADLESS?.toLowerCase() === 'true';
};

export const parseJson = (data: string): any | null => {
	try {
		return JSON.parse(data);
	} catch (err) {
		return null;
	}
};
