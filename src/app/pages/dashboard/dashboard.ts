import { Component, inject, OnInit } from '@angular/core';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { SimpleFooter } from "../../components/simple-footer/simple-footer";
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TreeNode } from 'primeng/api';
import { TotalOverview, BaseThemeSchema, ApiChapter, ApiArticle } from '../../services/types';
import { User } from '../../services/user';
import { Theme } from '../../services/theme';
import { Chapter } from '../../services/chapter';

@Component({
  selector: 'app-dashboard',
  imports: [MiniHeader, SimpleFooter, RouterOutlet, CommonModule, TreeModule, CardModule, ButtonModule, TooltipModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {
  userService = inject(User);
  themeService = inject(Theme);
  chapterService = inject(Chapter);
  router = inject(Router);

  totalView: TotalOverview = {} as TotalOverview;
  treeNodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadTotalOverview();
    this.loadTreeData();
  }

  loadTotalOverview() {
    this.userService.totalOverview().subscribe((res) => {
      if (res.code === 200) {
        this.totalView = res.data || {} as TotalOverview;
        console.log(this.totalView);
      }
    });
  }

  loadTreeData() {
    this.loading = true;
    this.themeService.getAll().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.buildTreeNodes(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('加载主题失败:', error);
        this.loading = false;
      }
    });
  }

  buildTreeNodes(themes: BaseThemeSchema[]) {
    this.treeNodes = themes.map(theme => ({
      key: `theme-${theme.id}`,
      label: theme.name,
      icon: 'pi pi-book',
      data: { type: 'theme', id: theme.id, item: theme },
      children: [],
      expanded: false,
      selectable: true,
      badge: theme.is_active ? '激活' : '禁用',
      badgeClass: theme.is_active ? 'p-badge-success' : 'p-badge-warning'
    }));

    // 为每个主题加载章节
    this.treeNodes.forEach(themeNode => {
      const theme = themeNode.data.item;
      this.loadChaptersForTheme(themeNode, theme.id);
    });
  }

  loadChaptersForTheme(themeNode: TreeNode, themeId: string) {
    this.chapterService.getChapterByTheme(themeId).subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          themeNode.children = response.data.map(chapter => ({
            key: `chapter-${chapter.id}`,
            label: chapter.name,
            icon: 'pi pi-folder',
            data: { type: 'chapter', id: chapter.id, item: chapter, themeId: themeId },
            children: [],
            expanded: false,
            selectable: true,
            badge: chapter.is_active ? '激活' : '禁用',
            badgeClass: chapter.is_active ? 'p-badge-success' : 'p-badge-warning'
          }));

          // 为每个章节加载文章
          themeNode.children.forEach(chapterNode => {
            const chapter = chapterNode.data.item;
            this.loadArticlesForChapter(chapterNode, chapter.id);
          });
        }
      },
      error: (error) => {
        console.error(`加载主题 ${themeId} 的章节失败:`, error);
      }
    });
  }

  loadArticlesForChapter(chapterNode: TreeNode, chapterId: string) {
    // 这里需要调用文章服务获取章节下的文章
    // 暂时使用模拟数据
    chapterNode.children = [
      {
        key: `article-${chapterId}-1`,
        label: '示例文章',
        icon: 'pi pi-file',
        data: { type: 'article', id: '1', chapterId: chapterId },
        children: [],
        selectable: true
      }
    ];
  }

  onNodeSelect(event: any) {
    this.selectedNode = event.node;
    this.handleNodeAction(event.node);
  }

  handleNodeAction(node: TreeNode) {
    const { type, id, themeId, chapterId } = node.data;
    
    switch (type) {
      case 'theme':
        this.router.navigate(['/dashboard/themes', id]);
        break;
      case 'chapter':
        this.router.navigate(['/dashboard/themes', themeId, 'chapters', id]);
        break;
      case 'article':
        this.router.navigate(['/dashboard/articles', id, 'edit']);
        break;
    }
  }

  createNewArticle() {
    this.router.navigate(['/dashboard/articles', 'new']);
  }

  createNewTheme() {
    this.router.navigate(['/dashboard/themes', 'new']);
  }

  expandAll() {
    this.treeNodes.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.treeNodes.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  onChildActivate(instance: any) {
    if (instance && 'setTotalView' in instance && typeof instance.setTotalView === 'function') {
      instance.setTotalView(this.totalView);
    }
  }
}
