import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Provider } from '@supabase/supabase-js';

export const actions: Actions = {
	login: async ({ locals: { getSession, supabase }, url }) => {
		const session = await getSession();
		console.log(session);
		
		const provider = url.searchParams.get('provider') as Provider;
		if (session)
			if (provider) {
				const { error: err } = await supabase.auth.signInWithOAuth({
					provider: provider
				});
				if (err) {
					return fail(400, {
						message: 'Something went wrong'
					});
				}
				return redirect(303, '/protected/feed');
			}
	}
};
