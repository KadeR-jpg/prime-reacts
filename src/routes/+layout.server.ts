import type { PageServerLoad } from './login/$types';

export const load: PageServerLoad = async (event) => {
	return {
		session: await event.locals.getSession()
	};
};
