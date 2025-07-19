<script lang="ts">
import { onMount } from 'svelte';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
import NavHeader from '$lib/components/nav-header.svelte';
import NavFooter from '$lib/components/nav-footer.svelte';
import { goto } from '$app/navigation';
import { getActiveThemeInfo } from '@/api/theme_request';
import type { ThemeWithSchema } from '@/api/response_schema';

let themes: ThemeWithSchema[] = $state([]);
let loading = $state(true);
let error = $state('');

onMount(async () => {
  loading = true;
  error = '';
  const resp = await getActiveThemeInfo();
  if (resp.code === 200 && resp.data) {
    themes = Array.isArray(resp.data) ? resp.data : [resp.data];
  } else {
    error = resp.message || '加载主题失败';
  }
  loading = false;
});
</script>

<div class="flex min-h-screen flex-col bg-background">
  <NavHeader />
  <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
    <h1 class="mb-10 text-4xl font-bold tracking-tight text-foreground text-center">主题归档</h1>
    {#if loading}
      <div class="text-muted-foreground">加载中...</div>
    {:else if error}
      <div class="text-red-500">{error}</div>
    {:else if themes.length === 0}
      <div class="text-muted-foreground">暂无可访问主题</div>
    {:else}
      <div class="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
        {#each themes as theme}
          <Card
            class="group relative h-[22rem] cursor-pointer overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.95)] shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl"
            onclick={() => goto(`/theme/${theme.id}`)}
          >
            <div class="w-full h-40 overflow-hidden rounded-t-3xl relative">
              <img src={'/images/theme-default-cover.png'} alt="cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            </div>
            <CardHeader class="pt-4 pb-2">
              <CardTitle class="truncate text-2xl font-bold text-[hsl(var(--card-foreground))] group-hover:underline">{theme.name}</CardTitle>
              <p class="mt-2 text-base text-muted-foreground line-clamp-2">{theme.description}</p>
            </CardHeader>
            <CardContent class="flex flex-col gap-2 pt-0">
              <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>创建时间 {theme.inserted_at?.slice(0, 10)}</span>
                {#if theme.updated_at}
                  <span>更新于 {theme.updated_at.slice(0, 10)}</span>
                {/if}
              </div>
            </CardContent>
            <CardFooter class="flex items-center justify-between pt-2">
              <span class="text-xs text-muted-foreground">点击查看主题详情</span>
            </CardFooter>
          </Card>
        {/each}
      </div>
    {/if}
  </main>
</div>