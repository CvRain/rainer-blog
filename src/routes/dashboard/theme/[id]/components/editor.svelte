<script lang="ts">
	import { onMount } from 'svelte';
	import { code } from '@cartamd/plugin-code';
	import { MarkdownEditor, Carta } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';

	export let article: {
		id: number;
		title: string;
		content: string;
	};

	// 允许h1-h5标签，直接手动列出所有允许的标签
	const allowedTags = [
		'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'ul', 'ol', 'li', 'pre', 'code', 'blockquote', 'hr', 'br', 'img',
		'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div',
		'h1', 'h2', 'h3', 'h4', 'h5'
	];

	let carta: Carta | null = null;
	let value = article.content;
	let mounted = false;

	onMount(() => {
		carta = new Carta({
			sanitizer: (html: string) => DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags }),
			extensions: [
				code({
					theme: 'catppuccin-mocha'
				})
			]
		});
		mounted = true;
	});
	$: article.content = value;

	function handleSave() {
		alert('保存成功（示例）');
	}
</script>

<main class="h-full flex flex-col min-h-0">
	<!-- 标题栏 -->
	<div
		class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
	>
		<span class="truncate text-base font-semibold">编辑文章：{article.title}</span>
		<div class="flex gap-2">
			<button
				class="rounded bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700"
				on:click={handleSave}>保存</button
			>
		</div>
	</div>
	<!-- 编辑器主体 -->
	<div class="flex min-h-0 flex-1 flex-col h-full">
		<div class="h-full min-h-0 w-full flex-1">
			{#if mounted && carta}
				<MarkdownEditor bind:value={value} {carta} />
			{:else}
				<div>Loading editor...</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:global(.carta-editor),
	:global(.carta-wrapper),
	:global(.carta-container) {
		flex: 1 1 0%;
		min-height: 0;
	}
	:global(.carta-input-wrapper),
	:global(.carta-renderer) {
		min-height: 0;
		flex: 1 1 0%;
	}
	:global(.carta-md) {
		height: 100%;
	}
	:global(.carta-md .editor-content) {
		height: 100%;
	}
	:global(.carta-md .editor-toolbar) {
		border-bottom: 1px solid var(--border);
	}
	:global(.carta-md .editor-content) {
		flex-grow: 1;
	}
</style>
