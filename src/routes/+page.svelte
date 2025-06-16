<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { toggleMode } from 'mode-watcher';
	import { getUserInfo, type UserInfo } from '$lib/api/user_request';
	import { onMount } from 'svelte';
	import { NavigationMenu } from 'bits-ui';

	import {
		BookOpen,
		Archive,
		LayoutGrid,
		LogIn,
		Mail,
		Linkedin,
		GithubIcon,
		Video,
		Sun,
		Moon
	} from 'lucide-svelte';

	let userInfo: UserInfo | null = null;
	onMount(async () => {
        const result = await getUserInfo();
        if(result.code === 200){
            userInfo = result.data;
        }
        else  {
            console.error(result.message)
        }
	});

	const articles = [
		{
			id: 1,
			title: 'SvelteKit深度实践指南',
			excerpt: '从项目搭建到部署的全流程解析...',
			date: '2024-03-20',
			cover: '/covers/sveltekit.jpg',
			views: 1234,
			tags: ['前端', '教程']
		}
		// 更多文章...
	];
</script>

<div class="flex min-h-screen flex-col">
	<!-- 导航栏 -->
	<nav class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
		<div class="mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center space-x-2">
					<Avatar class="h-8 w-8">
						<AvatarImage src={userInfo?.user_avatar || '/images/avatar.png'} />
						<AvatarFallback>CR</AvatarFallback>
					</Avatar>
					<span class="font-bold">{userInfo?.user_name || 'ClaudeRainer'}</span>
				</div>

				<NavigationMenu.Root class="flex flex-1 justify-end">
					<NavigationMenu.List class="flex space-x-1">
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<Button variant="ghost">
									<BookOpen class="mr-2 h-4 w-4" />
									首页
								</Button>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<Button variant="ghost">
									<Archive class="mr-2 h-4 w-4" />
									归档
								</Button>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<Button variant="ghost">
									<LayoutGrid class="mr-2 h-4 w-4" />
									分类
								</Button>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								<Button variant="ghost" href="/login">
									<LogIn class="mr-2 h-4 w-4" />
									登录
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
									<span class="sr-only">Toggle theme</span>
								</Button>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
					</NavigationMenu.List>
				</NavigationMenu.Root>
			</div>
		</div>
	</nav>

	<!-- 背景横幅 -->
	<div class="relative min-h-screen bg-gray-900">
		<img
			src={userInfo?.user_bacground || '/images/placeholder.jpg'}
			alt="Banner"
			class="h-screen w-full object-cover opacity-70"
		/>
		<div class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
			<h2 class="mb-4 text-4xl font-bold text-white drop-shadow-lg">{userInfo?.user_signature || "此时我需要三缄其口"}</h2>
			<div class="flex space-x-6">
				<Button variant="ghost" size="sm" class="text-white hover:bg-white/10">
					<GithubIcon class="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="sm" class="text-white hover:bg-white/10">
					<Video class="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="sm" class="text-white hover:bg-white/10">
					<Mail class="h-5 w-5" />
				</Button>
			</div>
		</div>
	</div>

	<!-- 主体内容 -->
	<main class="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-8 md:grid-cols-3">
			<!-- 左侧个人介绍 -->
			<div class="space-y-6 md:col-span-1">
				<Card>
					<CardHeader>
						<Avatar class="mx-auto h-24 w-24">
							<AvatarImage src={userInfo?.user_avatar || '/images/avatar.png'} />
							<AvatarFallback>ME</AvatarFallback>
						</Avatar>
						<CardTitle class="mt-4 text-center">{userInfo?.user_name || '技术创作者'}</CardTitle>
						<CardContent class="text-center text-sm text-muted-foreground">
							{userInfo?.user_signature || '全栈开发者 | 开源爱好者'}
							<div class="mt-4 space-y-2">
								<div class="flex items-center">
									<Mail class="mr-2 h-4 w-4" />
									{userInfo?.user_email || 'contact@example.com'}
								</div>
							</div>
						</CardContent>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>友情链接</CardTitle>
					</CardHeader>
					<CardContent class="space-y-2">
						<div class="flex items-center rounded p-2 hover:bg-accent/50">
							<Linkedin class="mr-2 h-4 w-4" />
							<span class="text-sm">技术社区</span>
						</div>
						<!-- 更多链接... -->
					</CardContent>
				</Card>
			</div>

			<!-- 右侧文章列表 -->
			<div class="space-y-6 md:col-span-2">
				{#each articles as article}
					<Card class="transition-shadow hover:shadow-lg">
						<div class="flex">
							<img src={article.cover} alt="Cover" class="h-32 w-32 rounded-l-lg object-cover" />
							<div class="flex-1 p-6">
								<div class="mb-2 flex items-center justify-between">
									<CardTitle>{article.title}</CardTitle>
									<div class="flex space-x-2">
										{#each article.tags as tag}
											<span class="rounded-full bg-accent px-2 py-1 text-xs">{tag}</span>
										{/each}
									</div>
								</div>
								<p class="mb-4 text-muted-foreground">{article.excerpt}</p>
								<div class="flex items-center space-x-4 text-sm text-muted-foreground">
									<span>{article.date}</span>
									<span>·</span>
									<span>{article.views} 阅读</span>
								</div>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	</main>

	<!-- 底部 -->
	<footer class="border-t bg-background/50">
		<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-between md:flex-row">
				<div class="mb-4 text-sm text-muted-foreground md:mb-0">
					© 2024 claude rainer · 流荧微源
				</div>
				<div class="flex space-x-4">
					<Button variant="link" size="sm">关于本站</Button>
					<Button variant="link" size="sm">友情链接</Button>
					<Button variant="link" size="sm">RSS订阅</Button>
				</div>
			</div>
		</div>
	</footer>
</div>
