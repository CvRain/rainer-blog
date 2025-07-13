<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import {
		ChevronDown,
		ChevronRight,
		FileText,
		FolderClosed,
		FolderOpen,
		Image,
		PanelLeft,
		PanelRight,
		Plus,
		MoreVertical,
		Edit,
		Trash2,
		BookMarked,
		ArrowLeftToLine,
		Info,
		Calendar,
		User,
		Tag,
		Clock,
		Sun,
		Moon
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Editor from './components/editor.svelte';
	import { MarkdownEditor, Carta } from 'carta-md';
	import 'carta-md/default.css';
	import { toggleMode } from 'mode-watcher';
	import ThemeEditorHeader from '$lib/components/theme-editor/ThemeEditorHeader.svelte';
	import ThemeEditorSidebar from '$lib/components/theme-editor/ThemeEditorSidebar.svelte';
	import ArticleInfoSidebar from '$lib/components/theme-editor/ArticleInfoSidebar.svelte';
	import type { ApiTheme, ApiChapter, ApiArticle } from '@/api/response_schema';
	import { getOneThemeWithDetails } from '@/api/theme_request';
	import { getArticleDetail } from '@/api/article_request';
	import { createChapter, removeChapter } from '@/api/chapter_request';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	// theme 直接用 ApiTheme 类型
	let theme: ApiTheme = $state({
		id: '',
		name: '',
		description: '',
		order: 0,
		is_active: false,
		inserted_at: '',
		updated_at: '',
		chapters: []
	});

	let selectedArticle: ApiArticle | null = $state(null);
	let sidebarCollapsed = $state(false);
	let rightSidebarCollapsed = $state(false);
	const fileUploadInput: { current: HTMLInputElement | null } = { current: null };

	let editingItem: { type: string; id: string } | null = $state(null);
	let editingText = $state('');

	let expandedChapters = $derived(
		theme ? Object.fromEntries(theme.chapters.map((ch) => [ch.id, false])) : {}
	);
	function setExpandedChapters(v: Record<string, boolean>) { expandedChapters = v; }

	let alertMessage = $state('');
	let alertShow = $state(false);
	let alertTimeout: any = null;

	function showAlert(msg: string) {
		alertMessage = msg;
		alertShow = true;
		if (alertTimeout) clearTimeout(alertTimeout);
		alertTimeout = setTimeout(() => {
			alertShow = false;
		}, 4000);
	}

	let chapterToDelete: { id: string; parent?: ApiChapter } | null = $state(null);
	let isDeleteDialogOpen = $state(false);
	let isDeleting = $state(false);

	function confirmDeleteChapter(id: string, parent?: ApiChapter) {
		chapterToDelete = { id, parent };
		isDeleteDialogOpen = true;
	}

	async function handleDeleteChapter() {
		if (!chapterToDelete || isDeleting) return;
		isDeleting = true;
		const { id } = chapterToDelete;
		const resp = await removeChapter(id);
		if (resp.code === 204) {
			theme.chapters = theme.chapters.filter((c) => c.id !== id);
		} else {
			showAlert(resp.message || '删除章节失败');
		}
		isDeleteDialogOpen = false;
		chapterToDelete = null;
		isDeleting = false;
	}

	// --- Functions ---
	function createNew(type: 'chapter' | 'article', parent?: ApiChapter) {
		if (!theme) return;
		if (type === 'chapter') {
			const tempId = 'temp-' + Date.now();
			const newChapter: ApiChapter = {
				id: tempId,
				name: '',
				description: '',
				order: theme.chapters.length + 1,
				is_active: true,
				inserted_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				theme_id: theme.id,
				articles: []
			};
			theme.chapters.push(newChapter);
			editItem('chapter', tempId, '');
		} else if (type === 'article' && parent) {
			const newId = Date.now().toString();
			const newArticle: ApiArticle = {
				id: newId,
				title: '新文章',
				content: '# 新文章',
				aws_key: '',
				order: parent.articles.length + 1,
				is_active: true,
				chapter_id: parent.id,
				inserted_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
			parent.articles.push(newArticle);
			editItem('article', newId, '新文章');
		}
	}

	function deleteItem(type: string, id: string, parent?: ApiChapter) {
		if (!theme) return;
		if (type === 'chapter') {
			confirmDeleteChapter(id, parent);
		} else if (type === 'article' && parent) {
			parent.articles = parent.articles.filter((a) => a.id !== id);
		}
	}

	function editItem(type: string, id: string, currentTitle: string) {
		editingItem = { type, id };
		editingText = currentTitle;
	}

	async function handleRename(e: Event) {
		if (!editingItem || !theme) return;
		const { type, id } = editingItem;
		const target = e.target as HTMLInputElement;
		const newTitle = target.value.trim();

		if (type === 'chapter') {
			const chapterIdx = theme.chapters.findIndex((c) => c.id === id);
			if (chapterIdx === -1) return;

			if (id.startsWith('temp-')) {
				if (!newTitle) {
					theme.chapters.splice(chapterIdx, 1);
				} else {
					const resp = await createChapter(newTitle, theme.id);
					if (resp.code === 201 && resp.data) {
						theme.chapters[chapterIdx] = resp.data as ApiChapter;
					} else {
						const msg = resp.message || '新建章节失败';
						theme.chapters.splice(chapterIdx, 1);
						showAlert(msg);
					}
				}
			} else {
				theme.chapters[chapterIdx].name = newTitle;
			}
		} else if (type === 'article') {
			for (const chapter of theme.chapters) {
				const article = chapter.articles.find((a) => a.id === id);
				if (article) {
					article.title = newTitle;
					break;
				}
			}
		}
		editingItem = null;
	}

	function handleFileUpload(e: Event, folder: ApiChapter) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			for (const file of Array.from(target.files)) {
				folder.articles.push({
					id: Date.now().toString(),
					title: file.name,
					content: '',
					aws_key: '',
					order: folder.articles.length + 1,
					is_active: true,
					chapter_id: folder.id,
					inserted_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				});
			}
		}
	}

	function triggerFileUpload(folder: ApiChapter) {
		if (fileUploadInput.current) {
			fileUploadInput.current.onchange = (e) => handleFileUpload(e, folder);
			fileUploadInput.current.click();
		}
	}

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}

	function toggleRightSidebar() {
		rightSidebarCollapsed = !rightSidebarCollapsed;
	}

	function handleBack() {
		history.back();
	}

	async function handleSelectArticle(article: ApiArticle) {
		const resp = await getArticleDetail(article.id);
		if (resp.code === 200 && resp.data) {
			selectedArticle = {
				...article,
				content: resp.data.s3_content ?? article.content
			};
		} else {
			selectedArticle = article;
		}
	}

	onMount(async () => {
		const resp = await getOneThemeWithDetails($page.params.id);
		if (resp.code === 200 && resp.data) {
			theme = resp.data;
			if (theme.chapters[0]?.articles[0]) {
				selectedArticle = theme.chapters[0].articles[0];
			}
		}
	});
