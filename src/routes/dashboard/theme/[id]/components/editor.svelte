<script lang="ts">
	import { MarkdownEditor, Carta } from 'carta-md';
	import 'carta-md/default.css';
	import DOMPurify from 'isomorphic-dompurify';

	export let article: {
		id: number;
		title: string;
		content: string;
	};

	let carta = new Carta({ sanitizer: DOMPurify.sanitize });
	let value = article.content;
	$: article.content = value;

	function handleSave() {
		// TODO: 实现保存逻辑
		alert('保存成功（示例）');
	}
</script>

<div class="flex h-full flex-col rounded-lg shadow-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
	<!-- 标题栏 -->
	<div class="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
		<span class="font-semibold text-base truncate">编辑文章：{article.title}</span>
		<div class="flex gap-2">
			<button class="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition" on:click={handleSave}>保存</button>
		</div>
	</div>
	<!-- 编辑器主体 -->
	<div class="flex-1 p-4 overflow-auto">
		<div
			class="w-full h-[60vh] min-h-[300px] max-h-[70vh] rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 shadow-lg focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200"
		>
			<div class="h-full w-full font-mono text-base focus:outline-none caret-blue-600 selection:bg-blue-100 dark:selection:bg-blue-900/40">
				<MarkdownEditor bind:value={value} {carta} />
			</div>
		</div>
	</div>
</div>

