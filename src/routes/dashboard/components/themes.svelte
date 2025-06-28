<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
		CardDescription,
		CardFooter
	} from '$lib/components/ui/card';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { createTheme, getAllThemeWithStats, removeTheme, type ThemeWithStatSchema } from '@/api/theme_request';
	import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';

	let {
		themes,
		onRefresh
	}: {
		themes: ThemeWithStatSchema[] | null;
		onRefresh: () => Promise<void>;
	} = $props();

	let themeName: string = $state('');
	let themeDescription: string = $state('');
	let dialogOpen: boolean = $state(false);
	let showSuccessAlert = $state(false);
	let deleteDialogOpen: boolean = $state(false);
	let themeToDelete: string = $state('');
	let showDeleteSuccessAlert = $state(false);

	async function handleCreateTheme() {
		if (!themeName.trim()) return;
		const response = await createTheme(themeName, themeDescription);
		if (response.code === 200) {
			await onRefresh();
			dialogOpen = false;
			themeName = '';
			themeDescription = '';
			showSuccessAlert = true;
			setTimeout(() => { showSuccessAlert = false; }, 3000);
		}
	}

	async function handleDeleteTheme() {
		if (!themeToDelete) return;
		const response = await removeTheme(themeToDelete);
		if (response.code === 200) {
			await onRefresh();
			deleteDialogOpen = false;
			themeToDelete = '';
			showDeleteSuccessAlert = true;
			setTimeout(() => { showDeleteSuccessAlert = false; }, 3000);
		}
	}

	function openDeleteDialog(themeId: string) {
		themeToDelete = themeId;
		deleteDialogOpen = true;
	}

	function viewTheme(themeId: string) {
		goto(`/dashboard/theme/${themeId}`);
	}
</script>

<div class="z-50">
	{#if showSuccessAlert}
		<Alert.Root class="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
			<CheckCircle2Icon class="h-4 w-4" />
			<Alert.Title>创建成功！</Alert.Title>
			<Alert.Description>新主题已添加。</Alert.Description>
		</Alert.Root>
	{/if}

	{#if showDeleteSuccessAlert}
		<Alert.Root class="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
			<CheckCircle2Icon class="h-4 w-4" />
			<Alert.Title>删除成功！</Alert.Title>
			<Alert.Description>主题已删除。</Alert.Description>
		</Alert.Root>
	{/if}

	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">主题管理</h2>
		<AlertDialog.Root bind:open={dialogOpen}>
			<AlertDialog.Trigger class={buttonVariants({ variant: 'outline' })}>
				新建主题
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>开启一个新的篇章</AlertDialog.Title>
					<p>
						主题名 <Input type="text" placeholder="主题名" class="max-w-xs" bind:value={themeName} />
					</p>
					<p>
						描述信息 <Input
						type="text"
						placeholder="描述信息"
						class="max-w-xs"
						bind:value={themeDescription}
					/>
					</p>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>算了</AlertDialog.Cancel>
					<AlertDialog.Action onclick={handleCreateTheme}>确定</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>

	<!-- 删除确认对话框 -->
	<AlertDialog.Root bind:open={deleteDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>确认删除</AlertDialog.Title>
				<AlertDialog.Description>
					此操作无法撤销。这将永久删除该主题及其所有相关数据。
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>取消</AlertDialog.Cancel>
				<AlertDialog.Action onclick={handleDeleteTheme}>删除</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#if themes !== null}
			{#each themes as theme}
				<Card>
					<CardHeader>
						<div class="flex items-center justify-between">
							<CardTitle>
								<button
									class="hover:underline"
									onclick={() => {
										viewTheme(theme.id);
									}}
								>
									{theme.name}
								</button>
							</CardTitle>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant="ghost" size="icon">
										<MoreHorizontal class="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onclick={() => viewTheme(theme.id)}>
										<Eye class="mr-2 h-4 w-4" />
										查看
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Edit class="mr-2 h-4 w-4" />
										编辑
									</DropdownMenuItem>
									<DropdownMenuItem class="text-destructive" onclick={() => openDeleteDialog(theme.id)}>
										<Trash2 class="mr-2 h-4 w-4" />
										删除
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<CardDescription>{theme.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="grid grid-cols-2 gap-4">
								<div class="space-y-1">
									<p class="text-sm font-medium">章节数</p>
									<p class="text-2xl font-bold">{theme.chapter_count}</p>
								</div>
								<div class="space-y-1">
									<p class="text-sm font-medium">文章数</p>
									<p class="text-2xl font-bold">{theme.article_count}</p>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<p class="text-sm text-muted-foreground">
							<span>最后更新：{theme.updated_at}</span>
						</p>
					</CardFooter>
				</Card>
			{/each}
		{/if}
	</div>
</div>
