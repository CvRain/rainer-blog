<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
		CardDescription
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
		Moon
	} from 'lucide-svelte';

	let userInfo = $state<UserInfo>();
	let isSidebarOpen = $state(true);

	onMount(async () => {
		const result = await getUserInfo();
		if (result.code === 200) {
			userInfo = result.data;
		} else {
			console.error(result.message);
		}
	});

	const menuItems = [
		{ icon: LayoutDashboard, label: '仪表盘', href: '/dashboard' },
		{ icon: BookOpen, label: '文章管理', href: '/dashboard/articles' },
		{ icon: BarChart3, label: '数据分析', href: '/dashboard/analytics' },
		{ icon: User, label: '用户管理', href: '/dashboard/users' },
		{ icon: Settings, label: '系统设置', href: '/dashboard/settings' }
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
									<Bell class="h-5 w-5" />
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
							<CardTitle class="text-sm font-medium">文章数</CardTitle>
							<BookOpen class="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">45</div>
							<p class="text-xs text-muted-foreground">+2 本周新增</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">活跃用户</CardTitle>
							<User class="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">2,350</div>
							<p class="text-xs text-muted-foreground">+180 本周新增</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">系统状态</CardTitle>
							<Settings class="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">正常</div>
							<p class="text-xs text-muted-foreground">系统运行良好</p>
						</CardContent>
					</Card>
				</div>

				<div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card class="col-span-4">
						<CardHeader>
							<CardTitle>最近活动</CardTitle>
							<CardDescription>查看最近的系统活动记录</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								{#each [1, 2, 3] as item}
									<div class="flex items-center">
										<div class="ml-4 space-y-1">
											<p class="text-sm font-medium leading-none">系统更新</p>
											<p class="text-sm text-muted-foreground">更新了系统配置</p>
										</div>
										<div class="ml-auto font-medium">2小时前</div>
									</div>
									{#if item !== 3}
										<Separator />
									{/if}
								{/each}
							</div>
						</CardContent>
					</Card>
					<Card class="col-span-3">
						<CardHeader>
							<CardTitle>快速操作</CardTitle>
							<CardDescription>常用的管理操作</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="grid gap-2">
								<Button variant="outline" class="justify-start">
									<BookOpen class="mr-2 h-4 w-4" />
									新建文章
								</Button>
								<Button variant="outline" class="justify-start">
									<User class="mr-2 h-4 w-4" />
									用户管理
								</Button>
								<Button variant="outline" class="justify-start">
									<Settings class="mr-2 h-4 w-4" />
									系统设置
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	</div>
</div>
