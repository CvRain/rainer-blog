<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { NavigationMenu } from 'bits-ui';
	import { toggleMode } from 'mode-watcher';
	import {
		LayoutDashboard,
		BookOpen,
		Image,
		Menu,
		Sun,
		Moon,
		Search,
		MessageSquare,
		HelpCircle
	} from 'lucide-svelte';
	import { getUserInfo, type UserInfo } from '$lib/api/user_request';
	import { onMount } from 'svelte';
	import Overview from './components/overview.svelte';
	import Themes from './components/themes.svelte';
	import Resources from './components/resources.svelte';

	let userInfo: UserInfo | null = $state(null);
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

	function handleTabChange(event: Event, tab: string) {
		event.preventDefault();
		activeTab = tab;
	}
</script>

<div class="flex min-h-screen flex-col">
	<!-- 顶部导航栏 -->
	<nav class="sticky top-2 z-50 mx-4 rounded-xl border bg-background/80 shadow-sm backdrop-blur-sm">
		<div class="mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-14 items-center justify-between">
				<div class="flex items-center space-x-4">
					<Button variant="ghost" size="icon" onclick={() => (isSidebarOpen = !isSidebarOpen)}>
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
						onclick={(e) => handleTabChange(e, item.href.slice(1))}
					>
						<item.icon class="h-5 w-5" />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</aside>

		<!-- 主内容区 -->
		<main class="ml-64 flex-1 p-6">
			<div class="container mx-auto">
				{#if activeTab === 'overview'}
					<Overview />
				{:else if activeTab === 'themes'}
					<Themes />
				{:else if activeTab === 'resources'}
					<Resources />
				{/if}
			</div>
		</main>
	</div>
</div>
