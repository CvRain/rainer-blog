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
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { getUserInfo, type UserInfo } from '$lib/api/user_request';
	import { onMount } from 'svelte';
	import { NavigationMenu } from 'bits-ui';
	import { toggleMode } from 'mode-watcher';
	import {
		LayoutDashboard,
		BookOpen,
		Settings,
		User,
		BarChart3,
		Bell,
		Search,
		Menu,
		Sun,
		Moon,
		FolderOpen,
		FileText,
		Image,
		Plus,
		MoreHorizontal,
		Eye,
		Edit,
		Trash2,
		HelpCircle,
		MessageSquare
	} from 'lucide-svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	let userInfo = $state<UserInfo>();
	let isSidebarOpen = $state(true);
	let activeTab = $state('overview');

	onMount(async () => {
		const result = await getUserInfo();
		if (result.code === 200) {
			userInfo = result.data;
		} else {
			console.error(result.message);
		}
	});

	const menuItems = [
		{ icon: LayoutDashboard, label: '概览', href: '#overview' },
		{ icon: BookOpen, label: '主题管理', href: '#themes' },
		{ icon: Image, label: '资源管理', href: '#resources' }
	];

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

<div class="flex min-h-screen flex-col">
	<!-- 顶部导航栏 -->
	<nav class="sticky top-2 z-50 mx-4 rounded-xl border bg-background/80 backdrop-blur-sm shadow-sm">
		<div class="mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-14 items-center justify-between">
				<div class="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						onclick={() => (isSidebarOpen = !isSidebarOpen)}
					>
						<Menu class="h-5 w-5" />
					</Button>
					<div class="flex items-center space-x-2">
						<Avatar class="h-8 w-8">
							<AvatarImage src={userInfo?.user_avatar} alt={userInfo?.user_name} />
							<AvatarFallback>{userInfo?.user_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<span class="font-bold">{userInfo?.user_name || '用户'}</span>
					</div>
				</div>

				<NavigationMenu.Root class="flex flex-1 justify-end">
					<NavigationMenu.List class="flex space-x-1">
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<div class="relative">
									<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<input
										type="search"
										placeholder="搜索..."
										class="h-9 w-[200px] rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									/>
								</div>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<Button variant="ghost" size="icon">
									<MessageSquare class="h-5 w-5" />
								</Button>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<Button variant="ghost" size="icon">
									<HelpCircle class="h-5 w-5" />
								</Button>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<Button onclick={toggleMode} variant="outline" size="icon">
									<Sun
										class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
									/>
									<Moon
										class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
									/>
									<span class="sr-only">切换主题</span>
								</Button>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
					</NavigationMenu.List>
				</NavigationMenu.Root>
			</div>
		</div>
	</nav>

	<div class="flex flex-1">
		<!-- 侧边栏 -->
		<aside
			class="fixed inset-y-0 left-0 z-40 mt-20 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out {isSidebarOpen
				? 'translate-x-0'
				: '-translate-x-full'}"
		>
			<nav class="space-y-1 p-4">
				{#each menuItems as item}
					<a
						href={item.href}
						class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						on:click|preventDefault={() => (activeTab = item.href.slice(1))}
					>
						<svelte:component this={item.icon} class="h-5 w-5" />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</aside>

		<!-- 主内容区 -->
		<main class="flex-1 p-6 ml-64">
			<div class="container mx-auto">
				{#if activeTab === 'overview'}
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle class="text-sm font-medium">总访问量</CardTitle>
								<BarChart3 class="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div class="text-2xl font-bold">12,234</div>
								<p class="text-xs text-muted-foreground">+20.1% 较上月</p>
							</CardContent>
						</Card>
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
				{:else if activeTab === 'themes'}
					<div class="flex items-center justify-between mb-6">
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
											<DropdownMenuTrigger asChild>
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
				{:else if activeTab === 'resources'}
					<div class="flex items-center justify-between mb-6">
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
											<DropdownMenuTrigger asChild>
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
				{/if}
			</div>
		</main>
	</div>
</div>
