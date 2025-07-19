<script lang="ts">
import { onMount } from 'svelte';
import NavHeader from '$lib/components/nav-header.svelte';
import NavFooter from '$lib/components/nav-footer.svelte';
import ThemeEditorSidebar from '$lib/components/theme-editor/theme-editor-sidebar.svelte';
import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
import { getActiveThemeDetails } from '@/api/theme_request';
import type { ApiTheme, ApiArticle, ApiChapter } from '@/api/response_schema';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

let theme: ApiTheme|null = null;
let selectedArticle: ApiArticle|null = null;
let expandedChapters = $state({});
let loading = $state(true);
let error = $state('');

onMount(async () => {
  loading = true;
  error = '';
  const themeId = $page.params.id;
  const resp = await getActiveThemeDetails(themeId);
  if (resp.code === 200 && resp.data) {
    theme = resp.data;
    // 默认展开所有章节
    expandedChapters = Object.fromEntries((theme.chapters||[]).map(ch => [ch.id, true]));
  } else {
    error = resp.message || '加载主题失败';
  }
  loading = false;
});

function handleSelectArticle(article: ApiArticle) {
  selectedArticle = article;
  goto(`/article/${article.id}`);
}
</script>

<div class="flex min-h-screen flex-col bg-background">
  <NavHeader />
  <main class="flex-1 w-full max-w-7xl mx-auto flex flex-row gap-6 px-4 py-8">
    <!-- 侧边栏：只读大纲 -->
    <div class="w-80 flex-shrink-0">
      {#if theme}
        <ThemeEditorSidebar
          {theme}
          editingItem={null}
          editingText={''}
          selectedArticle={selectedArticle}
          onCreateNew={() => {}}
          onEditItem={() => {}}
          onDeleteItem={() => {}}
          onHandleRename={() => {}}
          onSelectArticle={handleSelectArticle}
          {expandedChapters}
          setExpandedChapters={v => expandedChapters = v}
          readonly={true}
        />
      {/if}
    </div>
    <!-- 主题信息和章节/文章列表 -->
    <div class="flex-1 flex flex-col gap-6">
      {#if loading}
        <div class="text-muted-foreground">加载中...</div>
      {:else if error}
        <div class="text-red-500">{error}</div>
      {:else if theme}
        <Card class="mb-4">
          <CardHeader>
            <CardTitle class="text-2xl font-bold">{theme.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-muted-foreground mb-2">{theme.description}</div>
            <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span>创建时间 {theme.inserted_at?.slice(0, 10)}</span>
              {#if theme.updated_at}
                <span>更新于 {theme.updated_at.slice(0, 10)}</span>
              {/if}
              <span>章节数 {theme.chapters?.length || 0}</span>
              <span>文章数 {theme.chapters?.reduce((acc, ch) => acc + (ch.articles?.length||0), 0)}</span>
            </div>
          </CardContent>
        </Card>
        {#each theme.chapters as chapter}
          <Card class="mb-4">
            <CardHeader>
              <CardTitle class="text-lg font-semibold">{chapter.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-muted-foreground mb-2">{chapter.description}</div>
              <ul class="space-y-2">
                {#each chapter.articles as article}
                  <li>
                    <button class="w-full text-left px-3 py-2 rounded hover:bg-accent transition" onclick={() => handleSelectArticle(article)}>
                      <div class="font-medium text-base">{article.title}</div>
                      <div class="text-xs text-muted-foreground">{article.updated_at?.slice(0,10) || article.inserted_at?.slice(0,10)}</div>
                    </button>
                  </li>
                {/each}
              </ul>
            </CardContent>
          </Card>
        {/each}
      {/if}
    </div>
  </main>
  <NavFooter />
</div> 