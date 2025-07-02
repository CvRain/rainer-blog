<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	export let article: {
		id: number;
		title: string;
		content: string;
	};

	$: safeHtml = DOMPurify.sanitize(marked.parse(article.content));
</script>

<div class="flex h-full flex-col border-t">
	<div class="flex items-center border-b p-2">
		<h2 class="text-sm font-semibold">预览</h2>
	</div>
	<ScrollArea class="flex-1">
		<div class="prose prose-sm dark:prose-invert max-w-none p-4">
			{@html safeHtml}
		</div>
	</ScrollArea>
</div>