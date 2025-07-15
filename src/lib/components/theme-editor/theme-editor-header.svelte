<script lang="ts">
import { Button } from '$lib/components/ui/button';
import { PanelLeft, PanelRight, ArrowLeftToLine, Sun, Moon } from 'lucide-svelte';
import { toggleMode } from 'mode-watcher';

export let title: string;
export let onToggleSidebar: () => void;
export let onToggleRightSidebar: () => void;
export let onBack: () => void;
</script>

<header class="flex h-14 shrink-0 items-center border-b bg-white/80 px-4 shadow-sm backdrop-blur-md dark:bg-zinc-900/80">
  <div class="flex items-center gap-2">
    <Button variant="ghost" size="icon" onclick={onToggleSidebar} title="Toggle sidebar" class="rounded-full transition hover:bg-zinc-200 dark:hover:bg-zinc-800">
      <PanelLeft class="h-5 w-5" />
    </Button>
    <h1 class="text-lg font-bold tracking-tight text-zinc-800 drop-shadow-sm dark:text-zinc-100">{title}</h1>
  </div>
  <div class="flex items-center gap-2 ml-auto">
    <Button variant="ghost" size="icon" title="文章详情" onclick={onToggleRightSidebar} class="rounded-full transition hover:bg-zinc-200 dark:hover:bg-zinc-800">
      <PanelRight class="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon" title="返回上一页" onclick={onBack} class="rounded-full transition hover:bg-zinc-200 dark:hover:bg-zinc-800">
      <ArrowLeftToLine class="h-5 w-5" />
    </Button>
    <Button onclick={toggleMode} variant="outline" size="icon" title="切换主题" class="rounded-full transition hover:bg-zinc-200 dark:hover:bg-zinc-800">
      <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span class="sr-only">切换主题</span>
    </Button>
  </div>
</header> 