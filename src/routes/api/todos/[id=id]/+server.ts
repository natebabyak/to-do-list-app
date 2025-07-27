import { getDb } from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

/**
 * Toggle the completion status of a todo item by its ID.
 * @param params The parameters containing the ID of the todo item to toggle.
 * @returns A response with a 204 status code if the operation is successful.
 * @throws 400 if the ID is not provided or is not a valid ObjectId.
 * @throws 404 if the todo item with the specified ID does not exist.
 */
export const PATCH: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (id === undefined) error(400, 'ID is required');

	if (!ObjectId.isValid(id)) error(400, 'ID is not a valid ObjectId');

	const result = await getDb()
		.collection('todos')
		.updateOne({ _id: new ObjectId(params.id) }, [{ $set: { completed: { $not: '$completed' } } }]);

	if (!result) error(404, 'Todo not found');

	return new Response(null, { status: 204 });
};

/**
 * Delete a todo item by its ID.
 * @param params The parameters containing the ID of the todo item to delete.
 * @returns A response with a 204 status code if the deletion is successful.
 * @throws 400 if the ID is not provided or is not a valid ObjectId.
 * @throws 404 if the todo item with the specified ID does not exist.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (id === undefined) error(400, 'ID is required');

	if (!ObjectId.isValid(id)) error(400, 'ID is not a valid ObjectId');

	const result = await getDb()
		.collection('todos')
		.deleteOne({ _id: new ObjectId(params.id) });

	if (result.deletedCount === 0) error(404, 'Todo not found');

	return new Response(null, { status: 204 });
};
