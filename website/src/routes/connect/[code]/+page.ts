import type { PageLoad } from './$types';

export const load: PageLoad = (req) => {
	return {
		code: req.params.code,
		uuid: req.url.searchParams.get('uuid')
	};
};
