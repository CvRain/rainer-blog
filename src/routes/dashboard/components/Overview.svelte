<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
		CardDescription,
		CardFooter
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { FolderOpen, FileText, Image, Eye, Edit } from 'lucide-svelte';

	// 模拟数据
	const themes = [
		{
			id: 1,
			title: 'Web开发基础',
			description: '涵盖HTML、CSS和JavaScript的基础知识',
			chapterCount: 5,
			articleCount: 15,
			lastUpdated: '2024-03-15',
			chapters: [
				{
					id: 1,
					title: 'HTML基础',
					articleCount: 5,
					lastUpdated: '2024-03-15'
				},
				{
					id: 2,
					title: 'CSS样式',
					articleCount: 4,
					lastUpdated: '2024-03-14'
				},
				{
					id: 3,
					title: 'JavaScript入门',
					articleCount: 6,
					lastUpdated: '2024-03-13'
				}
			]
		},
		{
			id: 2,
			title: 'Svelte框架教程',
			description: '从入门到精通的Svelte学习指南',
			chapterCount: 3,
			articleCount: 8,
			lastUpdated: '2024-03-14',
			chapters: [
				{
					id: 1,
					title: 'Svelte基础',
					articleCount: 3,
					lastUpdated: '2024-03-14'
				},
				{
					id: 2,
					title: '组件开发',
					articleCount: 3,
					lastUpdated: '2024-03-13'
				},
				{
					id: 3,
					title: '状态管理',
					articleCount: 2,
					lastUpdated: '2024-03-12'
				}
			]
		}
	];

	const collections = [
		{
			id: 1,
			name: 'UI设计资源',
			description: '包含各种UI组件和设计素材',
			fileCount: 24,
			totalSize: '156MB',
			lastUpdated: '2024-03-15',
			files: [
				{
					id: 1,
					name: '按钮组件',
					type: 'image',
					size: '2.5MB',
					lastUpdated: '2024-03-15'
				},
				{
					id: 2,
					name: '图标集',
					type: 'svg',
					size: '1.8MB',
					lastUpdated: '2024-03-14'
				}
			]
		},
		{
			id: 2,
			name: '项目文档',
			description: '项目相关的文档和说明',
			fileCount: 12,
			totalSize: '45MB',
			lastUpdated: '2024-03-14',
			files: [
				{
					id: 1,
					name: 'API文档',
					type: 'pdf',
					size: '3.2MB',
					lastUpdated: '2024-03-14'
				},
				{
					id: 2,
					name: '开发规范',
					type: 'doc',
					size: '1.5MB',
					lastUpdated: '2024-03-13'
				}
			]
		}
	];
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
	<Card>
		<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle class="text-sm font-medium">主题数</CardTitle>
			<FolderOpen class="h-4 w-4 text-muted-foreground" />
		</CardHeader>
		<CardContent>
			<div class="text-2xl font-bold">{themes.length}</div>
			<p class="text-xs text-muted-foreground">+1 本周新增</p>
		</CardContent>
	</Card>
	<Card>
		<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle class="text-sm font-medium">文章数</CardTitle>
			<FileText class="h-4 w-4 text-muted-foreground" />
		</CardHeader>
		<CardContent>
			<div class="text-2xl font-bold">23</div>
			<p class="text-xs text-muted-foreground">+5 本周新增</p>
		</CardContent>
	</Card>
	<Card>
		<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle class="text-sm font-medium">资源集合</CardTitle>
			<Image class="h-4 w-4 text-muted-foreground" />
		</CardHeader>
		<CardContent>
			<div class="text-2xl font-bold">{collections.length}</div>
			<p class="text-xs text-muted-foreground">+2 本周新增</p>
		</CardContent>
	</Card>
</div>

<div class="mt-6 grid gap-4 md:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle>最近更新的主题</CardTitle>
			<CardDescription>查看最近更新的主题内容</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				{#each themes as theme}
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<p class="text-sm font-medium leading-none">{theme.title}</p>
							<p class="text-sm text-muted-foreground">
								{theme.chapterCount} 章节 · {theme.articleCount} 文章
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<Button variant="ghost" size="icon">
								<Eye class="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon">
								<Edit class="h-4 w-4" />
							</Button>
						</div>
					</div>
					{#if theme !== themes[themes.length - 1]}
						<Separator />
					{/if}
				{/each}
			</div>
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>资源集合</CardTitle>
			<CardDescription>管理您的资源文件集合</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				{#each collections as collection}
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<p class="text-sm font-medium leading-none">{collection.name}</p>
							<p class="text-sm text-muted-foreground">
								{collection.fileCount} 文件 · {collection.totalSize}
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<Button variant="ghost" size="icon">
								<Eye class="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon">
								<Edit class="h-4 w-4" />
							</Button>
						</div>
					</div>
					{#if collection !== collections[collections.length - 1]}
						<Separator />
					{/if}
				{/each}
			</div>
		</CardContent>
	</Card>
</div>