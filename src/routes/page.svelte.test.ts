import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page, { data: { todos: [] }, params: {}, form: null });

		const heading = page.getByRole('heading', { level: 1 });

		// Assert that the heading is in the document
		expect(heading).toBeInTheDocument();

		// Assert that the heading is visible
		expect(heading).toBeVisible();

		// Assert that the heading has the correct text
		expect(heading).toHaveTextContent('To Do List');
	});
});
