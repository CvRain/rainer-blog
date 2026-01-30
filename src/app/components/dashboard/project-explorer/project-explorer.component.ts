import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem, TreeNode } from 'primeng/api';
import { Theme } from '../../../services/theme';
import { ApiTheme } from '../../../services/types';

export interface FileNodeData {
  type: 'theme' | 'chapter' | 'article';
  id: string;
  parentId?: string; // Theme ID for chapters, Chapter ID for articles
  item: any; // Original data object
}

@Component({
  selector: 'app-project-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    ContextMenuModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './project-explorer.component.html',
  styleUrl: './project-explorer.component.css',
})
export class ProjectExplorerComponent implements OnInit {
  @Input() selection: TreeNode | null = null;
  @Output() onNodeSelect = new EventEmitter<FileNodeData>();
  @Output() onCreate = new EventEmitter<{
    type: 'theme' | 'chapter' | 'article';
    parentId?: string;
  }>();
  @Output() onDelete = new EventEmitter<FileNodeData>();
  @Output() onRename = new EventEmitter<FileNodeData>();

  themeService = inject(Theme);

  files: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  loading = false;

  // Search
  searchTerm: string = '';

  // Context Menu
  menuItems: MenuItem[] = [];
  @ViewChild('cm') cm!: ContextMenu;

  ngOnInit() {
    this.loadExplorerData();
  }

  loadExplorerData() {
    this.loading = true;
    this.themeService.getAll().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.files = this.buildTreeNodes(response.data);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load explorer data', err);
        this.loading = false;
      },
    });
  }

  buildTreeNodes(themes: ApiTheme[]): TreeNode[] {
    return themes.map((theme) => ({
      key: `theme-${theme.id}`,
      label: theme.name,
      icon: 'pi pi-fw pi-book',
      expandedIcon: 'pi pi-fw pi-book-open',
      collapsedIcon: 'pi pi-fw pi-book',
      data: { type: 'theme', id: theme.id, item: theme } as FileNodeData,
      expanded: false, // Default to collapsed for cleaner view
      children: (theme.chapters || []).map((chapter) => ({
        key: `chapter-${chapter.id}`,
        label: chapter.name,
        icon: 'pi pi-fw pi-folder',
        expandedIcon: 'pi pi-fw pi-folder-open',
        collapsedIcon: 'pi pi-fw pi-folder',
        data: {
          type: 'chapter',
          id: chapter.id,
          parentId: theme.id,
          item: chapter,
        } as FileNodeData,
        expanded: false,
        children: (chapter.articles || []).map((article) => ({
          key: `article-${article.id}`,
          label: article.title,
          icon: 'pi pi-fw pi-file',
          data: {
            type: 'article',
            id: article.id,
            parentId: chapter.id,
            item: article,
          } as FileNodeData,
          leaf: true,
        })),
      })),
    }));
  }

  onNodeSelection(event: any) {
    if (event.node && event.node.data) {
      this.onNodeSelect.emit(event.node.data);
    }
  }

  onNodeContextMenuSelect(event: any) {
    const node = event.node;
    const type = node.data.type;
    const data = node.data as FileNodeData;

    this.menuItems = [
      {
        label: 'Rename',
        icon: 'pi pi-pencil',
        command: () => this.onRename.emit(data),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.onDelete.emit(data),
      },
    ];

    if (type === 'theme') {
      this.menuItems.unshift({
        label: 'New Chapter',
        icon: 'pi pi-folder-plus',
        command: () =>
          this.onCreate.emit({ type: 'chapter', parentId: data.id }),
      });
    } else if (type === 'chapter') {
      this.menuItems.unshift({
        label: 'New Article',
        icon: 'pi pi-file-plus',
        command: () =>
          this.onCreate.emit({ type: 'article', parentId: data.id }),
      });
    }
  }

  // Filter/Search Logic could go here (simple visual filter or data filter)
  filterNodes() {
    // Implement simple local filtering if needed
  }
}
