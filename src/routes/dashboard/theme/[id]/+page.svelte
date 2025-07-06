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

	// --- Type Definitions ---
	interface Article {
		id: number;
		title: string;
		content: string;
	}
	interface Chapter {
		id: number;
		title: string;
		expanded: boolean;
		articles: Article[];
	}
	interface ResourceFile {
		id: number;
		title: string;
		type: string;
		url: string;
	}
	interface ResourceFolder {
		id: number;
		title: string;
		expanded: boolean;
		files: ResourceFile[];
	}

	// --- Mock Data ---
	let theme: {
		id: string;
		title: string;
		description: string;
		chapters: Chapter[];
		resources: ResourceFolder[];
	} = $state({
		id: $page.params.id,
		title: 'Web开发基础',
		description: '涵盖HTML、CSS和JavaScript的基础知识',
		chapters: [
			{
				id: 1,
				title: 'HTML基础',
				expanded: true,
				articles: [
					{ id: 101, title: 'HTML简介', content: '# HTML简介...' },
					{ id: 102, title: 'HTML标签', content: '# HTML标签...' }
				]
			},
			{ id: 2, title: 'CSS样式', expanded: false, articles: [] }
		],
		resources: [
			{
				id: 1,
				title: '图片资源',
				expanded: true,
				files: [{ id: 1001, title: 'logo.png', type: 'image', url: '/images/logo.png' }]
			},
			{ id: 2, title: '文档', expanded: false, files: [] }
		]
	});

	// --- Component State ---
	let selectedArticle: Article | null = $state(null);
	let sidebarCollapsed = $state(false);
	let rightSidebarCollapsed = $state(false);
	const fileUploadInput: { current: HTMLInputElement | null } = { current: null };
	const cartaPreview = new Carta({
		sanitizer: false
	});
	let editingItem: { type: string; id: number } | null = $state(null);
	let editingText = $state('');

	// --- Functions ---
	function createNew(type: 'chapter' | 'article' | 'folder', parent?: Chapter | ResourceFolder) {
		const newId = Date.now();
		if (type === 'chapter') {
			theme.chapters.push({ id: newId, title: '新章节', expanded: true, articles: [] });
			editItem('chapter', newId, '新章节');
		} else if (type === 'article' && parent) {
			(parent as Chapter).articles.push({ id: newId, title: '新文章', content: `# 新文章` });
			(parent as Chapter).expanded = true;
			editItem('article', newId, '新文章');
		} else if (type === 'folder') {
			theme.resources.push({ id: newId, title: '新文件夹', expanded: true, files: [] });
			editItem('folder', newId, '新文件夹');
		}
	}

	function deleteItem(type: string, id: number, parent?: Chapter | ResourceFolder) {
		const confirmation = confirm(
			`您确定要删除这个${type === 'chapter' ? '章节' : '文章'}吗？此操作无法撤销。`
		);
		if (!confirmation) return;

		if (type === 'chapter') {
			theme.chapters = theme.chapters.filter((c) => c.id !== id);
		} else if (type === 'article' && parent) {
			(parent as Chapter).articles = (parent as Chapter).articles.filter((a) => a.id !== id);
		} else if (type === 'folder') {
			theme.resources = theme.resources.filter((f) => f.id !== id);
		} else if (type === 'file' && parent) {
			(parent as ResourceFolder).files = (parent as ResourceFolder).files.filter(
				(f) => f.id !== id
			);
		}
	}

	function editItem(type: string, id: number, currentTitle: string) {
		editingItem = { type, id };
		editingText = currentTitle;
	}

	function handleRename(e: Event) {
		if (!editingItem) return;
		const { type, id } = editingItem;
		const target = e.target as HTMLInputElement;
		const newTitle = target.value;

		if (type === 'chapter') {
			const chapter = theme.chapters.find((c) => c.id === id);
			if (chapter) chapter.title = newTitle;
		} else if (type === 'article') {
			for (const chapter of theme.chapters) {
				const article = chapter.articles.find((a) => a.id === id);
				if (article) {
					article.title = newTitle;
					break;
				}
			}
		} else if (type === 'folder') {
			const folder = theme.resources.find((f) => f.id === id);
			if (folder) folder.title = newTitle;
		} else if (type === 'file') {
			for (const folder of theme.resources) {
				const file = folder.files.find((f) => f.id === id);
				if (file) {
					file.title = newTitle;
					break;
				}
			}
		}
		editingItem = null;
	}

	function handleFileUpload(e: Event, folder: ResourceFolder) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			for (const file of Array.from(target.files)) {
				folder.files.push({
					id: Date.now(),
					title: file.name,
					type: file.type.split('/')[0] || 'file',
					url: URL.createObjectURL(file) // 模拟上传后返回的URL
				});
			}
		}
	}

	function triggerFileUpload(folder: ResourceFolder) {
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

	onMount(() => {
		if (theme.chapters[0]?.articles[0]) {
			selectedArticle = theme.chapters[0].articles[0];
		}
	});
</script>

<div
	class="editor-bg flex h-screen flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-100 font-sans text-foreground dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900"
>
	<ThemeEditorHeader
		title={theme.title}
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
				onSelectArticle={(article:any) => (selectedArticle = article)}
				{fileUploadInput}
				onTriggerFileUpload={triggerFileUpload}
			/>
		{/if}
		<div class="flex-1 h-full min-w-0">
			{#if selectedArticle}
				<div
					class="editor-content flex h-full min-h-0 w-full flex-1 flex-col rounded-2xl bg-white/90 p-0 shadow-2xl transition-all dark:bg-zinc-900/90"
				>
					<Editor bind:article={selectedArticle} />
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