</script>

{#if alertShow}
	<div class="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full max-w-md">
		<Alert variant="destructive">
			<AlertTitle>操作失败</AlertTitle>
			<AlertDescription>{alertMessage}</AlertDescription>
		</Alert>
	</div>
{/if}
<AlertDialog.Root bind:open={isDeleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Title>确认删除章节</AlertDialog.Title>
		<AlertDialog.Description>此操作不可撤销，确定要删除该章节吗？</AlertDialog.Description>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>取消</AlertDialog.Cancel>
			<button class="w-full btn btn-destructive" on:click|preventDefault={handleDeleteChapter} disabled={isDeleting}>确认删除</button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
<div
	class="editor-bg flex h-screen flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-100 font-sans text-foreground dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900"
>
	<ThemeEditorHeader
		title={theme ? theme.name : ''}
		onToggleSidebar={toggleSidebar}
		onToggleRightSidebar={toggleRightSidebar}
		onBack={handleBack}
	/>
	<div class="flex flex-1 flex-row gap-4 p-4">
		{#if !sidebarCollapsed}
			<ThemeEditorSidebar
				{theme}
				{editingItem}
				{editingText}
				{selectedArticle}
				onCreateNew={createNew}
				onEditItem={editItem}
				onDeleteItem={deleteItem}
				onHandleRename={handleRename}
				onSelectArticle={handleSelectArticle}
				{expandedChapters}
				{setExpandedChapters}
			/>
		{/if}
		<div class="h-full min-w-0 flex-1">
			{#if selectedArticle}
				<div
					class="editor-content flex h-full min-h-0 w-full flex-1 flex-col rounded-2xl bg-white/90 p-0 shadow-2xl transition-all dark:bg-zinc-900/90"
				>
					<Editor article={selectedArticle} />
				</div>
			{:else}
				<div
					class="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground opacity-80"
				>
					<span class="mb-2 h-16 w-16 text-zinc-300 dark:text-zinc-700">📝</span>
					<p class="text-lg font-semibold">请选择左侧文章进行编辑</p>
					<p class="text-sm">点击"新建章节"或"新建文章"开始创作吧！</p>
				</div>
			{/if}
		</div>
		{#if !rightSidebarCollapsed}
			<ArticleInfoSidebar {selectedArticle} />
		{/if}
	</div>
</div>

<style>
	.editor-bg {
		font-family: 'Inter', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
	}
	:global(.sidebar) {
		box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.04);
	}
	:global(.right-sidebar) {
		box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.04);
	}
	:global(.editor-content) {
		box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.08);
		transition: box-shadow 0.2s;
	}
	:global(.editor-content:focus-within) {
		box-shadow: 0 8px 40px 0 rgba(0, 0, 0, 0.12);
	}
	::-webkit-scrollbar {
		height: 8px;
		width: 8px;
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background: #e5e7eb;
		border-radius: 4px;
	}
</style>
