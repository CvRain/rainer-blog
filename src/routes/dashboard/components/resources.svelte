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

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-3xl font-bold tracking-tight">资源管理</h2>
	<Button>
		<Plus class="mr-2 h-4 w-4" />
		新建集合
	</Button>
</div>
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each collections as collection}
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<CardTitle>{collection.name}</CardTitle>
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
				<CardDescription>{collection.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1">
							<p class="text-sm font-medium">文件数</p>
							<p class="text-2xl font-bold">{collection.fileCount}</p>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-medium">总大小</p>
							<p class="text-2xl font-bold">{collection.totalSize}</p>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm font-medium">文件列表</p>
						<div class="space-y-2">
							{#each collection.files as file}
								<div class="flex items-center justify-between rounded-lg border p-2">
									<div>
										<p class="text-sm font-medium">{file.name}</p>
										<p class="text-xs text-muted-foreground">
											{file.type} · {file.size}
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
					最后更新：{collection.lastUpdated}
				</p>
			</CardFooter>
		</Card>
	{/each}
</div>