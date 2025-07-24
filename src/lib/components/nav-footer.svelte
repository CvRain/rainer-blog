<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const copyright = import.meta.env.VITE_COPYRIGHT || '©2025 上海流荧微源科技有限公司';
	const icp = import.meta.env.VITE_ICP || ' ';
</script>

<footer class="border-t bg-background/50">
	<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center justify-between md:flex-row">
			<div class="mb-4 text-sm text-muted-foreground md:mb-0">
				<a href="https://beian.miit.gov.cn/" target="_blank"
					>{copyright} {icp}
				</a>
			</div>
			<div class="flex space-x-4">
				<Button variant="link" size="sm" href="/about">关于本站</Button>
				<Button variant="link" size="sm" href="/friends">友情链接</Button>
				<Button variant="link" size="sm" href="/rss">RSS订阅</Button>
			</div>
		</div>
	</div>
</footer>
