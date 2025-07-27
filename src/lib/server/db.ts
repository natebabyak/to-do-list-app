import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

let client: MongoClient | null = null;

export function getClient() {
	if (!client) {
		if (!env.MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined');
		}
		client = new MongoClient(env.MONGODB_URI);
	}
	return client;
}

export function getDb() {
	return getClient().db('todo-list-db');
}
