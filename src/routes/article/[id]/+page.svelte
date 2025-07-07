<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getArticleDetail } from '$lib/api/article_request';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import NavHeader from '$lib/components/nav-header.svelte';

	let articleId = $page.params.id;
	let articleDetail: any = null;
	let loading = true;
	let error = '';
	let html = '';

	onMount(async () => {
		loading = true;
		error = '';
		const resp = await getArticleDetail(articleId);
		if (resp.code === 200 && resp.data) {
			articleDetail = resp.data;
			html = DOMPurify.sanitize(marked(String(articleDetail.s3_content || '')));
		} else {
			error = resp.message || '加载失败';
		}
		loading = false;
	});
</script>

<div class="article-bg min-h-screen flex flex-col items-center justify-center py-8 px-2 relative">
	<!-- 顶栏 -->
	<NavHeader />
	<!-- 背景图和毛玻璃 -->
	<img src={articleDetail?.user_background || '/images/placeholder.jpg'} alt="Banner" class="article-bg-img" />
	<div class="article-bg-blur"></div>
	<!-- 内容卡片 -->
	<div class="article-container bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-lg p-8 relative z-10">
		{#if loading}
			<div class="text-center text-muted-foreground">加载中...</div>
		{:else if error}
			<div class="text-center text-red-500">{error}</div>
		{:else if articleDetail}
			<h1 class="text-3xl font-bold mb-4">{articleDetail.title}</h1>
			<div class="prose max-w-none dark:prose-invert">
				{@html html}
			</div>
		{/if}
	</div>
</div>

<style>
	.article-bg {
		min-height: 100vh;
		background: transparent;
		position: relative;
		overflow: hidden;
	}
	.article-bg-img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		opacity: 0.7;
		z-index: 0;
	}
	.article-bg-blur {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		backdrop-filter: blur(16px) saturate(1.2);
		background: rgba(255,255,255,0.2);
		z-index: 1;
	}
	.article-container {
		width: 794px; /* A4纸宽度 px */
		min-height: 80vh;
		max-width: 100vw;
		margin: 48px auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		z-index: 10;
	}
	.prose :global(pre) {
		background: #282c34;
		color: #fff;
		border-radius: 0.5rem;
		padding: 1em;
	}
</style>
