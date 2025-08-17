import {Component, input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Card} from 'primeng/card';
import {Tree} from 'primeng/tree';
import {Button} from 'primeng/button';
import {TreeNode} from 'primeng/api';
import {ApiTheme, ApiChapter, ApiArticle} from '../../services/types';

@Component({
  selector: 'app-article-sidebar',
  imports: [
    Card,
    Tree,
    Button
  ],
  templateUrl: './article-sidebar.html',
  styleUrl: './article-sidebar.css'
})
export class ArticleSidebar implements OnInit, OnChanges {
  files: TreeNode[] = [] as TreeNode[];
  apiTheme = input<ApiTheme | undefined>(undefined)

  ngOnInit(): void {
    console.debug('ArticleSidebar ngOnInit，apiTheme 输入值:', this.apiTheme());
    this.updateTreeNodes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.debug('ArticleSidebar ngOnChanges，变化:', changes);
    if (changes['apiTheme']) {
      console.debug('ArticleSidebar apiTheme 更新:', this.apiTheme());
      this.updateTreeNodes();
    }
  }

  updateTreeNodes(): void {
    const theme = this.apiTheme();
    console.debug('ArticleSidebar updateTreeNodes，theme 值:', theme);
    
    // 检查 theme 是否有效（有 id 属性）
    if (!theme || !theme.id) {
      console.debug('ArticleSidebar theme 无效，设置空文件树');
      this.files = [];
      return;
    }

    this.files = [
      {
        key: theme.id,
        label: theme.name,
        data: theme.description,
        icon: 'pi pi-fw pi-folder-open',
        children: theme.chapters?.map((chapter: ApiChapter, chapterIndex: number) => ({
          key: `${theme.id}-${chapterIndex}`,
          label: chapter.name,
          data: chapter.description,
          icon: 'pi pi-fw pi-folder',
          children: chapter.articles?.map((article: ApiArticle, articleIndex: number) => ({
            key: `${theme.id}-${chapterIndex}-${articleIndex}`,
            label: article.title,
            data: article.subtitle,
            icon: 'pi pi-fw pi-file'
          })) || []
        })) || []
      }
    ];
    
    console.debug('ArticleSidebar 生成的文件树:', this.files);
  }

  expandAll() {
    this.files.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.files.forEach((node) => {
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