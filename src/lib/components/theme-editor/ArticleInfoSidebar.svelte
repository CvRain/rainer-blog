<script lang="ts">
import { ScrollArea } from '$lib/components/ui/scroll-area';
import { Separator } from '$lib/components/ui/separator';
import { Button } from '$lib/components/ui/button';
import { Info, Clock, Tag, FileText } from 'lucide-svelte';

export let selectedArticle: any;
</script>
<div class="right-sidebar ml-2 flex w-1/5 min-w-[280px] max-w-sm flex-col gap-4 rounded-xl border-l border-zinc-200 bg-white/90 p-4 shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-900/90">
  <ScrollArea class="h-full">
    {#if selectedArticle}
      <!-- 文章详细信息 -->
      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <Info class="h-5 w-5 text-blue-500" />
          <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100">文章详情</h2>
        </div>
        <!-- 基本信息 -->zz
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">标题</label>
            <p class="mt-1 text-sm text-zinc-800 dark:text-zinc-200">{selectedArticle.title}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">文章ID</label>
            <p class="mt-1 text-sm text-zinc-800 dark:text-zinc-200">#{selectedArticle.id}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">内容长度</label>
            <p class="mt-1 text-sm text-zinc-800 dark:text-zinc-200">{selectedArticle.content.length} 字符</p>
          </div>
        </div>
        <Separator />
        <!-- 统计信息 -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Clock class="h-4 w-4 text-green-500" />
            <h3 class="text-sm font-medium text-zinc-700 dark:text-zinc-300">统计信息</h3>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div class="text-xs text-blue-600 dark:text-blue-400">段落数</div>
              <div class="text-lg font-semibold text-blue-700 dark:text-blue-300">{selectedArticle.content.split('\n\n').filter((p: any) => p.trim()).length}</div>
            </div>
            <div class="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <div class="text-xs text-green-600 dark:text-green-400">单词数</div>
              <div class="text-lg font-semibold text-green-700 dark:text-green-300">{selectedArticle.content.split(/\s+/).filter((w: any) => w.trim()).length}</div>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <div class="text-xs text-purple-600 dark:text-purple-400">标题数</div>
              <div class="text-lg font-semibold text-purple-700 dark:text-purple-300">{(selectedArticle.content.match(/#{1,6}\s+/g) || []).length}</div>
            </div>
            <div class="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
              <div class="text-xs text-orange-600 dark:text-orange-400">代码块</div>
              <div class="text-lg font-semibold text-orange-700 dark:text-orange-300">{(selectedArticle.content.match(/```[\s\S]*?```/g) || []).length}</div>
            </div>
          </div>
        </div>
        <Separator />
        <!-- 快速操作 -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Tag class="h-4 w-4 text-purple-500" />
            <h3 class="text-sm font-medium text-zinc-700 dark:text-zinc-300">快速操作</h3>
          </div>
          <div class="space-y-2">
            <Button variant="outline" size="sm" class="w-full justify-start" onclick={() => selectedArticle && navigator.clipboard.writeText(selectedArticle.title)}>
              <FileText class="mr-2 h-4 w-4" />
              复制标题
            </Button>
            <Button variant="outline" size="sm" class="w-full justify-start" onclick={() => selectedArticle && navigator.clipboard.writeText(selectedArticle.content)}>
              <FileText class="mr-2 h-4 w-4" />
              复制内容
            </Button>
          </div>
        </div>
      </div>
    {:else}
      <!-- 未选择文章时的提示 -->
      <div class="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground opacity-80">
        <Info class="mb-2 h-16 w-16 text-zinc-300 dark:text-zinc-700" />
        <p class="text-center text-sm">选择一篇文章查看详细信息</p>
      </div>
    {/if}
  </ScrollArea>
</div> 