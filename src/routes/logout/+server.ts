import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	const { error: err } = await locals.supabase.auth.signOut();
	if (err) {
		throw error(500, 'something went wrong logging you out.');
	}
	throw redirect(303, '/');
};
