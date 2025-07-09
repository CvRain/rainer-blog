<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { full as emoji } from 'markdown-it-emoji';
	import hljs from 'highlight.js';
	import markdownItAnchor from 'markdown-it-anchor';
	import markdownItTocDoneRight from 'markdown-it-toc-done-right';
	import markdownItLinkAttributes from 'markdown-it-link-attributes';
	import Shiki from '@shikijs/markdown-it';
	import markdownit from 'markdown-it';
	import DOMPurify from 'dompurify';

	// let markdownText: string = $props();
	let { markdownText }: {
		markdownText: string;
	} = $props();

	const md = markdownit({
		html: true,
		xhtmlOut: true,
		breaks: true,
		langPrefix: 'language-',
		linkify: true,
		typographer: true
	});

	let html: string = $derived(DOMPurify.sanitize(md.render(markdownText)));

	let styleLink: HTMLLinkElement | null = null;
	let observer: MutationObserver | null = null;

	function updateThemeCss() {
		const isDark = document.documentElement.classList.contains('dark');
		if (styleLink) {
			styleLink.href = isDark
				? '$lib/styles/catppuccin-mocha.css'
				: '$lib/styles/catppuccin-latte.css';
		}
	}

	onMount(async () => {
		await import('highlight.js/lib/languages/javascript');
		await import('highlight.js/lib/languages/typescript');
		await import('highlight.js/lib/languages/css');

		await Promise.all([
			import('highlight.js/lib/languages/javascript'),
			import('highlight.js/lib/languages/typescript')
		]).then(([jsLang, tsLang]) => {
			hljs.registerLanguage('javascript', jsLang.default);
			hljs.registerLanguage('typescript', tsLang.default);
		});

		md.use(emoji)
			.use(markdownItAnchor, {
				permalink: markdownItAnchor.permalink.linkInsideHeader({
					symbol: `
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
						</svg>
					`,
					placement: 'before'
				})
			})
			.use(markdownItTocDoneRight, {
				listType: 'ul',
				containerClass: 'toc-container'
			})
			.use(markdownItLinkAttributes, {
				pattern: /^https?:\/\//,
				attrs: {
					target: '_blank',
					rel: 'noopener noreferrer'
				}
			})
			.use(
				await Shiki({
					themes: {
						light: 'catppuccin-latte',
						dark: 'catppuccin-mocha'
					}
				})
			);

		if (browser) {
			styleLink = document.createElement('link');
			styleLink.rel = 'stylesheet';
			styleLink.type = 'text/css';
			styleLink.href = document.documentElement.classList.contains('dark')
				? '/src/lib/styles/catppuccin-mocha.css'
				: '/src/lib/styles/catppuccin-latte.css';
			document.head.appendChild(styleLink);

			observer = new MutationObserver(updateThemeCss);
			observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		}
	});

	onDestroy(() => {
		if (styleLink) {
			document.head.removeChild(styleLink);
			styleLink = null;
		}
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	});

	// $: if (initialized && markdownText !== undefined) {
	// 	html = md.render(markdownText || '');
	// }
</script>


<main class="markdown-previewer">
	<div class="preview markdown-body">
		{@html html}
	</div>
</main>
