<script lang="ts">
import { onMount } from 'svelte';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
import { Switch } from '$lib/components/ui/switch';
import { Button } from '$lib/components/ui/button';
import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
import * as AlertDialog from '$lib/components/ui/alert-dialog';
import { getActiveThemeDetails, getOneThemeWithDetails } from '@/api/theme_request';
import { updateChapter, removeChapter } from '@/api/chapter_request';
import { updateArticleContent, removeArticle } from '@/api/article_request';
import type { ApiTheme, ApiChapter, ApiArticle } from '@/api/response_schema';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

let theme: ApiTheme | null = $state(null);
let loading = $state(true);
let error = $state('');
let showDeleteChapterDialog = $state(false);
let showDeleteArticleDialog = $state(false);
let chapterToDelete: ApiChapter | null = $state(null);
let articleToDelete: ApiArticle | null = $state(null);

onMount(async () => {
	loading = true;
	error = '';
	const themeId = $page.params.id;
	const resp = await getOneThemeWithDetails(themeId);
	if (resp.code === 200 && resp.data) {
		theme = resp.data;
	} else {
		error = resp.message || '加载主题失败';
	}
	loading = false;
});

async function handleChapterActive(chapter: ApiChapter) {
	chapter.is_active = !chapter.is_active;
	await updateChapter({
		id: chapter.id,
		name: chapter.name,
		is_active: chapter.is_active
	});
}

async function handleArticleActive(article: ApiArticle) {
	article.is_active = !article.is_active;
	await updateArticleContent({
		id: article.id,
		title: article.title,
		content: article.content,
		s3_content: article.content, // FIXME: ApiArticle should have s3_content
		chapter_id: article.chapter_id,
		order: article.order,
		is_active: article.is_active
	});
}

function gotoChapterEdit(chapter: ApiChapter) {
	// 预留编辑跳转
	alert('编辑章节功能待实现');
}
function gotoArticleEdit(article: ApiArticle) {
	// 预留编辑跳转
	alert('编辑文章功能待实现');
}
function gotoArticleDetail(article: ApiArticle) {
	goto(`/article/${article.id}`);
}

function openDeleteChapterDialog(chapter: ApiChapter) {
	chapterToDelete = chapter;
	showDeleteChapterDialog = true;
}

async function confirmDeleteChapter() {
	if (chapterToDelete && theme) {
		const resp = await removeChapter(chapterToDelete.id);
		if (resp.code === 200) {
			theme.chapters = theme.chapters.filter((c) => c.id !== chapterToDelete!.id);
		} else {
			error = resp.message || '删除章节失败';
		}
		showDeleteChapterDialog = false;
		chapterToDelete = null;
	}
}

function openDeleteArticleDialog(article: ApiArticle) {
	articleToDelete = article;
	showDeleteArticleDialog = true;
}

async function confirmDeleteArticle() {
	if (articleToDelete && theme) {
		const resp = await removeArticle(articleToDelete.id);
		if (resp.code === 200) {
			for (const chapter of theme.chapters) {
				chapter.articles = chapter.articles.filter((a) => a.id !== articleToDelete!.id);
			}
		} else {
			error = resp.message || '删除文章失败';
		}
		showDeleteArticleDialog = false;
		articleToDelete = null;
	}
}
</script>

<div class="flex min-h-screen flex-col bg-background">
	<div class="w-full max-w-5xl mx-auto py-12">
		<h1 class="mb-8 text-3xl font-bold tracking-tight text-foreground text-center">主题内容管理</h1>
		{#if loading}
			<div class="text-muted-foreground">加载中...</div>
		{:else if error}
			<div class="text-red-500">{error}</div>
		{:else if theme}
			<Card class="mb-8">
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
						<span>文章数 {theme.chapters?.reduce((acc, ch) => acc + (ch.articles?.length || 0), 0)}</span>
					</div>
				</CardContent>
			</Card>
			{#each theme.chapters as chapter}
				<Card class="mb-6">
					<CardHeader class="flex flex-row items-center justify-between">
						<div class="flex items-center gap-4">
							<CardTitle class="text-lg font-semibold">{chapter.name}</CardTitle>
							<Switch checked={chapter.is_active} onclick={() => handleChapterActive(chapter)} />
						</div>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button variant="ghost" size="icon"><span>⋮</span></Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item onclick={() => gotoChapterEdit(chapter)}>编辑</DropdownMenu.Item>
								<DropdownMenu.Item onclick={() => openDeleteChapterDialog(chapter)} class="text-destructive"
									>删除</DropdownMenu.Item
								>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</CardHeader>
					<CardContent>
						<div class="mb-2 text-muted-foreground">{chapter.description}</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each chapter.articles as article}
								<Card class="p-0">
									<CardHeader class="flex flex-row items-center justify-between pb-2">
										<div class="flex items-center gap-2">
											<CardTitle class="text-base font-medium">{article.title}</CardTitle>
											<Switch
												checked={article.is_active}
												onclick={() => handleArticleActive(article)}
											/>
										</div>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<Button variant="ghost" size="icon"><span>⋮</span></Button>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Item onclick={() => gotoArticleEdit(article)}>编辑</DropdownMenu.Item>
												<DropdownMenu.Item onclick={() => gotoArticleDetail(article)}>详情</DropdownMenu.Item>
												<DropdownMenu.Item
													onclick={() => openDeleteArticleDialog(article)}
													class="text-destructive">删除</DropdownMenu.Item
												>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</CardHeader>
									<CardContent>
										<div class="text-muted-foreground line-clamp-2">{article.content?.slice(0, 60) || ''}</div>
									</CardContent>
								</Card>
							{/each}
						</div>
					</CardContent>
				</Card>
			{/each}
		{/if}
		<AlertDialog.Root bind:open={showDeleteChapterDialog}>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>确定要删除章节吗？</AlertDialog.Title>
					<AlertDialog.Description>
						此操作无法撤销。这将永久删除章节 “{chapterToDelete?.name}” 及其下的所有文章。
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel onclick={() => (showDeleteChapterDialog = false)}>取消</AlertDialog.Cancel>
					<AlertDialog.Action onclick={confirmDeleteChapter}>确定</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<AlertDialog.Root bind:open={showDeleteArticleDialog}>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>确定要删除文章吗？</AlertDialog.Title>
					<AlertDialog.Description>
						此操作无法撤销。这将永久删除文章 “{articleToDelete?.title}”。
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel onclick={() => (showDeleteArticleDialog = false)}>取消</AlertDialog.Cancel>
					<AlertDialog.Action onclick={confirmDeleteArticle}>确定</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>
</div> 