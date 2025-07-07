<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { toggleMode } from 'mode-watcher';
	import { getUserInfo, type UserInfo } from '$lib/api/user_request';
	import { onMount } from 'svelte';
	import { NavigationMenu } from 'bits-ui';
	import NavHeader from '$lib/components/nav-header.svelte';
	import NavFooter from '$lib/components/nav-footer.svelte';
	import { getPublicArticleList } from '$lib/api/article_request';
	import { goto } from '$app/navigation';

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

	import type { PageServerData } from './$types';
	import type { ApiArticle } from '$lib/api/response_schema';

	const { data: pageServerData } = $props();
	let userInfo: UserInfo | null = pageServerData.userinfo;
	let articles: ApiArticle[] = $state([]);

	onMount(async () => {
		const resp = await getPublicArticleList(1, 10);
		if (resp.code === 200 && resp.data) {
			articles = resp.data;
		}
	});
</script>

<div class="flex min-h-screen flex-col">
	<NavHeader />

	<!-- 背景横幅 -->
	<div class="relative -mt-16 min-h-screen bg-gray-900">
		<img
			src={userInfo?.user_background || '/images/placeholder.jpg'}
			alt="Banner"
			class="h-screen w-full object-cover opacity-70"
		/>
		<div class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
			<h2 class="mb-4 text-4xl font-bold text-white drop-shadow-lg">
				{userInfo?.user_signature || '此时我需要三缄其口'}
			</h2>
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
					<Card class="transition-shadow hover:shadow-lg cursor-pointer" onclick={() => goto(`/article/${article.id}`)}>
						<div class="flex">
							<img src={'/covers/sveltekit.jpg'} alt="Cover" class="h-32 w-32 rounded-l-lg object-cover" />
							<div class="flex-1 p-6">
								<div class="mb-2 flex items-center justify-between">
									<CardTitle>{article.title}</CardTitle>
								</div>
								<p class="mb-4 text-muted-foreground">{article.content?.slice(0, 40) || ''}</p>
								<div class="flex items-center space-x-4 text-sm text-muted-foreground">
									<span>{article.inserted_at?.slice(0, 10) || ''}</span>
								</div>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	</main>
</div>
