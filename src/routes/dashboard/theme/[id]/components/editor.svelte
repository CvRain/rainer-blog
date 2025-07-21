<script lang="ts">
import { MarkdownEditor, Carta } from 'carta-md';
import 'carta-md/default.css';
import { emoji } from '@cartamd/plugin-emoji';
import { slash } from '@cartamd/plugin-slash';
import { code } from '@cartamd/plugin-code';
import type { ApiArticleDetail } from '@/api/response_schema';
import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
import { createEventDispatcher, onMount } from 'svelte';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import MarkdownPreview from '@/components/theme-editor/markdown-preview.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import { Eye, Pencil } from 'lucide-svelte';
	import { Root as ScrollArea } from '$lib/components/ui/scroll-area/index';

export let articleDetail: ApiArticleDetail;
const dispatch = createEventDispatcher<{ save: ApiArticleDetail }>();

let carta: Carta | null = null;
let mounted = false;
let value: string = articleDetail.s3_content ?? '';
let showAlert = false;
let alertMsg = '';
	let alertType: 'success' | 'error' = 'success';
let alertTimeout: any = null;
	let mode: 'edit' | 'preview' = 'edit';

	function showGlobalAlert(msg: string, type: 'success' | 'error' = 'success') {
  alertMsg = msg;
  alertType = type;
  showAlert = true;
  if (alertTimeout) clearTimeout(alertTimeout);
		alertTimeout = setTimeout(() => (showAlert = false), 3000);
}

$: if (articleDetail && value !== articleDetail.s3_content) {
  value = articleDetail.s3_content ?? '';
}

onMount(() => {
  carta = new Carta({
    sanitizer: false,
    extensions: [emoji(), slash(), code()],
    shikiOptions: {
      themes: ['catppuccin-latte', 'catppuccin-mocha']
    }
  });
  mounted = true;
});

function handleSave() {
  dispatch('save', { ...articleDetail, s3_content: value });
  showGlobalAlert('保存请求已发送', 'success');
}
</script>

{#if showAlert}
	<div class="fixed left-1/2 top-4 z-50 w-full max-w-md -translate-x-1/2">
    <Alert variant={alertType === 'success' ? 'default' : 'destructive'}>
      <AlertTitle>{alertType === 'success' ? '操作成功' : '操作失败'}</AlertTitle>
      <AlertDescription>{alertMsg}</AlertDescription>
    </Alert>
  </div>
{/if}
<main class="flex h-full min-h-0 flex-col">
  <!-- 标题栏 -->
  <div
    class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
  >
    <span class="truncate text-base font-semibold">编辑文章：{articleDetail.title}</span>
		<div class="flex items-center gap-2 ml-auto">
			<Button
				variant={mode === 'edit' ? 'secondary' : 'ghost'}
				size="icon"
				aria-label={mode === 'edit' ? '切换到预览' : '切换到编辑'}
				class="transition"
				onclick={() => mode = mode === 'edit' ? 'preview' : 'edit'}
			>
				{#if mode === 'edit'}
					<Eye class="w-5 h-5" />
				{:else}
					<Pencil class="w-5 h-5" />
				{/if}
			</Button>
			<Button class="rounded bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700" onclick={handleSave}>保存</Button>
    </div>
  </div>

  <!-- 编辑器主体 -->
	<div class="flex-1 min-h-0 flex flex-col bg-background dark:bg-zinc-900 rounded-b-2xl" style="height:calc(100vh-56px-64px);">
		{#if mode === 'edit'}
			<Textarea bind:value class="h-full w-full min-h-[200px] max-h-full rounded-md border border-input bg-white dark:bg-zinc-900 p-4 shadow-sm" placeholder="请输入Markdown内容..." />
      {:else}
			<ScrollArea class="h-full w-full min-h-[200px] max-h-full rounded-md border border-input bg-white dark:bg-zinc-900 p-4 shadow-sm overflow-y-auto isolation-isolate">
				<MarkdownPreview markdownText={value} />
			</ScrollArea>
      {/if}
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
