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
	import type { ApiArticle, ThemeWithSchema } from '$lib/api/response_schema';
	import { getActiveThemeInfo } from '@/api/theme_request';

	const { data: pageServerData } = $props();
	let userInfo: UserInfo | null = pageServerData.userinfo;
	let articles: ApiArticle[] = $state([]);
	let activeThemes: ThemeWithSchema[] = $state([]);
	let hoveredArticleId: string | null = null;

	onMount(async () => {
		let resp: any = await getPublicArticleList(1, 10);
		if (resp.code === 200 && resp.data) {
			articles = resp.data;
		}

		resp = await getActiveThemeInfo();
		if (resp.code === 200 && resp.data) {
			console.log(resp.data);
			activeThemes = resp.data;
		}
	});
</script>

<div class="flex min-h-screen flex-col">
	<NavHeader />

	<!-- 背景横幅 -->
	<div class="relative w-full h-screen bg-gray-900">
		<img
			src={userInfo?.user_background || '/images/placeholder.jpg'}
			alt="Banner"
			class="w-full h-full object-cover"
		/>
		<div class="absolute inset-0 h-full bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
		<div class="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center px-4 text-center">
			<h2 class="mb-4 text-4xl font-bold text-white drop-shadow-lg">
				{userInfo?.user_signature || '此时我需要三缄其口'}
			</h2>
			<div class="flex space-x-6">
				<Button variant="ghost" size="sm" class="text-white transition hover:bg-white/20">
					<GithubIcon class="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="sm" class="text-white transition hover:bg-white/20">
					<Video class="h-5 w-5" />
				</Button>
				<Button variant="ghost" size="sm" class="text-white transition hover:bg-white/20">
					<Mail class="h-5 w-5" />
				</Button>
			</div>
		</div>
	</div>

	<!-- 主体内容区 -->
	<div class="relative z-10 mx-auto flex w-full max-w-7xl flex-1 gap-8 px-6 pb-12 pt-0 md:pt-8">
		<!-- 左侧：用户信息卡片栏 -->
		<div class="w-full max-w-xs flex-shrink-0 space-y-6 md:ml-2 md:w-1/4">
			<Card class="rounded-2xl border border-gray-200 bg-white/80 shadow-lg">
				<CardHeader>
					<Avatar class="mx-auto -mt-10 h-28 w-28 border-4 border-white shadow-lg">
						<AvatarImage src={userInfo?.user_avatar || '/images/avatar.png'} />
						<AvatarFallback>ME</AvatarFallback>
					</Avatar>
					<CardTitle class="mt-4 text-center text-xl font-bold text-gray-800"
						>{userInfo?.user_name || '技术创作者'}</CardTitle
					>
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
					<div class="flex items-center rounded p-2 transition hover:bg-accent/50">
						<Linkedin class="mr-2 h-4 w-4 text-blue-600" />
						<span class="text-sm text-gray-700">技术社区</span>
					</div>
					<!-- 更多链接... -->
				</CardContent>
			</Card>
		</div>

		<!-- 右侧：文章列表和主题卡片 -->
		<div class="flex-1 space-y-8">
			<!-- 文章列表 -->
			<div class="space-y-6">
				{#each [...articles].sort((a, b) => {
					const t1 = new Date(b.updated_at || b.inserted_at || 0).getTime();
					const t2 = new Date(a.updated_at || a.inserted_at || 0).getTime();
					return t1 - t2;
				}) as article}
				<!-- 文章卡片 -->
					<Card
						class="group relative h-[10rem] min-h-[7rem] w-full cursor-pointer overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.8)] shadow-lg transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl"
						onclick={() => goto(`/article/${article.id}`)}
					>
						<!-- 图片：右下角大圆形 -->
						<img
							src={'/images/article-cover.png'}
							alt="Cover"
							class="absolute right-0 bottom-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
							style="clip-path: circle(85% at 100% 100%); z-index: 1;"
							draggable="false"
						/>
						<!-- 暗色模式下的高斯模糊黑色遮罩 -->
						<div class="hidden dark:block absolute right-0 bottom-0 w-full h-full pointer-events-none" style="clip-path: circle(85% at 100% 100%); z-index: 2; background: rgba(0,0,0,0.35); backdrop-filter: blur(1px);"></div>
						<!-- 文字内容：左上角 -->
						<div class="relative z-10 flex flex-col justify-start items-start p-6 h-full">
							<div class="text-lg font-bold text-[hsl(var(--card-foreground))] drop-shadow-lg">{article.title}</div>
							<p class="mt-2 mb-4 text-sm text-[hsl(var(--muted-foreground))] drop-shadow">
								{article.content?.slice(0, 40) || ''}
							</p>
							<div class="flex items-center space-x-4 text-xs text-[hsl(var(--muted-foreground))]">
								<span>最近更新：{article.updated_at?.slice(0, 10) || ''}</span>
							</div>
						</div>
					</Card>
				{/each}
			</div>

			<!-- 分割线 -->
			<div class="my-8 w-full h-px bg-[hsl(var(--border))] opacity-60"></div>

			<!-- 主题卡片区块（无外层Card，参考dashboard样式） -->
			<div>
				{#if activeThemes && activeThemes.length > 0}
					<div class="mt-8 grid gap-4 md:grid-cols-2">
						{#each activeThemes as theme}
							<Card
								class="flex h-[14rem] min-h-[10rem] flex-col justify-between transition hover:shadow-lg"
							>
								<!-- 主题图片横幅 -->
								<div class="w-full h-32 overflow-hidden rounded-t-2xl">
									<img src={'/images/theme-default-cover.png'} alt="cover" class="w-full h-full object-cover" />
								</div>
								<CardHeader>
									<div class="flex items-center justify-between">
										<CardTitle>
											<button
												class="hover:underline"
												onclick={() => {goto(`/theme/${theme.id}`)}}
											>
												{theme.name}
											</button>
										</CardTitle>
									</div>
									<p class="mt-1 text-sm text-gray-500">{theme.description}</p>
								</CardHeader>
								<CardContent>
									<div class="flex gap-6 text-xs text-gray-500">
										<span>创建时间 {theme.inserted_at?.slice(0, 10)}</span>
									</div>
								</CardContent>
							</Card>
						{/each}
					</div>
				{:else}
					<p class="mt-8 text-gray-400">暂无可访问主题</p>
				{/if}
			</div>
		</div>
	</div>
</div>
