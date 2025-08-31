import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Theme } from '../../../services/theme';
import { BaseThemeSchema } from '../../../services/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule, DialogModule, FormsModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './themes.html',
  styleUrl: './themes.css'
})
export class Themes {
  private themeService = inject(Theme);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  themes: BaseThemeSchema[] = [];
  loading = false;
  saving = false; // 单独的保存状态
  searchText = '';
  displayDialog = false;
  editingTheme: BaseThemeSchema | null = null;
  newTheme = { name: '', description: '' };

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
          detail: '加载主题列表失败'
        });
        console.error('加载主题失败:', error);
      }
    });
  }

  saveTheme() {
    if (!this.newTheme.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: '警告',
        detail: '主题名称不能为空'
      });
      return;
    }

    // 使用单独的保存状态
    this.saving = true;

    if (this.editingTheme) {
      // 编辑现有主题
      const updatedTheme = { ...this.editingTheme, ...this.newTheme };
      this.themeService.updateOne(updatedTheme).subscribe({
        next: (response) => {
          this.saving = false;
          if (response.code === 200) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '主题更新成功'
            });
            this.closeDialog();
            // 延迟刷新，确保后端数据已更新
            setTimeout(() => this.loadThemes(), 100);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '更新主题失败'
            });
          }
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '更新主题失败'
          });
          console.error('更新主题失败:', error);
        }
      });
    } else {
      // 创建新主题
      this.themeService.createOne(this.newTheme.name, this.newTheme.description).subscribe({
        next: (response) => {
          this.saving = false;
          console.debug(response);
          if (response.code === 200 || response.code === 201) {
            this.messageService.add({
              severity: 'success',
              summary: '成功',
              detail: '主题创建成功'
            });
            this.closeDialog();
            // 延迟刷新，确保后端数据已更新
            setTimeout(() => this.loadThemes(), 100);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: response.message || '创建主题失败'
            });
          }
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '创建主题失败'
          });
          console.error('创建主题失败:', error);
        }
      });
    }
  }

  closeDialog() {
    this.displayDialog = false;
    this.editingTheme = null;
    this.newTheme = { name: '', description: '' };
  }

  openNewDialog() {
    this.newTheme = { name: '', description: '' };
    this.editingTheme = null;
    this.displayDialog = true;
  }

  openEditDialog(theme: BaseThemeSchema) {
    this.editingTheme = { ...theme };
    this.newTheme = { name: theme.name, description: theme.description };
    this.displayDialog = true;
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
                detail: '主题删除成功'
              });
              this.loadThemes();
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: '错误',
              detail: '删除主题失败'
            });
            console.error('删除主题失败:', error);
          }
        });
      }
    });
  }

  get filteredThemes() {
    if (!this.searchText.trim()) {
      return this.themes;
    }
    return this.themes.filter(theme => 
      theme.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      theme.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}
