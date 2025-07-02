<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
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
	import Preview from './components/preview.svelte';

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
	let splitDirection = $state<'horizontal' | 'vertical'>('vertical');
	let editingItem: { type: string; id: number } | null = $state(null);
	let editingText = $state('');
	const fileUploadInput: { current: HTMLInputElement | null } = { current: null };

	// --- Functions ---
	function createNew(
		type: 'chapter' | 'article' | 'folder',
		parent?: Chapter | ResourceFolder
	) {
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

	function toggleSplitDirection() {
		splitDirection = splitDirection === 'vertical' ? 'horizontal' : 'vertical';
	}

	onMount(() => {
		if (theme.chapters[0]?.articles[0]) {
			selectedArticle = theme.chapters[0].articles[0];
		}
	});
</script>

<div class="flex h-screen flex-col bg-background text-foreground">
	<header class="flex h-14 shrink-0 items-center border-b px-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleSidebar} title="Toggle sidebar">
				<PanelLeft class="h-5 w-5" />
			</Button>
			<h1 class="text-lg font-semibold">{theme.title}</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleSplitDirection} title="切换分栏方向">
				{#if splitDirection === 'vertical'}
					<PanelRight class="h-5 w-5" />
				{:else}
					<PanelTop class="h-5 w-5" />
				{/if}
			</Button>
		</div>
	</header>

	<Resizable.PaneGroup direction="horizontal" class="flex-1">
		{#if !sidebarCollapsed}
			<Resizable.Pane defaultSize={20} minSize={15} class="min-w-[240px]">
				<ScrollArea class="h-full p-2">
					<!-- Chapters & Articles -->
					<div class="mb-4">
						<div class="mb-2 flex items-center justify-between px-2 py-1">
							<h2 class="text-sm font-semibold tracking-tight text-muted-foreground">大纲</h2>
							<Button
								variant="ghost"
								size="icon"
								class="h-7 w-7"
								onclick={() => createNew('chapter')}
								title="新建章节"
							>
								<Plus class="h-4 w-4" />
							</Button>
						</div>
						{#each theme.chapters as chapter (chapter.id)}
							<div>
								<div
									class="group flex w-full items-center gap-1 rounded-md py-1 pr-1 text-sm hover:bg-accent"
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
												class="h-6 w-full"
												value={editingText}
												onblur={handleRename}
												onkeydown={(e) => e.key === 'Enter' && handleRename(e)}
												autofocus
											/>
										{:else}
											<span class="flex-1 truncate">{chapter.title}</span>
										{/if}
									</button>

									<DropdownMenu.Root>
										<DropdownMenu.Trigger
											class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-accent-foreground/10"
										>
											<MoreVertical class="h-4 w-4" />
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
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
												class="group flex w-full items-center gap-1.5 rounded-md py-1 pr-1 pl-2 text-sm"
												class:bg-accent={selectedArticle?.id === article.id}
											>
												<button
													class="flex flex-1 items-center gap-1.5 text-left"
													class:text-accent-foreground={selectedArticle?.id === article.id}
													onclick={() => (selectedArticle = article)}
												>
													<FileText class="h-4 w-4 shrink-0 text-muted-foreground" />
													{#if editingItem?.type === 'article' && editingItem.id === article.id}
														<Input
															class="h-6 w-full"
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
														class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-accent-foreground/10"
													>
														<MoreVertical class="h-4 w-4" />
													</DropdownMenu.Trigger>
													<DropdownMenu.Content>
														<DropdownMenu.Item
															onclick={() => editItem('article', article.id, article.title)}
														>
															<Edit class="mr-2 h-4 w-4" /> 重命名
														</DropdownMenu.Item>
														<DropdownMenu.Item
															class="text-destructive"
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
							<h2 class="text-sm font-semibold tracking-tight text-muted-foreground">
								资源文件
							</h2>
							<Button
								variant="ghost"
								size="icon"
								class="h-7 w-7"
								onclick={() => createNew('folder')}
								title="新建文件夹"
							>
								<Plus class="h-4 w-4" />
							</Button>
						</div>
						<input type="file" bind:this={fileUploadInput.current} class="hidden" multiple />
						{#each theme.resources as folder (folder.id)}
							<div>
								<div
									class="group flex w-full items-center gap-1 rounded-md py-1 pr-1 text-sm hover:bg-accent"
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
												class="h-6 w-full"
												value={editingText}
												onblur={handleRename}
												onkeydown={(e) => e.key === 'Enter' && handleRename(e)}
												autofocus
											/>
										{:else}
											<span class="flex-1 truncate">{folder.title}</span>
										{/if}
									</button>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger
											class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-accent-foreground/10"
										>
											<MoreVertical class="h-4 w-4" />
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Item onclick={() => triggerFileUpload(folder)}>
												<UploadCloud class="mr-2 h-4 w-4" /> 上传文件
											</DropdownMenu.Item>
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
												class="group flex w-full items-center gap-1.5 rounded-md py-1 pr-1 pl-2 text-sm hover:bg-accent"
											>
												<Image class="h-4 w-4 shrink-0 text-muted-foreground" />
												{#if editingItem?.type === 'file' && editingItem.id === file.id}
													<Input
														class="h-6 w-full flex-1"
														value={editingText}
														onblur={handleRename}
														onkeydown={(e) => e.key === 'Enter' && handleRename(e)}
														autofocus
													/>
												{:else}
													<span class="flex-1 truncate">{file.title}</span>
												{/if}
												<DropdownMenu.Root>
													<DropdownMenu.Trigger
														class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-accent-foreground/10"
													>
														<MoreVertical class="h-4 w-4" />
													</DropdownMenu.Trigger>
													<DropdownMenu.Content>
														<DropdownMenu.Item
															onclick={() => editItem('file', file.id, file.title)}
														>
															<Edit class="mr-2 h-4 w-4" /> 重命名
														</DropdownMenu.Item>
														<DropdownMenu.Item
															class="text-destructive"
															onclick={() => deleteItem('file', file.id, folder)}
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
				</ScrollArea>
			</Resizable.Pane>
		{/if}

		<Resizable.Handle withHandle />

		<Resizable.Pane defaultSize={80}>
			<Resizable.PaneGroup direction={splitDirection} class="h-full w-full">
				<Resizable.Pane defaultSize={50} minSize={20}>
					{#if selectedArticle}
						<Editor bind:article={selectedArticle} />
					{:else}
						<div
							class="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"
						>
							<BookMarked class="h-10 w-10" />
							<span class="text-lg">请选择一篇文章开始编辑</span>
						</div>
					{/if}
				</Resizable.Pane>
				<Resizable.Handle withHandle />
				<Resizable.Pane defaultSize={50} minSize={20}>
					{#if selectedArticle}
						<Preview article={selectedArticle} />
					{:else}
						<div
							class="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"
						>
							<BookMarked class="h-10 w-10" />
							<span class="text-lg">预览区域</span>
						</div>
					{/if}
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
