<script lang="ts">
import { ScrollArea } from '$lib/components/ui/scroll-area';
import { Separator } from '$lib/components/ui/separator';
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
import { ChevronDown, ChevronRight, FileText, FolderClosed, FolderOpen, Plus, MoreVertical, Edit, Trash2 } from 'lucide-svelte';

export let theme: any;
export let editingItem: any;
export let editingText: any;
export let selectedArticle: any;
export let onCreateNew: any;
export let onEditItem: any;
export let onDeleteItem: any;
export let onHandleRename: any;
export let onSelectArticle: any;
export let fileUploadInput: any;
export let onTriggerFileUpload: any;

</script>
<div class="sidebar mr-2 flex w-1/5 min-w-[260px] max-w-xs flex-col gap-4 rounded-xl border-r border-zinc-200 bg-white/90 p-2 shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-900/90">
  <ScrollArea class="h-full">
    <!-- Chapters & Articles -->
    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between px-2 py-1">
        <h2 class="text-sm font-semibold tracking-tight text-muted-foreground">大纲</h2>
        <Button variant="ghost" size="icon" class="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-100 to-blue-300 transition hover:scale-105 dark:from-blue-900 dark:to-blue-700" on:click={() => onCreateNew('chapter')} title="新建章节">
          <Plus class="h-4 w-4 text-blue-700 dark:text-blue-200" />
        </Button>
      </div>
      {#each theme.chapters as chapter (chapter.id)}
        <div>
          <div class="group flex w-full cursor-pointer items-center gap-1 rounded-lg py-1 pr-1 text-sm shadow-sm transition hover:bg-blue-50 dark:hover:bg-blue-900/40">
            <button class="flex flex-1 items-center gap-1.5 pl-1 text-left" on:click={() => (chapter.expanded = !chapter.expanded)}>
              {#if chapter.expanded}
                <ChevronDown class="h-4 w-4 shrink-0" />
                <FolderOpen class="h-4 w-4 text-blue-500" />
              {:else}
                <ChevronRight class="h-4 w-4 shrink-0" />
                <FolderClosed class="h-4 w-4 text-blue-500" />
              {/if}
              {#if editingItem?.type === 'chapter' && editingItem.id === chapter.id}
                <Input class="h-6 w-full rounded border border-blue-300 focus:ring-2 focus:ring-blue-400" value={editingText} on:blur={onHandleRename} on:keydown={(e: any) => e.key === 'Enter' && onHandleRename(e)} autofocus />
              {:else}
                <span class="flex-1 truncate font-medium text-zinc-800 dark:text-zinc-100">{chapter.title}</span>
              {/if}
            </button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-blue-100 group-hover:opacity-100 dark:hover:bg-blue-800/40">
                <MoreVertical class="h-4 w-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <DropdownMenu.Item on:click={() => onCreateNew('article', chapter)}><Plus class="mr-2 h-4 w-4" /> 新建文章</DropdownMenu.Item>
                <DropdownMenu.Item on:click={() => onEditItem('chapter', chapter.id, chapter.title)}><Edit class="mr-2 h-4 w-4" /> 重命名</DropdownMenu.Item>
                <DropdownMenu.Item class="text-destructive" on:click={() => onDeleteItem('chapter', chapter.id)}><Trash2 class="mr-2 h-4 w-4" /> 删除</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          {#if chapter.expanded}
            <div class="ml-5 border-l border-dashed pl-2.5">
              {#each chapter.articles as article (article.id)}
                <div class="group flex w-full cursor-pointer items-center gap-1.5 rounded-md border-b border-zinc-100 py-1 pl-2 pr-1 text-sm transition last:border-b-0 hover:bg-blue-50 dark:border-zinc-800 dark:hover:bg-blue-900/30" class:bg-blue-100={selectedArticle?.id === article.id}>
                  <button class="flex flex-1 items-center gap-1.5 text-left" on:click={() => onSelectArticle(article)}>
                    <FileText class="h-4 w-4 shrink-0 text-muted-foreground" />
                    {#if editingItem?.type === 'article' && editingItem.id === article.id}
                      <Input class="h-6 w-full rounded border border-blue-300 focus:ring-2 focus:ring-blue-400" value={editingText} on:blur={onHandleRename} on:keydown={(e: any) => e.key === 'Enter' && onHandleRename(e)} autofocus />
                    {:else}
                      <span class="flex-1 truncate">{article.title}</span>
                    {/if}
                  </button>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-blue-100 group-hover:opacity-100 dark:hover:bg-blue-800/40">
                      <MoreVertical class="h-4 w-4" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                      <DropdownMenu.Item on:click={() => onEditItem('article', article.id, article.title)}><Edit class="mr-2 h-4 w-4" /> 重命名</DropdownMenu.Item>
                      <DropdownMenu.Item on:click={() => onDeleteItem('article', article.id, chapter)}><Trash2 class="mr-2 h-4 w-4" /> 删除</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
    <Separator />
    <!-- Resources -->
    <div class="mt-4">
      <div class="mb-2 flex items-center justify-between px-2 py-1">
        <h2 class="text-sm font-semibold tracking-tight text-muted-foreground">资源文件</h2>
        <Button variant="ghost" size="icon" class="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-100 to-amber-300 transition hover:scale-105 dark:from-amber-900 dark:to-amber-700" on:click={() => onCreateNew('folder')} title="新建文件夹">
          <Plus class="h-4 w-4 text-amber-700 dark:text-amber-200" />
        </Button>
      </div>
      <input type="file" bind:this={fileUploadInput.current} class="hidden" multiple />
      {#each theme.resources as folder (folder.id)}
        <div>
          <div class="group flex w-full cursor-pointer items-center gap-1 rounded-lg py-1 pr-1 text-sm shadow-sm transition hover:bg-amber-50 dark:hover:bg-amber-900/40">
            <button class="flex flex-1 items-center gap-1.5 pl-1 text-left" on:click={() => (folder.expanded = !folder.expanded)}>
              {#if folder.expanded}
                <ChevronDown class="h-4 w-4 shrink-0" />
                <FolderOpen class="h-4 w-4 text-amber-500" />
              {:else}
                <ChevronRight class="h-4 w-4 shrink-0" />
                <FolderClosed class="h-4 w-4 text-amber-500" />
              {/if}
              {#if editingItem?.type === 'folder' && editingItem.id === folder.id}
                <Input class="h-6 w-full rounded border border-amber-300 focus:ring-2 focus:ring-amber-400" autofocus />
              {:else}
                <span class="flex-1 truncate font-medium text-zinc-800 dark:text-zinc-100">{folder.title}</span>
              {/if}
            </button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-amber-100 group-hover:opacity-100 dark:hover:bg-amber-800/40">
                <MoreVertical class="h-4 w-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <DropdownMenu.Item on:click={() => onEditItem('folder', folder.id, folder.title)}><Edit class="mr-2 h-4 w-4" /> 重命名</DropdownMenu.Item>
                <DropdownMenu.Item class="text-destructive" on:click={() => onDeleteItem('folder', folder.id)}><Trash2 class="mr-2 h-4 w-4" /> 删除</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          {#if folder.expanded}
            <div class="ml-5 border-l border-dashed pl-2.5">
              {#each folder.files as file (file.id)}
                <div class="flex items-center gap-2 py-1 text-xs text-zinc-600 dark:text-zinc-300">
                  <FileText class="h-4 w-4 text-amber-400" />
                  <span class="truncate">{file.title}</span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </ScrollArea>
</div> 