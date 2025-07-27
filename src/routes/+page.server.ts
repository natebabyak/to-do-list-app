import { getDb } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const todos = await getDb().collection('todos').find().toArray();

	return {
		todos: todos.map(({ _id, text, completed }) => ({
			_id: _id.toHexString(),
			text,
			completed
		}))
	};
};
