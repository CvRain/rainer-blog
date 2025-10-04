import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from "primeng/dialog";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Chapter } from "../../../services/chapter";
import { Theme } from "../../../services/theme";
import { ApiChapter, ApiTheme, BaseThemeSchema } from "../../../services/types";

@Component({
  selector: "app-chapters",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    SelectModule,
    TagModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: "./chapters.html",
  styleUrl: "./chapters.css",
})
export class Chapters implements OnInit {
  private chapterService = inject(Chapter);
  private themeService = inject(Theme);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  chapters: ApiChapter[] = [];
  themes: ApiTheme[] = [];
  loading = false;
  saving = false;
  searchText = "";
  displayDialog = false;
  editingChapter: ApiChapter | null = null;
  newChapter = { name: "", description: "", theme_id: "" };
  currentTheme: ApiTheme | undefined = undefined;
  selectedThemeId: string = "";

  ngOnInit() {
    this.loadThemes();
    this.route.params.subscribe((params) => {
      const themeId = params["themeId"];
      if (themeId) {
        this.selectedThemeId = themeId;
        this.loadChaptersByTheme(themeId);
      }
    });
  }

  loadThemes() {
    this.themeService.getAll().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.themes = response.data;
          if (this.themes.length > 0 && !this.selectedThemeId) {
            this.selectedThemeId = this.themes[0].id;
            this.loadChaptersByTheme(this.selectedThemeId);
          }
        }
      },
      error: (error) => {
        console.error("加载主题失败:", error);
      },
    });
  }

  loadChaptersByTheme(themeId: string) {
    this.loading = true;
    const currentTheme = this.themes.find((t) => t.id === themeId) || undefined;
    this.currentTheme = currentTheme;

    this.chapterService.getChapterByTheme(themeId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.code === 200 && response.data) {
          this.chapters = response.data;
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: "error",
          summary: "错误",
          detail: "加载章节列表失败",
        });
        console.error("加载章节失败:", error);
      },
    });
  }

  onThemeChange() {
    if (this.selectedThemeId) {
      this.loadChaptersByTheme(this.selectedThemeId);
    }
  }

  openNewDialog() {
    this.newChapter = {
      name: "",
      description: "",
      theme_id: this.selectedThemeId,
    };
    this.editingChapter = null;
    this.displayDialog = true;
  }

  openEditDialog(chapter: ApiChapter) {
    this.editingChapter = { ...chapter };
    this.newChapter = {
      name: chapter.name,
      description: chapter.description || "",
      theme_id: chapter.theme_id,
    };
    this.displayDialog = true;
  }

  saveChapter() {
    if (!this.newChapter.name.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "警告",
        detail: "章节名称不能为空",
      });
      return;
    }

    this.saving = true;

    if (this.editingChapter) {
      const updatedChapter = { ...this.editingChapter, ...this.newChapter };
      this.chapterService.updateOne(updatedChapter).subscribe({
        next: (response) => {
          this.saving = false;
          if (response.code === 200) {
            this.messageService.add({
              severity: "success",
              summary: "成功",
              detail: "章节更新成功",
            });
            this.closeDialog();
            setTimeout(
              () => this.loadChaptersByTheme(this.selectedThemeId),
              100,
            );
          }
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: "error",
            summary: "错误",
            detail: "更新章节失败",
          });
          console.error("更新章节失败:", error);
        },
      });
    } else {
      // 创建新章节
      this.chapterService
        .createOne(this.newChapter.name, this.newChapter.theme_id)
        .subscribe({
          next: (response) => {
            this.saving = false;
            if (response.code === 200 || response.code === 201) {
              this.messageService.add({
                severity: "success",
                summary: "成功",
                detail: "章节创建成功",
              });
              this.closeDialog();
              setTimeout(
                () => this.loadChaptersByTheme(this.selectedThemeId),
                100,
              );
            }
          },
          error: (error) => {
            this.saving = false;
            this.messageService.add({
              severity: "error",
              summary: "错误",
              detail: "创建章节失败",
            });
            console.error("创建章节失败:", error);
          },
        });
    }
  }

  deleteChapter(chapter: ApiChapter) {
    this.confirmationService.confirm({
      message: `确定要删除章节"${chapter.name}"吗？`,
      header: "确认删除",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.chapterService.removeOne(chapter.id).subscribe({
          next: (response) => {
            if (response.code === 200) {
              this.messageService.add({
                severity: "success",
                summary: "成功",
                detail: "章节删除成功",
              });
              this.loadChaptersByTheme(this.selectedThemeId);
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: "error",
              summary: "错误",
              detail: "删除章节失败",
            });
            console.error("删除章节失败:", error);
          },
        });
      },
    });
  }

  toggleChapterStatus(chapter: ApiChapter) {
    const newStatus = !chapter.is_active;
    const action = newStatus ? "激活" : "禁用";

    this.confirmationService.confirm({
      message: `确定要${action}章节"${chapter.name}"吗？`,
      header: `确认${action}`,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const updatedChapter = { ...chapter, is_active: newStatus };
        this.chapterService.updateOne(updatedChapter).subscribe({
          next: (response) => {
            if (response.code === 200) {
              this.messageService.add({
                severity: "success",
                summary: "成功",
                detail: `章节${action}成功`,
              });
              this.loadChaptersByTheme(this.selectedThemeId);
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: "error",
              summary: "错误",
              detail: `章节${action}失败`,
            });
            console.error(`章节${action}失败:`, error);
          },
        });
      },
    });
  }

  closeDialog() {
    this.displayDialog = false;
    this.editingChapter = null;
    this.newChapter = {
      name: "",
      description: "",
      theme_id: this.selectedThemeId,
    };
  }

  get filteredChapters() {
    if (!this.searchText.trim()) {
      return this.chapters;
    }
    return this.chapters.filter(
      (chapter) =>
        chapter.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (chapter.description &&
          chapter.description
            .toLowerCase()
            .includes(this.searchText.toLowerCase())),
    );
  }

  goBackToThemes() {
    this.router.navigate(["/dashboard/themes"]);
  }
}
