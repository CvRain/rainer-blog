<script lang="ts">
	import { onMount } from 'svelte';
	import NavHeader from '$lib/components/nav-header.svelte';
	import NavFooter from '$lib/components/nav-footer.svelte';
	import ThemeEditorSidebar from '$lib/components/theme-editor/theme-editor-sidebar.svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { getActiveThemeDetails } from '@/api/theme_request';
	import type { ApiTheme, ApiArticle } from '@/api/response_schema';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let theme: ApiTheme | null = $state(null);
	let selectedArticle: ApiArticle | null = $state(null);
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
			expandedChapters = Object.fromEntries((theme!.chapters || []).map((ch) => [ch.id, true]));
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
	<!-- 毛玻璃大背景图 -->
	<div class="relative h-[48vh] w-full bg-gray-900">
		<img src={'/images/theme-default-cover.png'} alt="Banner" class="h-full w-full object-cover" />
		<div
			class="absolute inset-0 h-full bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-md"
		></div>
		<div
			class="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center"
		>
			{#if theme}
				<h1 class="mb-2 text-4xl font-bold text-white drop-shadow-lg">{theme.name}</h1>
				<div class="mx-auto mb-4 line-clamp-2 max-w-2xl text-lg text-white/80">
					{theme.description}
				</div>
				<div class="flex flex-wrap justify-center gap-6 text-base text-white/70">
					<span>创建时间 {theme.inserted_at?.slice(0, 10)}</span>
					{#if theme.updated_at}
						<span>更新于 {theme.updated_at.slice(0, 10)}</span>
					{/if}
					<span>章节数 {theme.chapters?.length || 0}</span>
					<span
						>文章数 {theme.chapters?.reduce((acc, ch) => acc + (ch.articles?.length || 0), 0)}</span
					>
				</div>
			{/if}
		</div>
	</div>
	<!-- 主体内容区 -->
	<main
		class="relative z-10 flex w-full max-w-6xl gap-12 px-6 py-8 mx-auto items-start"
		style="margin-top:-80px;"
	>
		<!-- 左侧只读大纲，固定宽度 -->
		<div class="mt-8 h-full w-72 flex-shrink-0">
			{#if theme}
				<ThemeEditorSidebar
					{theme}
					editingItem={null}
					editingText={''}
					{selectedArticle}
					onCreateNew={() => {}}
					onEditItem={() => {}}
					onDeleteItem={() => {}}
					onHandleRename={() => {}}
					onSelectArticle={handleSelectArticle}
					{expandedChapters}
					setExpandedChapters={(v) => (expandedChapters = v)}
					readonly={true}
				/>
			{/if}
		</div>
		<!-- 右侧内容区，宽大居中 -->
		<div class="mt-8 flex-1 flex flex-col gap-8 mx-auto max-w-3xl">
			{#if loading}
				<div class="text-muted-foreground">加载中...</div>
			{:else if error}
				<div class="text-red-500">{error}</div>
			{:else if theme}
				{#each theme.chapters as chapter}
					<Card class="mb-2 rounded-2xl bg-white/90 shadow-md">
						<CardHeader>
							<CardTitle class="text-xl font-semibold">{chapter.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div class="mb-2 text-muted-foreground">{chapter.description}</div>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								{#each chapter.articles as article}
									<button
										type="button"
										class="group w-full cursor-pointer rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.95)] p-4 text-left shadow-sm transition hover:scale-[1.02] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										onclick={() => handleSelectArticle(article)}
									>
										<div
											class="text-lg font-bold text-[hsl(var(--card-foreground))] group-hover:underline"
										>
											{article.title}
										</div>
										<div class="mt-1 line-clamp-2 text-sm text-muted-foreground">
											{article.content?.slice(0, 60) || ''}
										</div>
										<div class="mt-2 flex justify-between text-xs text-muted-foreground">
											<span
												>更新于 {article.updated_at?.slice(0, 10) ||
													article.inserted_at?.slice(0, 10)}</span
											>
										</div>
									</button>
								{/each}
							</div>
						</CardContent>
					</Card>
				{/each}
			{/if}
		</div>
	</main>
</div>
