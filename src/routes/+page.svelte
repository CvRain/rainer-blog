<script lang="ts">
  import {Button} from '$lib/components/ui/button';
  import {Card, CardHeader, CardTitle, CardContent} from '$lib/components/ui/card';
  import {Avatar, AvatarFallback, AvatarImage} from '$lib/components/ui/avatar';
  import {toggleMode} from "mode-watcher";

  import {
      BookOpen,
      Archive,
      LayoutGrid,
      LogIn,
      Mail,
      Linkedin, GithubIcon, Video, Sun, Moon
  } from 'lucide-svelte';
  import {NavigationMenu} from "bits-ui";

  const articles = [
      {
          id: 1,
          title: 'SvelteKit深度实践指南',
          excerpt: '从项目搭建到部署的全流程解析...',
          date: '2024-03-20',
          cover: '/covers/sveltekit.jpg',
          views: 1234,
          tags: ['前端', '教程']
      },
      // 更多文章...
  ];
</script>

<div class="min-h-screen flex flex-col">
  <!-- 导航栏 -->
  <nav class="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
          <div class="h-16 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                  <Avatar class="h-8 w-8">
                      <AvatarImage src="/avatar.png"/>
                      <AvatarFallback>CR</AvatarFallback>
                  </Avatar>
                  <span class="font-bold">ClaudeRainer</span>
              </div>

              <NavigationMenu.Root class="flex-1 flex justify-end">
                  <NavigationMenu.List class="flex space-x-1">
                      <NavigationMenu.Item>
                          <NavigationMenu.Link>
                              <Button variant="ghost">
                                  <BookOpen class="mr-2 h-4 w-4"/>
                                  首页
                              </Button>
                          </NavigationMenu.Link>
                      </NavigationMenu.Item>
                      <NavigationMenu.Item>
                          <NavigationMenu.Link>
                              <Button variant="ghost">
                                  <Archive class="mr-2 h-4 w-4"/>
                                  归档
                              </Button>
                          </NavigationMenu.Link>
                      </NavigationMenu.Item>
                      <NavigationMenu.Item>
                          <NavigationMenu.Link>
                              <Button variant="ghost">
                                  <LayoutGrid class="mr-2 h-4 w-4"/>
                                  分类
                              </Button>
                          </NavigationMenu.Link>
                      </NavigationMenu.Item>
                      <NavigationMenu.Item>
                          <NavigationMenu.Link>
                              <Button variant="ghost">
                                  <LogIn class="mr-2 h-4 w-4"/>
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

  <!-- 背景横幅 -->
  <div class="relative min-h-screen bg-gray-900">
      <img
              src="/images/placeholder.jpg"
              alt="Banner"
              class="w-full h-full object-cover opacity-70"
      />
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 class="text-4xl font-bold text-white mb-4 drop-shadow-lg">placeholder placeholder</h2>
          <div class="flex space-x-6">
              <Button variant="ghost" size="sm" class="text-white hover:bg-white/10">
                  <GithubIcon class="h-5 w-5"/>
              </Button>
              <Button variant="ghost" size="sm" class="text-white hover:bg-white/10">
                  <Video class="h-5 w-5"/>
              </Button>
              <Button variant="ghost" size="sm" class="text-white hover:bg-white/10">
                  <Mail class="h-5 w-5"/>
              </Button>
          </div>
      </div>
  </div>

  <!-- 主体内容 -->
  <main class="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-3 gap-8">
          <!-- 左侧个人介绍 -->
          <div class="md:col-span-1 space-y-6">
              <Card>
                  <CardHeader>
                      <Avatar class="w-24 h-24 mx-auto">
                          <AvatarImage src="/images/avatar.png"/>
                          <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <CardTitle class="text-center mt-4">技术创作者</CardTitle>
                      <CardContent class="text-sm text-muted-foreground text-center">
                          全栈开发者 | 开源爱好者
                          <div class="mt-4 space-y-2">
                              <div class="flex items-center">
                                  <Mail class="h-4 w-4 mr-2"/>
                                  contact@example.com
                              </div>
                          </div>
                      </CardContent>
                  </CardHeader>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>友情链接</CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-2">
                      <div class="flex items-center hover:bg-accent/50 p-2 rounded">
                          <Linkedin class="h-4 w-4 mr-2"/>
                          <span class="text-sm">技术社区</span>
                      </div>
                      <!-- 更多链接... -->
                  </CardContent>
              </Card>
          </div>

          <!-- 右侧文章列表 -->
          <div class="md:col-span-2 space-y-6">
              {#each articles as article}
                  <Card class="hover:shadow-lg transition-shadow">
                      <div class="flex">
                          <img
                                  src={article.cover}
                                  alt="Cover"
                                  class="w-32 h-32 object-cover rounded-l-lg"
                          />
                          <div class="flex-1 p-6">
                              <div class="flex items-center justify-between mb-2">
                                  <CardTitle>{article.title}</CardTitle>
                                  <div class="flex space-x-2">
                                      {#each article.tags as tag}
                                          <span class="text-xs bg-accent px-2 py-1 rounded-full">{tag}</span>
                                      {/each}
                                  </div>
                              </div>
                              <p class="text-muted-foreground mb-4">{article.excerpt}</p>
                              <div class="flex items-center text-sm text-muted-foreground space-x-4">
                                  <span>{article.date}</span>
                                  <span>·</span>
                                  <span>{article.views} 阅读</span>
                              </div>
                          </div>
                      </div>
                  </Card>
              {/each}
          </div>
      </div>
  </main>

  <!-- 底部 -->
  <footer class="border-t bg-background/50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
              <div class="text-sm text-muted-foreground mb-4 md:mb-0">
                  © 2024 claude rainer · 流荧微源
              </div>
              <div class="flex space-x-4">
                  <Button variant="link" size="sm">关于本站</Button>
                  <Button variant="link" size="sm">友情链接</Button>
                  <Button variant="link" size="sm">RSS订阅</Button>
              </div>
          </div>
      </div>
  </footer>

</div>