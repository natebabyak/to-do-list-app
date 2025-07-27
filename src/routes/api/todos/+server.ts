import { getDb } from '$lib/server/db';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * Create a new todo item.
 * @param request The request object containing the JSON body with the new todo text.
 * @returns The created todo item with its ID and other properties.
 * @throws 400 if the text is empty or not provided.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { text } = await request.json();

	if (text === undefined) error(400, 'Text is required');

	if (text.trim() === '') error(400, 'Text cannot be empty');

	const todo = {
		text: text.trim(),
		completed: false
	};

	const result = await getDb().collection('todos').insertOne(todo);

	return json({ _id: result.insertedId, ...todo }, { status: 201 });
};

/**
 * Delete all todo items.
 * @returns A response with a 204 status code if the deletion is successful.
 * @throws 500 if the deletion fails.
 */
export const DELETE: RequestHandler = async () => {
	await getDb().collection('todos').deleteMany({});

	const arr = await getDb().collection('todos').find().toArray();

	if (arr.length !== 0) error(500, 'Failed to delete all todos');

	return new Response(null, { status: 204 });
};
