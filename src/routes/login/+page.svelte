<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { login } from '$lib/api/user_request';
	import { goto } from '$app/navigation';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import PopcornIcon from '@lucide/svelte/icons/popcorn';
	import { preventDefault } from 'svelte/legacy';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	const id = $props.id();

	let userName = $state('');
	let userPassword = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let showSuccessAlert = $state(false);
	let showErrorAlert = $state(false);

	function hideAlerts() {
		showSuccessAlert = false;
		showErrorAlert = false;
	}

	async function handleSubmit() {
		try {
			isLoading = true;
			errorMessage = '';
			hideAlerts();
			
			const response = await login(userName, userPassword);
			if (response.code === 200) {
				showSuccessAlert = true;
				setTimeout(() => {
					goto('/dashboard');
				}, 1000);
			} else {
				errorMessage = response.message;
				showErrorAlert = true;
				setTimeout(hideAlerts, 5000);
			}
		} catch (error) {
			errorMessage = '登录失败，请稍后重试';
			showErrorAlert = true;
			setTimeout(hideAlerts, 5000);
			console.error('Login error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- 
<Alert.Root>
    <CheckCircle2Icon />
    <Alert.Title>Success! Your changes have been saved</Alert.Title>
    <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>
<Alert.Root>
    <PopcornIcon />
    <Alert.Title>This Alert has a title and an icon. No description.</Alert.Title>
</Alert.Root>
<Alert.Root variant="destructive">
    <AlertCircleIcon />
    <Alert.Title>Unable to process your payment.</Alert.Title>
    <Alert.Description>
        <p>Please verify your billing information and try again.</p>
        <ul class="list-inside list-disc text-sm">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
        </ul>
    </Alert.Description>
</Alert.Root> -->

<div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
	<div class="h-fit w-full max-w-sm md:max-w-3xl">
		{#if showSuccessAlert}
			<Alert.Root class="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
				<CheckCircle2Icon class="h-4 w-4" />
				<Alert.Title>登录成功！</Alert.Title>
				<Alert.Description>正在跳转到首页...</Alert.Description>
			</Alert.Root>
		{/if}

		{#if showErrorAlert}
			<Alert.Root variant="destructive" class="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
				<AlertCircleIcon class="h-4 w-4" />
				<Alert.Title>登录失败</Alert.Title>
				<Alert.Description>{errorMessage}</Alert.Description>
			</Alert.Root>
		{/if}

		<div class={cn('flex flex-col gap-6', className)} {...restProps}>
			<Card.Root class="overflow-hidden p-0">
				<Card.Content class="grid p-0 md:grid-cols-2">
					<form class="p-6 md:p-8" onsubmit={handleSubmit}>
						<div class="flex flex-col gap-6">
							<div class="flex flex-col items-center text-center">
								<h1 class="text-2xl font-bold">欢迎回来！</h1>
								<p class="text-balance text-muted-foreground">速速登录发一篇新文章吧！</p>
							</div>
							<div class="grid gap-3">
								<Label for="username-{id}">用户名</Label>
								<Input
									id="username-{id}"
									type="text"
									placeholder="请输入用户名"
									bind:value={userName}
									required
								/>
							</div>
							<div class="grid gap-3">
								<div class="flex items-center">
									<Label for="password-{id}">密码</Label>
									<a href="##" class="ml-auto text-sm underline-offset-2 hover:underline">
										忘记密码？
									</a>
								</div>
								<Input
									id="password-{id}"
									type="password"
									placeholder="请输入密码"
									bind:value={userPassword}
									required
								/>
							</div>
							<Button type="submit" class="w-full" disabled={isLoading}>
								{isLoading ? '登录中...' : '登录'}
							</Button>
						</div>
					</form>
					<div class="relative hidden bg-muted md:block">
						<img
							src="/images/login-background.jpg"
							alt="placeholder"
							class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</Card.Content>
			</Card.Root>
			<div
				class="*:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs text-muted-foreground"
			>
				By clicking continue, you agree to our <a href="##">Terms of Service</a> and
				<a href="##">Privacy Policy</a>.
			</div>
		</div>
	</div>
</div>
