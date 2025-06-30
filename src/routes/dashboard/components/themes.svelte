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
	import { createTheme, removeTheme, updateThemeInfo } from '@/api/theme_request';

	import { type ThemeWithStatSchema } from '@/api/response_schema';
	import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import type { UpdateThemeSchema } from '@/api/request_schema';
	import { Switch } from '$lib/components/ui/switch/index.js';

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
	let editDialogOpen: boolean = $state(false);
	let editingTheme: UpdateThemeSchema = $state({
		id: '',
		name: '',
		description: '',
		order: 0,
		is_active: true
	});

	async function handleCreateTheme() {
		console.log('handleCreateTheme called');

		if (!themeName.trim()) {
			console.log('themeName is empty');
			return;
		}
		console.log('Creating theme:', themeName, themeDescription);
		const response = await createTheme(themeName, themeDescription);
		console.log('Create theme response:', response);
		if (response.code === 200 || response.code === 201) {
			dialogOpen = false;
			console.log('Theme created successfully, closing dialog');
			// 清空表单
			themeName = '';
			themeDescription = '';
			console.log('Refreshing themes');
			// 刷新数据
			await onRefresh();
			console.log('Showing success alert');
			// 显示成功提示
			showSuccessAlert = true;
			setTimeout(() => {
				showSuccessAlert = false;
			}, 5000);
		} else {
			console.log('Failed to create theme:', response.message);
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
			setTimeout(() => {
				showDeleteSuccessAlert = false;
			}, 5000);
		}
	}

	function openDeleteDialog(themeId: string) {
		themeToDelete = themeId;
		deleteDialogOpen = true;
	}

	function viewTheme(themeId: string) {
		goto(`/dashboard/theme/${themeId}`);
	}

	function openEditDialog(theme: ThemeWithStatSchema) {
		editingTheme = {
			id: theme.id,
			name: theme.name,
			description: theme.description,
			order: theme.order,
			is_active: theme.is_active
		};
		editDialogOpen = true;
	}

	async function handleEditTheme() {
		const response = await updateThemeInfo(editingTheme);
		if (response.code === 200) {
			editDialogOpen = false;
			await onRefresh();
			showSuccessAlert = true;
			setTimeout(() => {
				showSuccessAlert = false;
			}, 5000);
		}
	}
</script>

<div class="z-50">
	{#if showSuccessAlert}
		<Alert.Root class="fixed right-4 top-4 z-50 w-80 duration-300 animate-in slide-in-from-right-2">
			<CheckCircle2Icon class="h-4 w-4" />
			<Alert.Title>创建成功！</Alert.Title>
			<Alert.Description>新主题已添加。</Alert.Description>
		</Alert.Root>
	{/if}

	{#if showDeleteSuccessAlert}
		<Alert.Root class="fixed right-4 top-4 z-50 w-80 duration-300 animate-in slide-in-from-right-2">
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
					<AlertDialog.Description>
						给你的新主题起一个名字和描述。描述是可选的。
					</AlertDialog.Description>
				</AlertDialog.Header>
				<div class="grid grid-cols-[auto_1fr] items-center gap-4 py-4">
					<label for="theme-name">主题名</label>
					<Input id="theme-name" bind:value={themeName} />

					<label for="theme-description">描述</label>
					<Input id="theme-description" bind:value={themeDescription} />
				</div>
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

	<AlertDialog.Root bind:open={editDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>编辑主题</AlertDialog.Title>
				<AlertDialog.Description> 修改主题信息。点击"确定"保存更改。 </AlertDialog.Description>
			</AlertDialog.Header>
			<div class="grid grid-cols-[auto_1fr] items-center gap-4 py-4">
				<label for="edit-theme-name">主题名</label>
				<Input id="edit-theme-name" bind:value={editingTheme.name} />

				<label for="edit-theme-description">描述</label>
				<Input id="edit-theme-description" bind:value={editingTheme.description} />

				<label for="edit-theme-order">排序</label>
				<Input id="edit-theme-order" type="number" bind:value={editingTheme.order} />

				<label for="edit-theme-active">激活状态</label>
				<Switch id="edit-theme-active" bind:checked={editingTheme.is_active} />
			</div>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>取消</AlertDialog.Cancel>
				<AlertDialog.Action onclick={handleEditTheme}>确定</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#if themes !== null}
			{#each [...themes].sort((a, b) => a.order - b.order || new Date(a.inserted_at).getTime() - new Date(b.inserted_at).getTime()) as theme}
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
									<DropdownMenuItem onclick={() => openEditDialog(theme)}>
										<Edit class="mr-2 h-4 w-4" />
										编辑
									</DropdownMenuItem>
									<DropdownMenuItem
										class="text-destructive"
										onclick={() => openDeleteDialog(theme.id)}
									>
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
					<CardFooter class="flex items-end justify-between">
						<p class="text-sm text-muted-foreground">
							<span>创建时间 {theme.inserted_at}</span>
						</p>
						<div class="flex items-center gap-2">
							<Switch
								checked={theme.is_active}
								onCheckedChange={async (e) => {
									await updateThemeInfo({
										id: theme.id,
										is_active: e,
										name: theme.name,
										description: theme.description,
										order: theme.order
									});
									await onRefresh();
								}}
								class="ml-2"
							/>
						</div>
					</CardFooter>
				</Card>
			{/each}
		{/if}
	</div>
</div>
