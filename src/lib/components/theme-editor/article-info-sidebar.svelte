<script lang="ts">
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Separator } from '$lib/components/ui/separator';
  import { Button } from '$lib/components/ui/button';
  import { Info, Clock, Tag, FileText } from 'lucide-svelte';
  import { Switch } from '$lib/components/ui/switch';
  import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
  import type { ApiArticleDetail } from '@/api/response_schema';

  export let articleDetail: ApiArticleDetail;
  let showAlert = false;
  let alertMsg = '';
  let alertType: 'success' | 'error' = 'success';
  let alertTimeout: any = null;

  function showGlobalAlert(msg: string, type: 'success' | 'error' = 'success') {
    alertMsg = msg;
    alertType = type;
    showAlert = true;
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => (showAlert = false), 3000);
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

<div class="right-sidebar ml-2 flex w-1/5 min-w-[280px] max-w-sm flex-col gap-4 rounded-xl border-l border-zinc-200 bg-white/90 p-4 shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-900/90">
  <ScrollArea class="h-full">
    {#if articleDetail}
      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <Info class="h-5 w-5 text-blue-500" />
          <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100">文章详情</h2>
        </div>
        <div class="space-y-4">
          <div>
            <label for="article-title" class="text-sm font-medium text-zinc-600 dark:text-zinc-400">标题</label>
            <p id="article-title" class="mt-1 text-sm text-zinc-800 dark:text-zinc-200">{articleDetail.title}</p>
          </div>
          <div>
            <label for="article-id" class="text-sm font-medium text-zinc-600 dark:text-zinc-400">文章ID</label>
            <p id="article-id" class="mt-1 text-sm text-zinc-800 dark:text-zinc-200">#{articleDetail.id}</p>
          </div>
          <div>
            <label for="article-content-length" class="text-sm font-medium text-zinc-600 dark:text-zinc-400">正文长度</label>
            <p id="article-content-length" class="mt-1 text-sm text-zinc-800 dark:text-zinc-200">{articleDetail.s3_content ? articleDetail.s3_content.length : 0} 字符</p>
          </div>
        </div>
        <Separator />
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Clock class="h-4 w-4 text-green-500" />
            <h3 class="text-sm font-medium text-zinc-700 dark:text-zinc-300">统计信息</h3>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div class="text-xs text-blue-600 dark:text-blue-400">段落数</div>
              <div class="text-lg font-semibold text-blue-700 dark:text-blue-300">{articleDetail.s3_content ? articleDetail.s3_content.split('\n\n').filter((p: any) => p.trim()).length : 0}</div>
            </div>
            <div class="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <div class="text-xs text-green-600 dark:text-green-400">单词数</div>
              <div class="text-lg font-semibold text-green-700 dark:text-green-300">{articleDetail.s3_content ? articleDetail.s3_content.split(/\s+/).filter((w: any) => w.trim()).length : 0}</div>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <div class="text-xs text-purple-600 dark:text-purple-400">标题数</div>
              <div class="text-lg font-semibold text-purple-700 dark:text-purple-300">{articleDetail.s3_content ? (articleDetail.s3_content.match(/#{1,6}\s+/g) || []).length : 0}</div>
            </div>
            <div class="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
              <div class="text-xs text-orange-600 dark:text-orange-400">代码块</div>
              <div class="text-lg font-semibold text-orange-700 dark:text-orange-300">{articleDetail.s3_content ? (articleDetail.s3_content.match(/```[\s\S]*?```/g) || []).length : 0}</div>
            </div>
          </div>
        </div>
        <Separator />
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Tag class="h-4 w-4 text-purple-500" />
            <h3 class="text-sm font-medium text-zinc-700 dark:text-zinc-300">快速操作</h3>
          </div>
          <div class="space-y-2">
            <Button variant="outline" size="sm" class="w-full justify-start" onclick={() => articleDetail && navigator.clipboard.writeText(articleDetail.title)}>
              <FileText class="mr-2 h-4 w-4" />
              复制标题
            </Button>
            <Button variant="outline" size="sm" class="w-full justify-start" onclick={() => articleDetail && navigator.clipboard.writeText(articleDetail.s3_content)}>
              <FileText class="mr-2 h-4 w-4" />
              复制正文
            </Button>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground opacity-80">
        <Info class="mb-2 h-16 w-16 text-zinc-300 dark:text-zinc-700" />
        <p class="text-center text-sm">选择一篇文章查看详细信息</p>
      </div>
    {/if}
  </ScrollArea>
</div>
