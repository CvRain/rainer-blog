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
		PanelTop,
		Plus,
		MoreVertical,
		Edit,
		Trash2,
		UploadCloud,
		BookMarked
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Editor from './components/editor.svelte';
	import { MarkdownEditor, Carta } from 'carta-md';
	import 'carta-md/default.css';

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

	onMount(() => {
		if (theme.chapters[0]?.articles[0]) {
			selectedArticle = theme.chapters[0].articles[0];
		}
	});
</script>

<div
	class="editor-bg flex h-screen flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-100 font-sans text-foreground dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900"
>
	<header
		class="flex h-14 shrink-0 items-center border-b bg-white/80 px-4 shadow-sm backdrop-blur-md dark:bg-zinc-900/80"
	>
		<div class="flex items-center gap-2">
			<Button
				variant="ghost"
				size="icon"
				onclick={toggleSidebar}
				title="Toggle sidebar"
				class="rounded-full transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
			>
				<PanelLeft class="h-5 w-5" />
			</Button>
			<h1 class="text-lg font-bold tracking-tight text-zinc-800 drop-shadow-sm dark:text-zinc-100">
				{theme.title}
			</h1>
		</div>
	</header>

	<div class="flex flex-1 flex-row gap-4 p-4">
		{#if !sidebarCollapsed}
			<div
				class="sidebar mr-2 flex w-1/5 min-w-[260px] max-w-xs flex-col gap-4 rounded-xl border-r border-zinc-200 bg-white/90 p-2 shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-900/90"
			>
				<ScrollArea class="h-full">
					<!-- Chapters & Articles -->
					<div class="mb-4">
						<div class="mb-2 flex items-center justify-between px-2 py-1">
							<h2 class="text-sm font-semibold tracking-tight text-muted-foreground">大纲</h2>
							<Button
								variant="ghost"
								size="icon"
								class="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-100 to-blue-300 transition hover:scale-105 dark:from-blue-900 dark:to-blue-700"
								onclick={() => createNew('chapter')}
								title="新建章节"
							>
								<Plus class="h-4 w-4 text-blue-700 dark:text-blue-200" />
							</Button>
						</div>
						{#each theme.chapters as chapter (chapter.id)}
							<div>
								<div
									class="group flex w-full cursor-pointer items-center gap-1 rounded-lg py-1 pr-1 text-sm shadow-sm transition hover:bg-blue-50 dark:hover:bg-blue-900/40"
								>
									<button
										class="flex flex-1 items-center gap-1.5 pl-1 text-left"
										onclick={() => (chapter.expanded = !chapter.expanded)}
									>
										{#if chapter.expanded}
											<ChevronDown class="h-4 w-4 shrink-0" />
											<FolderOpen class="h-4 w-4 text-blue-500" />
										{:else}
											<ChevronRight class="h-4 w-4 shrink-0" />
											<FolderClosed class="h-4 w-4 text-blue-500" />
										{/if}
										{#if editingItem?.type === 'chapter' && editingItem.id === chapter.id}
											<Input
												class="h-6 w-full rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
												value={editingText}
												onblur={handleRename}
												onkeydown={(e) => e.key === 'Enter' && handleRename(e)}
												autofocus
											/>
										{:else}
											<span class="flex-1 truncate font-medium text-zinc-800 dark:text-zinc-100"
												>{chapter.title}</span
											>
										{/if}
									</button>

									<DropdownMenu.Root>
										<DropdownMenu.Trigger
											class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-blue-100 group-hover:opacity-100 dark:hover:bg-blue-800/40"
										>
											<MoreVertical class="h-4 w-4" />
										</DropdownMenu.Trigger>
										<DropdownMenu.Content
											class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
										>
											<DropdownMenu.Item onclick={() => createNew('article', chapter)}>
												<Plus class="mr-2 h-4 w-4" /> 新建文章
											</DropdownMenu.Item>
											<DropdownMenu.Item
												onclick={() => editItem('chapter', chapter.id, chapter.title)}
											>
												<Edit class="mr-2 h-4 w-4" /> 重命名
											</DropdownMenu.Item>
											<DropdownMenu.Item
												class="text-destructive"
												onclick={() => deleteItem('chapter', chapter.id)}
											>
												<Trash2 class="mr-2 h-4 w-4" /> 删除
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</div>
								{#if chapter.expanded}
									<div class="ml-5 border-l border-dashed pl-2.5">
										{#each chapter.articles as article (article.id)}
											<div
												class="group flex w-full cursor-pointer items-center gap-1.5 rounded-md border-b border-zinc-100 py-1 pl-2 pr-1 text-sm transition last:border-b-0 hover:bg-blue-50 dark:border-zinc-800 dark:hover:bg-blue-900/30"
												class:bg-blue-100={selectedArticle?.id === article.id}
											>
												<button
													class="flex flex-1 items-center gap-1.5 text-left"
													onclick={() => (selectedArticle = article)}
												>
													<FileText class="h-4 w-4 shrink-0 text-muted-foreground" />
													{#if editingItem?.type === 'article' && editingItem.id === article.id}
														<Input
															class="h-6 w-full rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
															value={editingText}
															onblur={handleRename}
															onkeydown={(e) => e.key === 'Enter' && handleRename(e)}
															autofocus
														/>
													{:else}
														<span class="flex-1 truncate">{article.title}</span>
													{/if}
												</button>
												<DropdownMenu.Root>
													<DropdownMenu.Trigger
														class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-blue-100 group-hover:opacity-100 dark:hover:bg-blue-800/40"
													>
														<MoreVertical class="h-4 w-4" />
													</DropdownMenu.Trigger>
													<DropdownMenu.Content
														class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
													>
														<DropdownMenu.Item
															onclick={() => editItem('article', article.id, article.title)}
														>
															<Edit class="mr-2 h-4 w-4" /> 重命名
														</DropdownMenu.Item>
														<DropdownMenu.Item
															onclick={() => deleteItem('article', article.id, chapter)}
														>
															<Trash2 class="mr-2 h-4 w-4" /> 删除
														</DropdownMenu.Item>
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
							<Button
								variant="ghost"
								size="icon"
								class="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-100 to-amber-300 transition hover:scale-105 dark:from-amber-900 dark:to-amber-700"
								onclick={() => createNew('folder')}
								title="新建文件夹"
							>
								<Plus class="h-4 w-4 text-amber-700 dark:text-amber-200" />
							</Button>
						</div>
						<input type="file" bind:this={fileUploadInput.current} class="hidden" multiple />
						{#each theme.resources as folder (folder.id)}
							<div>
								<div
									class="group flex w-full cursor-pointer items-center gap-1 rounded-lg py-1 pr-1 text-sm shadow-sm transition hover:bg-amber-50 dark:hover:bg-amber-900/40"
								>
									<button
										class="flex flex-1 items-center gap-1.5 pl-1 text-left"
										onclick={() => (folder.expanded = !folder.expanded)}
									>
										{#if folder.expanded}
											<ChevronDown class="h-4 w-4 shrink-0" />
											<FolderOpen class="h-4 w-4 text-amber-500" />
										{:else}
											<ChevronRight class="h-4 w-4 shrink-0" />
											<FolderClosed class="h-4 w-4 text-amber-500" />
										{/if}
										{#if editingItem?.type === 'folder' && editingItem.id === folder.id}
											<Input
												class="h-6 w-full rounded border border-amber-300 focus:ring-2 focus:ring-amber-400"
												autofocus
											/>
										{:else}
											<span class="flex-1 truncate font-medium text-zinc-800 dark:text-zinc-100"
												>{folder.title}</span
											>
										{/if}
									</button>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger
											class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-amber-100 group-hover:opacity-100 dark:hover:bg-amber-800/40"
										>
											<MoreVertical class="h-4 w-4" />
										</DropdownMenu.Trigger>
										<DropdownMenu.Content
											class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
										>
											<DropdownMenu.Item
												onclick={() => editItem('folder', folder.id, folder.title)}
											>
												<Edit class="mr-2 h-4 w-4" /> 重命名
											</DropdownMenu.Item>
											<DropdownMenu.Item
												class="text-destructive"
												onclick={() => deleteItem('folder', folder.id)}
											>
												<Trash2 class="mr-2 h-4 w-4" /> 删除
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</div>
								{#if folder.expanded}
									<div class="ml-5 border-l border-dashed pl-2.5">
										{#each folder.files as file (file.id)}
											<div
												class="flex items-center gap-2 py-1 text-xs text-zinc-600 dark:text-zinc-300"
											>
												<Image class="h-4 w-4 text-amber-400" />
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
		{/if}
		<Card.Root class="flex-1 h-full min-w-0">
			<Card.Content class="h-full flex-1 min-h-0">
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
						<BookMarked class="mb-2 h-16 w-16 text-zinc-300 dark:text-zinc-700" />
						<p class="text-lg font-semibold">请选择左侧文章进行编辑</p>
						<p class="text-sm">点击“新建章节”或“新建文章”开始创作吧！</p>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>

<style>
	.editor-bg {
		font-family: 'Inter', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
	}
	.sidebar {
		box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.04);
	}
	.editor-content {
		box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.08);
		transition: box-shadow 0.2s;
	}
	.editor-content:focus-within {
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
