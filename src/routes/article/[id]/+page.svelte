<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getArticleDetail } from '$lib/api/article_request';
	import Shiki from '@shikijs/markdown-it';
	import NavHeader from '$lib/components/nav-header.svelte';
	import * as Card from '$lib/components/ui/card';
	import type {ApiArticleDetail } from '@/api/response_schema';
	import 'carta-md/default.css';
	import markdownit from 'markdown-it';
	import MarkdownPreview from '@/components/theme-editor/markdown-preview.svelte';

	let articleId = $page.params.id;
	let articleDetail: ApiArticleDetail | null = $state(null);
	let loading: boolean = $state(false);
	let error: string = $state('');


	onMount(async () => {
		loading = true;
		error = '';
		const resp = await getArticleDetail(articleId);
		if (resp.code === 200 && resp.data) {
			articleDetail = resp.data;
			if (articleDetail.title) {
				document.title = articleDetail.title;
			}
		} else {
			error = resp.message || '加载失败';
		}
		loading = false;
	});

	// Svelte action
	export function html(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			}
		};
	}


</script>

<div class="article-bg relative flex min-h-screen flex-col items-center justify-center px-2 py-8">
	<!-- 顶栏 -->
	<NavHeader/>
	<!-- 背景图和毛玻璃 -->
	<!-- todo 未来添加文章背景图-->
	<img src={'/images/placeholder.jpg'} alt="Banner" class="article-bg-img" />
	<div class="article-bg-blur"></div>
	<!-- 内容卡片 -->
	<Card.Root class="article-card w-1/2 h-full">
		<Card.Header class="relative">
			<Card.Title class="article-title">{articleDetail?.title}</Card.Title>
		</Card.Header>
		<div class="my-2 h-px w-full bg-muted"></div>
		<Card.Content class="article-content-scroll">
			{#if loading}
				<div class="text-center text-muted-foreground">加载中...</div>
			{:else if error}
				<div class="text-center text-red-500">{error}</div>
			{:else if articleDetail}
				<MarkdownPreview markdownText={articleDetail.s3_content}/>
			{/if}
		</Card.Content>
		<Card.Footer>
			<Card.Description>上次更新于：{articleDetail?.updated_at}</Card.Description>
		</Card.Footer>
	</Card.Root>
</div>

<style>
	:global(.article-bg) {
		background: transparent;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.article-bg-img) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		opacity: 0.7;
		z-index: 0;
	}
	:global(.article-bg-blur) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		backdrop-filter: blur(16px) saturate(1.2);
		background: rgba(255, 255, 255, 0.2);
		z-index: 1;
	}
	:global(.article-card) {
		height: 90vh;
		max-width: 100vw;
		margin: 32px auto 0 auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		z-index: 10;
		backdrop-filter: blur(2px);
		border-radius: 1rem;
		box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.08);
		position: relative;
		align-items: stretch;
	}
	:global(.article-title) {
		font-size: 2rem;
		font-weight: bold;
		padding: 2rem 2rem 1rem 2rem;
		background: transparent;
		flex-shrink: 0;
	}
	:global(.article-desc-right) {
		position: absolute;
		right: 2rem;
		top: 2.2rem;
		font-size: 1rem;
		color: #888;
		text-align: right;
	}
	:global(.article-content-scroll) {
		flex: 1 1 0;
		overflow-y: auto;
		padding: 0 2rem 2rem 2rem;
		min-height: 0;
	}
	:global(.prose) :global(pre) {
		background: #282c34;
		color: #fff;
		border-radius: 0.5rem;
		padding: 1em;
	}
	:global(.carta-readonly .carta-input-wrapper) {
		display: none !important;
	}
	:global(.carta-readonly .carta-renderer) {
		display: block !important;
	}
</style>
