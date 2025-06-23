<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Bold, Italic, List, ListOrdered } from 'lucide-svelte';

	export let article: {
		id: number;
		title: string;
		content: string;
	};

	let content = article.content;

	function insertMarkdown(markdown: string) {
		// TODO: 在光标位置插入Markdown语法
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		content = target.value;
		article.content = content;
	}
</script>

<div class="flex h-full flex-col">
	<div class="flex items-center gap-2 border-b p-2">
		<Button variant="ghost" size="icon" on:click={() => insertMarkdown('**粗体**')}>
			<Bold class="h-4 w-4" />
		</Button>
		<Button variant="ghost" size="icon" on:click={() => insertMarkdown('*斜体*')}>
			<Italic class="h-4 w-4" />
		</Button>
		<Button variant="ghost" size="icon" on:click={() => insertMarkdown('\n- 列表项\n')}>
			<List class="h-4 w-4" />
		</Button>
		<Button variant="ghost" size="icon" on:click={() => insertMarkdown('\n1. 有序列表\n')}>
			<ListOrdered class="h-4 w-4" />
		</Button>
	</div>
	<ScrollArea class="flex-1">
		<textarea
			class="h-full w-full resize-none border-0 bg-background p-4 font-mono focus:outline-none"
			value={content}
			on:input={handleInput}
		/>
	</ScrollArea>
</div>