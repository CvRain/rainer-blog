import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { inject } from '@angular/core';
import { Theme } from '../../../services/theme';
import { CoverService } from '../../../services/cover.service';
import { ApiTheme, BaseThemeSchema } from '../../../services/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './themes.html',
  styleUrl: './themes.css',
})
export class Themes {
  private themeService = inject(Theme);
  private coverService = inject(CoverService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  themes: ApiTheme[] = [];
  loading = false;
  saving = false; // 单独的保存状态
  searchText = '';
  displayDialog = false;
  editingTheme: BaseThemeSchema | null = null;
  newTheme = { name: '', description: '' };
  selectedFile: File | null = null;
  coverPreview: string | null = null;

  ngOnInit() {
    this.loadThemes();
  }

  loadThemes() {
    this.loading = true;
    this.themeService.getAll().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.code === 200 && response.data) {
          this.themes = response.data;
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: '错误',
          detail: '加载主题列表失败',
        });
        console.error('加载主题失败:', error);
      },
    });
  }

  saveTheme() {
    if (!this.newTheme.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: '警告',
        detail: '主题名称不能为空',
      });
      return;
    }

    // 使用单独的保存状态
    this.saving = true;

    if (this.editingTheme) {
      // 编辑现有主题
      const updatedTheme = {
        ...this.editingTheme,
        name: this.newTheme.name,
        description: this.newTheme.description,
      };
      this.themeService.updateOne(updatedTheme).subscribe({
        next: (response) => {
          if (response.code === 200) {
            // Check for file upload
            if (this.selectedFile) {
              this.coverService
                .uploadAndSetCover(this.selectedFile, 'theme', updatedTheme.id)
                .subscribe({
                  next: () => {
                    this.messageService.add({
                      severity: 'success',
                      summary: '成功',
                      detail: '主题更新成功',
                    });
                    this.saving = false;
                    this.closeDialog();
                    setTimeout(() => this.loadThemes(), 100);
                  },
                  error: (err) => {
                    this.messageService.add({
                      severity: 'warn',
                      summary: '警告',
                      detail: '主题信息已更新，但封面上传失败',
                    });
                    this.saving = false;
                    this.closeDialog();
                    setTimeout(() => this.loadThemes(), 100);
                  },
                });
            } else {
              this.saving = false;
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '主题更新成功',
              });
              this.closeDialog();
              // 延迟刷新，确保后端数据已更新
              setTimeout(() => this.loadThemes(), 100);
            }
          } else {
            this.saving = false;
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '更新主题失败',
            });
          }
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '更新主题失败',
          });
          console.error('更新主题失败:', error);
        },
      });
    } else {
      // 创建新主题
      this.themeService
        .createOne(this.newTheme.name, this.newTheme.description)
        .subscribe({
          next: (response) => {
            console.debug(response);
            if (response.code === 200 || response.code === 201) {
              const newThemeId = response.data?.id;
              if (newThemeId && this.selectedFile) {
                this.coverService
                  .uploadAndSetCover(this.selectedFile, 'theme', newThemeId)
                  .subscribe({
                    next: () => {
                      this.messageService.add({
                        severity: 'success',
                        summary: '成功',
                        detail: '主题创建成功',
                      });
                      this.saving = false;
                      this.closeDialog();
                      setTimeout(() => this.loadThemes(), 100);
                    },
                    error: () => {
                      this.messageService.add({
                        severity: 'warn',
                        summary: '警告',
                        detail: '主题创建成功，但封面上传失败',
                      });
                      this.saving = false;
                      this.closeDialog();
                      setTimeout(() => this.loadThemes(), 100);
                    },
                  });
              } else {
                this.saving = false;
                this.messageService.add({
                  severity: 'success',
                  summary: '成功',
                  detail: '主题创建成功',
                });
                this.closeDialog();
                // 延迟刷新，确保后端数据已更新
                setTimeout(() => this.loadThemes(), 100);
              }
            } else {
              this.saving = false;
              this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: response.message || '创建主题失败',
              });
            }
          },
          error: (error) => {
            this.saving = false;
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '创建主题失败',
            });
            console.error('创建主题失败:', error);
          },
        });
    }
  }

  closeDialog() {
    this.displayDialog = false;
    this.editingTheme = null;
    this.newTheme = { name: '', description: '' };
    this.selectedFile = null;
    this.coverPreview = null;
  }

  openNewDialog() {
    this.newTheme = { name: '', description: '' };
    this.editingTheme = null;
    this.displayDialog = true;
    this.selectedFile = null;
    this.coverPreview = null;
  }

  openEditDialog(theme: BaseThemeSchema) {
    this.editingTheme = { ...theme };
    this.newTheme = { name: theme.name, description: theme.description };
    this.displayDialog = true;
    this.selectedFile = null;
    this.coverPreview = null;

    // Fetch existing cover
    this.coverService.getCoverUrl('theme', theme.id).subscribe((url) => {
      this.coverPreview = url;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteTheme(theme: BaseThemeSchema) {
    this.confirmationService.confirm({
      message: `确定要删除主题"${theme.name}"吗？`,
      header: '确认删除',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.themeService.removeOne(theme.id).subscribe({
          next: (response) => {
            if (response.code === 200) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: '主题删除成功',
              });
              this.loadThemes();
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '删除主题失败',
            });
            console.error('删除主题失败:', error);
          },
        });
      },
    });
  }

  toggleThemeStatus(theme: BaseThemeSchema) {
    const newStatus = !theme.is_active;
    const action = newStatus ? '激活' : '禁用';

    this.confirmationService.confirm({
      message: `确定要${action}主题"${theme.name}"吗？`,
      header: `确认${action}`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const updatedTheme = { ...theme, is_active: newStatus };
        this.themeService.updateOne(updatedTheme).subscribe({
          next: (response) => {
            if (response.code === 200) {
              this.messageService.add({
                severity: 'success',
                summary: '成功',
                detail: `主题${action}成功`,
              });
              this.loadThemes();
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: `主题${action}失败`,
            });
            console.error(`主题${action}失败:`, error);
          },
        });
      },
    });
  }

  manageChapters(theme: BaseThemeSchema) {
    this.router.navigate(['/dashboard/themes', theme.id, 'chapters']);
  }

  get filteredThemes() {
    if (!this.searchText.trim()) {
      return this.themes;
    }
    return this.themes.filter(
      (theme) =>
        theme.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (theme.description &&
          theme.description
            .toLowerCase()
            .includes(this.searchText.toLowerCase())),
    );
  }
}
