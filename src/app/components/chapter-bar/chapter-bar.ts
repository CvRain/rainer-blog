import { Component, input, output } from '@angular/core';
import { ApiChapter, ApiArticle } from '../../services/types';
import { PanelModule } from 'primeng/panel';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chapter-bar',
  imports: [PanelModule, TreeModule, CommonModule],
  templateUrl: './chapter-bar.html',
  styleUrl: './chapter-bar.css'
})
export class ChapterBar {
  chapters = input<ApiChapter[]>([]);
  
  // 添加节点选择事件输出
  nodeSelected = output<{type: string, id: string, article?: ApiArticle}>();
  
  treeNodes: TreeNode[] = [];
  
  // 当章节数据变化时，重新构建树节点
  ngOnChanges() {
    this.buildTreeNodes();
  }
  
  buildTreeNodes() {
    this.treeNodes = this.chapters().map(chapter => {
      return {
        label: chapter.name,
        data: { type: 'chapter', id: chapter.id },
        expanded: true,
        children: chapter.articles.map(article => {
          return {
            label: article.title,
            data: { type: 'article', id: article.id, article: article },
            icon: 'pi pi-file'
          };
        })
      };
    });
  }
  
  onNodeSelect(event: any) {
    // 节点选择事件，发出选择的节点数据
    this.nodeSelected.emit(event.node.data);
  }
}