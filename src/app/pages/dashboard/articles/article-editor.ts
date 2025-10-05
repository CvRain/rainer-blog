import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { CheckboxModule } from "primeng/checkbox";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "../../../services/article";
import { Chapter } from "../../../services/chapter";
import { Theme } from "../../../services/theme";
import {
  ApiArticle,
  ApiArticleContent,
  ApiChapter,
  ApiTheme,
  BaseThemeSchema,
} from "../../../services/types";
import { MarkdownViewer } from "../../../components/markdown-viewer/markdown-viewer";
import { TabsModule } from "primeng/tabs";

import { SplitterModule } from "primeng/splitter";

@Component({
  selector: "app-article-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    ToastModule,
    MarkdownViewer,
    SplitterModule,
  ],
  providers: [MessageService],
  templateUrl: "./article-editor.html",
  styleUrl: "./article-editor.css",
})
export class ArticleEditor implements OnInit {
  private articleService = inject(Article);
  private chapterService = inject(Chapter);
  private themeService = inject(Theme);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  article: Partial<ApiArticleContent> = {
    title: "",
    subtitle: "",
    s3_content: "",
    order: 0,
    is_active: true,
  };

  themes: ApiTheme[] = [];
  chapters: ApiChapter[] = [];
  selectedThemeId: string = "";
  selectedChapterId: string = "";
  loading = false;
  saving = false;
  isNewArticle = false;
  articleId: string | null = null;
  isSidebarVisible = false;
  isPreviewVisible = false;

  ngOnInit() {
    this.loadThemes();
    this.route.params.subscribe((params) => {
      this.articleId = params["id"];
      if (this.articleId && this.articleId !== "new") {
        this.loadArticle(this.articleId);
      } else {
        this.isNewArticle = true;
      }
    });
  }

  togglePreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  loadThemes() {
    this.themeService.getAll().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.themes = response.data;
        }
      },
      error: (error) => {
        console.error("加载主题失败:", error);
      },
    });
  }

  loadArticle(articleId: string) {
    this.loading = true;
    this.articleService.getArticleDetail(articleId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.code === 200 && response.data) {
          this.article = response.data;
          this.selectedChapterId = response.data.chapter_id;
          this.loadChaptersForTheme(
            this.getThemeIdFromChapter(response.data.chapter_id),
          );
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: "error",
          summary: "错误",
          detail: "加载文章失败",
        });
        console.error("加载文章失败:", error);
      },
    });
  }

  onThemeChange() {
    this.selectedChapterId = "";
    this.article.chapter_id = "";
    this.loadChaptersForTheme(this.selectedThemeId);
  }

  loadChaptersForTheme(themeId: string) {
    if (!themeId) return;

    this.chapterService.getChapterByTheme(themeId).subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.chapters = response.data;
        }
      },
      error: (error) => {
        console.error("加载章节失败:", error);
      },
    });
  }

  getThemeIdFromChapter(chapterId: string): string {
    const chapter = this.chapters.find((c) => c.id === chapterId);
    return chapter ? chapter.theme_id : "";
  }

  onChapterChange() {
    this.article.chapter_id = this.selectedChapterId;
  }

  saveArticle() {
    if (!this.article.title?.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "警告",
        detail: "文章标题不能为空",
      });
      return;
    }

    if (!this.article.chapter_id) {
      this.messageService.add({
        severity: "warn",
        summary: "警告",
        detail: "请选择所属章节",
      });
      return;
    }

    this.saving = true;

    if (this.isNewArticle) {
      this.createArticle();
    } else {
      this.updateArticle();
    }
  }

  createArticle() {
    this.articleService
      .createArticle(
        this.article.title!,
        this.article.s3_content || "",
        this.article.chapter_id!,
      )
      .subscribe({
        next: (response) => {
          this.saving = false;
          if (response.code === 200 || response.code === 201) {
            this.messageService.add({
              severity: "success",
              summary: "成功",
              detail: "文章创建成功",
            });
            this.router.navigate([
              "/dashboard/articles",
              response.data?.id,
              "edit",
            ]);
          } else {
            this.messageService.add({
              severity: "error",
              summary: "错误",
              detail: response.message || "创建文章失败",
            });
          }
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: "error",
            summary: "错误",
            detail: "创建文章失败",
          });
          console.error("创建文章失败:", error);
        },
      });
  }

  updateArticle() {
    if (!this.articleId) return;

    const articleData = this.article as ApiArticleContent;

    const updatePayload: ApiArticleContent = {
      id: this.articleId,
      title: articleData.title,
      subtitle: articleData.subtitle,
      order: articleData.order,
      is_active: articleData.is_active,
      chapter_id: articleData.chapter_id,
      s3_content: articleData.s3_content,
      aws_key: articleData.aws_key,
      inserted_at: articleData.inserted_at,
      updated_at: articleData.updated_at,
    };

    this.articleService.updateArticleContent(updatePayload).subscribe({
      next: (response) => {
        this.saving = false;
        if (response.code === 200) {
          this.messageService.add({
            severity: "success",
            summary: "成功",
            detail: "文章更新成功",
          });
          this.loadArticle(this.articleId!);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "错误",
            detail: response.message || "更新文章失败",
          });
        }
      },
      error: (error) => {
        this.saving = false;
        this.messageService.add({
          severity: "error",
          summary: "错误",
          detail: "更新文章失败",
        });
        console.error("更新文章失败:", error);
      },
    });
  }

  goBack() {
    this.router.navigate(["/dashboard"]);
  }
}
