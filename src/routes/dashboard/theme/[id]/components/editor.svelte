<script lang="ts">
	import { MarkdownEditor, Carta } from 'carta-md';
	import 'carta-md/default.css';

	export let article: {
		id: number;
		title: string;
		content: string;
	};

	const carta = new Carta({});
	let value = article.content;

	// 监听内容变化，双向绑定
	$: article.content = value;
</script>

<div class="flex h-full flex-col">
	<MarkdownEditor bind:value {carta} />
</div>