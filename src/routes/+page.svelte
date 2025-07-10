<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
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
		<div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
		<div class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
			<h2 class="mb-4 text-4xl font-bold text-white drop-shadow-lg">
				{userInfo?.user_signature || '此时我需要三缄其口'}
			</h2>
			<div class="flex space-x-6">
				<Button variant="ghost" size="sm" class="text-white hover:bg-white/20 transition">
					<GithubIcon class="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="sm" class="text-white hover:bg-white/20 transition">
					<Video class="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="sm" class="text-white hover:bg-white/20 transition">
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
				<Card class="rounded-2xl border border-gray-200 bg-white/80 shadow-lg">
					<CardHeader>
						<Avatar class="mx-auto h-28 w-28 border-4 border-white shadow-lg -mt-10">
							<AvatarImage src={userInfo?.user_avatar || '/images/avatar.png'} />
							<AvatarFallback>ME</AvatarFallback>
						</Avatar>
						<CardTitle class="mt-4 text-center text-xl font-bold text-gray-800">{userInfo?.user_name || '技术创作者'}</CardTitle>
						<CardContent class="text-center text-base text-gray-500">
							{userInfo?.user_signature || '全栈开发者 | 开源爱好者'}
							<div class="mt-4 space-y-2">
								<div class="flex items-center justify-center text-gray-400">
									<Mail class="mr-2 h-4 w-4" />
									{userInfo?.user_email || 'contact@example.com'}
								</div>
							</div>
						</CardContent>
					</CardHeader>
				</Card>

				<Card class="rounded-2xl border border-gray-200 bg-white/80 shadow-lg">
					<CardHeader>
						<CardTitle class="text-gray-800">友情链接</CardTitle>
					</CardHeader>
					<CardContent class="space-y-2">
						<div class="flex items-center rounded p-2 hover:bg-accent/50 transition">
							<Linkedin class="mr-2 h-4 w-4 text-blue-600" />
							<span class="text-sm text-gray-700">技术社区</span>
						</div>
						<!-- 更多链接... -->
					</CardContent>
				</Card>
			</div>

			<!-- 右侧文章列表 -->
			<div class="space-y-6 md:col-span-2">
				{#each articles as article}
					<Card
						class="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-lg transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl"
						onclick={() => goto(`/article/${article.id}`)}
					>
						<!-- 背景图片 -->
						<div class="absolute inset-0 h-full w-full">
							<img
								src={'/images/article-cover.png'}
								alt="Cover"
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								draggable="false"
							/>
							<!-- 右下角圆形完整显示（带模糊过渡） -->
							<div
								class="absolute"
								style="
									right: 0;
									bottom: 0;
									width: 66.66%;
									height: 66.66%;
									clip-path: circle(33.33% at 100% 100%);
									overflow: hidden;
									pointer-events: none;
									z-index: 2;
								"
							>
								<!-- 底层：清晰图片 -->
								<img
									src={'/images/article-cover.png'}
									alt="Cover"
									class="absolute inset-0 h-full w-full object-cover"
									draggable="false"
								/>
								<!-- 顶层：模糊图片 + 渐变遮罩 -->
								<img
									src={'/images/article-cover.png'}
									alt="Cover"
									class="absolute inset-0 h-full w-full object-cover"
									style="
										filter: blur(12px);
										mask-image: radial-gradient(circle at 100% 100%, transparent 0%, transparent 33%, black 60%, black 100%);
										-webkit-mask-image: radial-gradient(circle at 100% 100%, transparent 0%, transparent 33%, black 60%, black 100%);
									"
									draggable="false"
								/>
							</div>
							<!-- 渐变遮罩 -->
							<div
								class="absolute inset-0"
								style="
									background: radial-gradient(circle at 100% 100%, rgba(0,0,0,0) 33%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.7) 100%);
									z-index: 3;
								"
							></div>
						</div>
						<!-- 文字内容 -->
						<div class="relative z-10 flex h-full flex-col justify-end p-6">
							<div class="mb-2 flex items-center justify-between">
								<CardTitle class="text-lg font-bold text-white drop-shadow-lg">{article.title}</CardTitle>
							</div>
							<p class="mb-4 text-sm text-white/80 drop-shadow">{article.content?.slice(0, 40) || ''}</p>
							<div class="flex items-center space-x-4 text-xs text-white/60">
								<span>{article.inserted_at?.slice(0, 10) || ''}</span>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	</main>
</div>
