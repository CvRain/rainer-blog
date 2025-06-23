<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import {
		ResizableHandle,
		ResizablePanel,
		ResizablePanelGroup
	} from '$lib/components/ui/resizable';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { ChevronDown, ChevronRight, FileText, FolderClosed, FolderOpen, Image } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Editor from './components/Editor.svelte';
	import Preview from './components/Preview.svelte';

	// 模拟主题数据
	let theme = {
		id: $page.params.id,
		title: 'Web开发基础',
		description: '涵盖HTML、CSS和JavaScript的基础知识',
		chapters: [
			{
				id: 1,
				title: 'HTML基础',
				expanded: true,
				articles: [
					{
						id: 1,
						title: 'HTML简介',
						content: '# HTML简介\n\nHTML是一种用于创建网页的标准标记语言...'
					},
					{
						id: 2,
						title: 'HTML标签',
						content: '# HTML标签\n\n本章节介绍常用的HTML标签...'
					}
				]
			},
			{
				id: 2,
				title: 'CSS样式',
				expanded: false,
				articles: [
					{
						id: 3,
						title: 'CSS选择器',
						content: '# CSS选择器\n\nCSS选择器用于选择要设置样式的HTML元素...'
					}
				]
			}
		],
		resources: [
			{
				id: 1,
				title: '示例图片',
				type: 'image',
				url: '/images/example.png'
			},
			{
				id: 2,
				title: '代码示例',
				type: 'code',
				url: '/examples/code.html'
			}
		]
	};

	let selectedArticle = $state(null);
	let selectedChapter = $state(null);

	function toggleChapter(chapter) {
		chapter.expanded = !chapter.expanded;
		theme = theme; // 触发更新
	}

	function selectArticle(chapter, article) {
		selectedChapter = chapter;
		selectedArticle = article;
	}

	onMount(async () => {
		// TODO: 从API获取主题数据
		// const response = await fetch(`/api/themes/${$page.params.id}`);
		// theme = await response.json();
	});
</script>

<div class="flex h-screen flex-col">
	<header class="flex h-14 items-center border-b px-6">
		<div class="flex items-center gap-4">
			<h1 class="text-lg font-semibold">{theme.title}</h1>
			<span class="text-sm text-muted-foreground">{theme.description}</span>
		</div>
	</header>

	<ResizablePanelGroup class="flex-1">
		<!-- 左侧边栏 -->
		<ResizablePanel defaultSize={20} minSize={15}>
			<div class="flex h-full flex-col">
				<div class="flex items-center justify-between p-2">
					<h2 class="text-sm font-semibold">大纲</h2>
					<Button variant="ghost" size="icon">
						<ChevronDown class="h-4 w-4" />
					</Button>
				</div>
				<ScrollArea class="flex-1">
					<div class="p-2">
						{#each theme.chapters as chapter}
							<div class="mb-2">
								<button
									class="flex w-full items-center gap-1 rounded p-1 text-sm hover:bg-accent"
									on:click={() => toggleChapter(chapter)}
								>
									{#if chapter.expanded}
										<ChevronDown class="h-4 w-4" />
										<FolderOpen class="h-4 w-4" />
									{:else}
										<ChevronRight class="h-4 w-4" />
										<FolderClosed class="h-4 w-4" />
									{/if}
									<span>{chapter.title}</span>
								</button>
								{#if chapter.expanded}
									<div class="ml-4 mt-1">
										{#each chapter.articles as article}
											<button
												class="flex w-full items-center gap-2 rounded p-1 text-sm hover:bg-accent {selectedArticle ===
												article
													? 'bg-accent'
													: ''}"
												on:click={() => selectArticle(chapter, article)}
											>
												<FileText class="h-4 w-4" />
												<span>{article.title}</span>
											</button>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
						<Separator class="my-2" />
						<div class="mb-2">
							<div class="flex items-center gap-1 p-1 text-sm">
								<Image class="h-4 w-4" />
								<span>资源文件</span>
							</div>
							{#each theme.resources as resource}
								<div class="ml-4 mt-1 flex items-center gap-2 rounded p-1 text-sm hover:bg-accent">
									<FileText class="h-4 w-4" />
									<span>{resource.title}</span>
								</div>
							{/each}
						</div>
					</div>
				</ScrollArea>
			</div>
		</ResizablePanel>

		<ResizableHandle />

		<!-- 右侧编辑区 -->
		<ResizablePanel defaultSize={80}>
			{#if selectedArticle}
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={50}>
						<Editor article={selectedArticle} />
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={50}>
						<Preview article={selectedArticle} />
					</ResizablePanel>
				</ResizablePanelGroup>
			{:else}
				<div class="flex h-full items-center justify-center text-muted-foreground">
					请选择一篇文章进行编辑
				</div>
			{/if}
		</ResizablePanel>
	</ResizablePanelGroup>
</div> 