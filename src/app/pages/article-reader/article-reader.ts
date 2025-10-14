import { Component, inject, input, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { Article } from "../../services/article";
import {
  ApiArticleContent,
  ApiTheme,
  BaseResponse,
  UserInfo,
} from "../../services/types";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { DatePipe, CommonModule } from "@angular/common";
import { MarkdownViewer } from "../../components/markdown-viewer/markdown-viewer";
import { User } from "../../services/user";
import { Title } from "@angular/platform-browser";
import { MiniHeader } from "../../components/mini-header/mini-header";
import { SimpleFooter } from "../../components/simple-footer/simple-footer";
import { TocSidebarComponent } from "../../components/toc-sidebar/toc-sidebar.component";
import { ArticleSidebar } from "../../components/article-sidebar/article-sidebar";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-article-reader",
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    DatePipe,
    RouterOutlet,
    MarkdownViewer,
    MiniHeader,
    SimpleFooter,
    TocSidebarComponent,
    ArticleSidebar,
  ],
  templateUrl: "./article-reader.html",
  styleUrl: "./article-reader.css",
})
export class ArticleReader implements OnInit {
  // 回到顶部方法
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  article: ApiArticleContent | undefined = undefined;
  loading = true;
  error: string | undefined = undefined;
  userService = inject(User);
  userInfo: UserInfo = {} as UserInfo;
  backgroundImageUrl = signal<string>("");
  tocHeadings: Array<{ level: number; text: string; id: string }> = [];

  // 添加输入属性，支持通过路由参数或直接传入ID获取文章
  articleId = input<string | undefined>(undefined);
  // 添加输入属性，控制是否显示header，默认显示
  showHeader = input<boolean>(true);

  theme = input<ApiTheme | undefined>(undefined);

  // 内部属性，用于存储从路由状态获取的主题数据
  routeTheme: ApiTheme | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: Article,
    private titleService: Title,
  ) {
    const result = this.userService.getUserInfo();
    result.subscribe((res) => {
      this.userInfo = res.data || {
        user_avatar: "",
        user_background: "",
        user_email: "",
        user_name: "unknown",
        user_signature: "unknown",
      };
      console.log(this.userInfo);
    });
  }

  ngOnInit() {
    // 检查路由状态中是否有主题数据
    console.log("检查路由状态中的主题数据...");
    console.log(
      "router.getCurrentNavigation():",
      this.router.getCurrentNavigation(),
    );
    console.log(
      "router.getCurrentNavigation()?.extras:",
      this.router.getCurrentNavigation()?.extras,
    );
    console.log(
      "router.getCurrentNavigation()?.extras?.state:",
      this.router.getCurrentNavigation()?.extras?.state,
    );

    if (this.router.getCurrentNavigation()?.extras?.state?.["theme"]) {
      this.routeTheme =
        this.router.getCurrentNavigation()?.extras?.state?.["theme"];
      console.log("从路由状态获取到主题数据:", this.routeTheme);
    } else {
      // 尝试从history.state获取主题数据（适用于页面刷新后的情况）
      if (history.state?.["theme"]) {
        this.routeTheme = history.state["theme"];
        console.log("从history.state获取到主题数据:", this.routeTheme);
      } else {
        console.log("未在路由状态中找到主题数据");
      }
    }
    this.setBackgroundImage();

    // 检查输入属性
    console.log("输入属性theme():", this.theme());

    // 监听路由参数变化
    this.route.paramMap.subscribe((params) => {
      const routeArticleId = params.get("id");
      if (routeArticleId) {
        this.loadArticle(routeArticleId);
      } else {
        // 检查是否有通过输入属性传入的ID
        const inputArticleId = this.articleId();
        if (inputArticleId) {
          this.loadArticle(inputArticleId);
        } else {
          this.error = "文章ID无效";
          this.loading = false;
        }
      }
    });
  }

  loadArticle(id: string) {
    this.loading = true;
    this.error = undefined;
    this.article = undefined;

    this.articleService.getArticleDetail(id).subscribe({
      next: (response: BaseResponse<ApiArticleContent>) => {
        if (response.code !== 200) {
          this.error = response.message;
          this.loading = false;
          return;
        }
        if (response.data) {
          this.article = response.data;
          this.titleService.setTitle(this.article.title);
        } else {
          this.error = "未找到指定文章";
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error("获取文章失败:", error);
        this.error = "获取文章失败: " + (error.error?.message || error.message);
        this.loading = false;
      },
    });
  }

  goBack() {
    // 检查浏览器历史记录，如果有则返回上一页，否则导航到首页
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(["/"]);
    }
  }

  setBackgroundImage(): void {
    const theme = this.getCurrentTheme();
    // The user mentioned the API is not ready, so we'll use a placeholder property 'cover'
    // and default to a static image if it's not present.
    if (theme && theme["cover"]) {
      this.backgroundImageUrl.set(theme["cover"]);
    } else {
      // 使用您选择的登录背景作为默认值
      this.backgroundImageUrl.set("/images/login-background.jpg");
    }
  }

  getCurrentTheme(): ApiTheme | undefined {
    const inputTheme = this.theme();
    console.log("getCurrentTheme - inputTheme:", inputTheme);
    console.log("getCurrentTheme - routeTheme:", this.routeTheme);

    // 优先使用输入属性传入的主题，其次使用路由状态中的主题
    const currentTheme = inputTheme || this.routeTheme;
    return currentTheme;
  }

  // 处理侧边栏节点选择事件
  onSidebarNodeSelect(event: any) {
    // 节点选择事件由article-sidebar组件内部处理，此处留空以备将来扩展
  }
}
