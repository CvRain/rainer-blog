import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TreeNode } from 'primeng/api';
import { ApiTheme } from '../../services/types';
import { User } from '../../services/user';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [CommonModule, TreeModule, ButtonModule, TooltipModule],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.css',
})
export class DashboardSidebar implements OnInit {
  @Input() sidebarVisible = true;

  userService = inject(User);
  themeService = inject(Theme);
  router = inject(Router);

  treeNodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadTreeData();
  }

  loadTreeData() {
    this.loading = true;
    this.themeService.getAll().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          const data = response.data;
          this.buildTreeNodes(data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('加载主题失败:', error);
        this.loading = false;
      },
    });
  }

  buildTreeNodes(themes: ApiTheme[]) {
    this.treeNodes = themes.map((theme) => {
      const themeNode: TreeNode = {
        key: `theme-${theme.id}`,
        label: theme.name,
        icon: 'pi pi-book',
        data: { type: 'theme', id: theme.id, item: theme },
        children: [],
        expanded: false,
        selectable: true,
        styleClass: theme.is_active ? 'theme-active' : 'theme-inactive',
      };

      if (theme.chapters && theme.chapters.length > 0) {
        themeNode.children = theme.chapters.map((chapter) => {
          const chapterNode: TreeNode = {
            key: `chapter-${chapter.id}`,
            label: chapter.name,
            icon: 'pi pi-folder',
            data: {
              type: 'chapter',
              id: chapter.id,
              item: chapter,
              themeId: theme.id,
            },
            children: [],
            expanded: false,
            selectable: true,
            styleClass: chapter.is_active
              ? 'chapter-active'
              : 'chapter-inactive',
          };

          if (chapter.articles && chapter.articles.length > 0) {
            chapterNode.children = chapter.articles.map((article) => {
              const articleNode: TreeNode = {
                key: `article-${article.id}`,
                label: article.title,
                icon: 'pi pi-file',
                data: {
                  type: 'article',
                  id: article.id,
                  chapterId: chapter.id,
                },
                children: [],
                selectable: true,
              };
              return articleNode;
            });
          }
          return chapterNode;
        });
      }
      return themeNode;
    });
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
    this.treeNodes.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.treeNodes.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
