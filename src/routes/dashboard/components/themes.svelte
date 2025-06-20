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
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-svelte';

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
</script>

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-3xl font-bold tracking-tight">主题管理</h2>
	<Button>
		<Plus class="mr-2 h-4 w-4" />
		新建主题
	</Button>
</div>
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each themes as theme}
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<CardTitle>{theme.title}</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost" size="icon">
								<MoreHorizontal class="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Eye class="mr-2 h-4 w-4" />
								查看
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Edit class="mr-2 h-4 w-4" />
								编辑
							</DropdownMenuItem>
							<DropdownMenuItem class="text-destructive">
								<Trash2 class="mr-2 h-4 w-4" />
								删除
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<CardDescription>{theme.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1">
							<p class="text-sm font-medium">章节数</p>
							<p class="text-2xl font-bold">{theme.chapterCount}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium">文章数</p>
							<p class="text-2xl font-bold">{theme.articleCount}</p>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-medium">章节列表</p>
						<div class="space-y-2">
							{#each theme.chapters as chapter}
								<div class="flex items-center justify-between rounded-lg border p-2">
									<div>
										<p class="text-sm font-medium">{chapter.title}</p>
										<p class="text-xs text-muted-foreground">
											{chapter.articleCount} 篇文章
										</p>
									</div>
									<Button variant="ghost" size="icon">
										<Edit class="h-4 w-4" />
									</Button>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<p class="text-sm text-muted-foreground">
					最后更新：{theme.lastUpdated}
				</p>
			</CardFooter>
		</Card>
	{/each}
</div>