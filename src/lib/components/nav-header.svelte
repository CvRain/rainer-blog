<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { toggleMode } from 'mode-watcher';
	import { getUserInfo, type UserInfo } from '$lib/api/user_request';
	import { onMount } from 'svelte';
	import { NavigationMenu } from 'bits-ui';
	import {
		BookOpen,
		Archive,
		LayoutGrid,
		LogIn,
		Sun,
		Moon
	} from 'lucide-svelte';

	let userInfo: UserInfo | null = null;
	onMount(async () => {
		const result = await getUserInfo();
		if (result.code === 200) {
			userInfo = result.data;
		} else {
			console.error(result.message);
		}
	});
</script>

<nav class="sticky top-2 z-50 mx-4 rounded-xl border bg-background/80 backdrop-blur-sm shadow-sm">
	<div class="mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-14 items-center justify-between">
			<div class="flex items-center space-x-2">
				<Avatar class="h-8 w-8">
					<AvatarImage src={userInfo?.user_avatar || '/images/avatar.png'} />
					<AvatarFallback>CR</AvatarFallback>
				</Avatar>
				<span class="font-bold">{userInfo?.user_name || 'ClaudeRainer'}</span>
			</div>

			<NavigationMenu.Root class="flex flex-1 justify-end">
				<NavigationMenu.List class="flex space-x-1">
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							<Button variant="ghost" href="/">
								<BookOpen class="mr-2 h-4 w-4" />
								首页
							</Button>
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							<Button variant="ghost" href="/archive">
								<Archive class="mr-2 h-4 w-4" />
								归档
							</Button>
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							<Button variant="ghost" href="/categories">
								<LayoutGrid class="mr-2 h-4 w-4" />
								分类
							</Button>
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							<Button variant="ghost" href="/login">
								<LogIn class="mr-2 h-4 w-4" />
								登录
							</Button>
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							<Button onclick={toggleMode} variant="outline" size="icon">
								<Sun
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								/>
								<Moon
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
								/>
								<span class="sr-only">Toggle theme</span>
							</Button>
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
		</div>
	</div>
</nav> 