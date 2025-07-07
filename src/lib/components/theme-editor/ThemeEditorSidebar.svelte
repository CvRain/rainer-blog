<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		ChevronDown,
		ChevronRight,
		FileText,
		FolderOpen,
		FolderClosed,
		Plus,
		MoreVertical,
		Edit,
		Trash2
	} from 'lucide-svelte';
	import type { ApiArticle, ApiChapter, ApiTheme } from '@/api/response_schema';

	let {
		theme,
		editingItem,
		editingText,
		selectedArticle,
		onCreateNew,
		onEditItem,
		onDeleteItem,
		onHandleRename,
		onSelectArticle,
		expandedChapters,
		setExpandedChapters
	}: {
		theme: ApiTheme | null;
		editingItem: any;
		editingText: string;
		selectedArticle: ApiArticle | null;
		onCreateNew: any;
		onEditItem: any;
		onDeleteItem: any;
		onHandleRename: any;
		onSelectArticle: any;
		expandedChapters: any;
		setExpandedChapters: (v: Record<string, boolean>) => void;
	} = $props();
</script>

<div
	class="sidebar mr-2 flex w-1/5 min-w-[260px] max-w-xs flex-col gap-4 rounded-xl border-r border-zinc-200 bg-white/90 p-2 shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-900/90"
>
	<ScrollArea class="h-full">
		<!-- Chapters & Articles -->
		<div class="mb-4">
			<div class="mb-2 flex items-center justify-between px-2 py-1">
				<h2 class="text-sm font-semibold tracking-tight text-muted-foreground">大纲</h2>
				<Button
					variant="ghost"
					size="icon"
					class="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-100 to-blue-300 transition hover:scale-105 dark:from-blue-900 dark:to-blue-700"
					onclick={() => onCreateNew('chapter')}
					title="新建章节"
				>
					<Plus class="h-4 w-4 text-blue-700 dark:text-blue-200" />
				</Button>
			</div>
			{#if theme}
				{#each theme.chapters as chapter (chapter.id)}
					<div>
						<div
							class="group flex w-full cursor-pointer items-center gap-1 rounded-lg py-1 pr-1 text-sm shadow-sm transition hover:bg-blue-50 dark:hover:bg-blue-900/40"
						>
							<button
								class="flex flex-1 items-center gap-1.5 pl-1 text-left"
								onclick={() => {
									const next = { ...expandedChapters, [chapter.id]: !expandedChapters[chapter.id] };
									setExpandedChapters(next);
								}}
							>
								{#if expandedChapters[chapter.id]}
									<ChevronDown class="h-4 w-4 shrink-0" />
									<FolderOpen class="h-4 w-4 text-blue-500" />
								{:else}
									<ChevronRight class="h-4 w-4 shrink-0" />
									<FolderClosed class="h-4 w-4 text-blue-500" />
								{/if}
								{#if editingItem?.type === 'chapter' && editingItem.id === chapter.id}
									<Input
										class="h-6 w-full rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
										value={editingText}
										onblur={onHandleRename}
										onkeydown={(e: any) => e.key === 'Enter' && onHandleRename(e)}
										autofocus
									/>
								{:else}
									<span class="flex-1 truncate font-medium text-zinc-800 dark:text-zinc-100">{chapter.name}</span>
								{/if}
							</button>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-blue-100 group-hover:opacity-100 dark:hover:bg-blue-800/40"
								>
									<MoreVertical class="h-4 w-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content
									class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
								>
									<DropdownMenu.Item onclick={() => onCreateNew('article', chapter)}>
										<Plus class="mr-2 h-4 w-4" /> 新建文章
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => onEditItem('chapter', chapter.id, chapter.name)}>
										<Edit class="mr-2 h-4 w-4" /> 重命名
									</DropdownMenu.Item>
									<DropdownMenu.Item class="text-destructive" onclick={() => onDeleteItem('chapter', chapter.id)}>
										<Trash2 class="mr-2 h-4 w-4" /> 删除
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
						{#if expandedChapters[chapter.id]}
							<div class="ml-5 border-l border-dashed pl-2.5">
								{#each chapter.articles as article (article.id)}
									<div
										class="group flex w-full cursor-pointer items-center gap-1.5 rounded-md border-b border-zinc-100 py-1 pl-2 pr-1 text-sm transition last:border-b-0 hover:bg-blue-50 dark:border-zinc-800 dark:hover:bg-blue-900/30"
										class:bg-blue-100={selectedArticle?.id === article.id}
									>
										<button
											class="flex flex-1 items-center gap-1.5 text-left"
											onclick={() => onSelectArticle(article)}
										>
											<FileText class="h-4 w-4 shrink-0 text-muted-foreground" />
											{#if editingItem?.type === 'article' && editingItem.id === article.id}
												<Input
													class="h-6 w-full rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
													value={editingText}
													onblur={onHandleRename}
													onkeydown={(e: any) => e.key === 'Enter' && onHandleRename(e)}
													autofocus
												/>
											{:else}
												<span class="flex-1 truncate">{article.title}</span>
											{/if}
										</button>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger
												class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-blue-100 group-hover:opacity-100 dark:hover:bg-blue-800/40"
											>
												<MoreVertical class="h-4 w-4" />
											</DropdownMenu.Trigger>
											<DropdownMenu.Content
												class="rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
											>
												<DropdownMenu.Item onclick={() => onEditItem('article', article.id, article.title)}>
													<Edit class="mr-2 h-4 w-4" /> 重命名
												</DropdownMenu.Item>
												<DropdownMenu.Item onclick={() => onDeleteItem('article', article.id, chapter)} class="text-destructive">
													<Trash2 class="mr-2 h-4 w-4" /> 删除
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
		<Separator />
	</ScrollArea>
</div>
