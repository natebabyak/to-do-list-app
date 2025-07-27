<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';
	import {
		GithubIcon,
		MoonIcon,
		SquareCheckBigIcon,
		SquareIcon,
		SunIcon,
		Trash2Icon
	} from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { mode, toggleMode } from 'mode-watcher';
	import type { PageProps } from './$types';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	const { data }: PageProps = $props();

	let newTaskText = $state('');
	let todos = $state([...data.todos]);
	const numCompleted = $derived(todos.filter((t) => t.completed).length);
	const numTotal = $derived(todos.length);

	async function createTodo(event: SubmitEvent) {
		event.preventDefault();

		const response = await fetch('/api/todos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: newTaskText.trim() })
		});

		if (response.ok) {
			todos.push(await response.json());
			newTaskText = '';
		}
	}

	async function updateTodo(id: string) {
		const response = await fetch(`/api/todos/${id}`, {
			method: 'PATCH'
		});

		if (response.ok) {
			todos.find((t) => t._id === id)!.completed = !todos.find((t) => t._id === id)!.completed;
		}
	}

	async function deleteTodo(id: string) {
		const response = await fetch(`/api/todos/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			todos = todos.filter((t) => t._id !== id);
		}
	}

	async function deleteAllTodos() {
		const response = await fetch(`/api/todos`, {
			method: 'DELETE'
		});

		if (response.ok) {
			todos = [];
		}
	}
</script>

<svelte:head>
	<title>To Do List</title>
	<meta
		name="description"
		content="Stay organized and boost productivity with our simple and intuitive todo list app. Create, manage, and track your tasks with ease anytime, anywhere."
	/>
</svelte:head>

<header class="fixed z-10 flex w-full items-center justify-between p-2 backdrop-blur-sm md:p-4">
	<h1 class="text-3xl font-medium">To Do List</h1>
	<div class="flex items-center">
		<Button href="https://github.com/natebabyak/to-do-list-app" size="icon" variant="ghost">
			<GithubIcon />
		</Button>
		<Button onclick={toggleMode} size="icon" variant="ghost">
			{#if !mode.current}
				<Skeleton class="size-4 rounded-full" />
			{:else if mode.current === 'dark'}
				<MoonIcon />
			{:else}
				<SunIcon />
			{/if}
		</Button>
	</div>
</header>
<main
	class="mx-auto grid w-full gap-2 pt-[52px] pb-2 md:w-4/5 md:gap-4 md:pt-[68px] md:pb-4 lg:w-1/2"
>
	<div class="flex items-center gap-2 px-2 md:gap-4 md:px-0">
		<p>{numCompleted}/{numTotal} Completed</p>
		<Button
			role="button"
			aria-label="Clear all tasks"
			disabled={!numTotal}
			onclick={deleteAllTodos}
			variant="destructive"
		>
			<Trash2Icon />
			<p>Clear all tasks</p>
		</Button>
	</div>
	{#if !numTotal}
		<p class="text-center text-muted-foreground">No tasks available</p>
	{:else}
		<Table.Root>
			<Table.Body>
				{#each todos as { _id, text, completed }}
					<Table.Row>
						<Table.Cell class="w-full">
							<Button onclick={() => updateTodo(_id)} variant="ghost" class="w-full justify-start">
								{#if completed}
									<SquareCheckBigIcon />
								{:else}
									<SquareIcon />
								{/if}
								<p class={cn(completed && 'text-muted-foreground line-through')}>{text}</p>
							</Button>
						</Table.Cell>
						<Table.Cell>
							<Button
								title="Delete todo"
								role="button"
								onclick={() => deleteTodo(_id)}
								size="icon"
								variant="ghost"
							>
								<Trash2Icon />
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
	<form onsubmit={createTodo} class="flex items-center gap-2 px-2 md:gap-4 md:px-0">
		<Input placeholder="Add a new task..." type="text" bind:value={newTaskText} />
		<Button disabled={!newTaskText.trim()} type="submit">Add task</Button>
	</form>
</main>
