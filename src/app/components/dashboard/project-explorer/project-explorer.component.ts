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
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import {
  MenuItem,
  TreeNode,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { Theme } from '../../../services/theme';
import { Chapter } from '../../../services/chapter';
import { Article } from '../../../services/article';
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
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './project-explorer.component.html',
  styleUrl: './project-explorer.component.css',
})
export class ProjectExplorerComponent implements OnInit {
  @Input() selection: TreeNode | null = null;
  @Output() onNodeSelect = new EventEmitter<FileNodeData>();

  // Services
  themeService = inject(Theme);
  chapterService = inject(Chapter);
  articleService = inject(Article);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  files: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  loading = false;

  // State Persistence
  expandedNodeIds: Set<string> = new Set();

  // Search
  searchTerm: string = '';

  // Context Menu
  menuItems: MenuItem[] = [];
  @ViewChild('cm') cm!: ContextMenu;

  // Dialogs
  displayDialog = false;
  dialogType: 'create' | 'rename' = 'create';
  dialogTitle = '';
  dialogInputName = '';

  // Context for Actions
  targetNodeType: 'theme' | 'chapter' | 'article' = 'theme';
  targetParentId: string | undefined = undefined;
  targetNodeData: FileNodeData | null = null;

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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data',
        });
        this.loading = false;
      },
    });
  }

  buildTreeNodes(themes: ApiTheme[]): TreeNode[] {
    return themes.map((theme) => {
      const themeKey = `theme-${theme.id}`;
      return {
        key: themeKey,
        label: theme.name,
        icon: 'pi pi-fw pi-book',
        expandedIcon: 'pi pi-fw pi-book-open',
        collapsedIcon: 'pi pi-fw pi-book',
        data: { type: 'theme', id: theme.id, item: theme } as FileNodeData,
        expanded: this.expandedNodeIds.has(themeKey),
        children: (theme.chapters || []).map((chapter) => {
          const chapterKey = `chapter-${chapter.id}`;
          return {
            key: chapterKey,
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
            expanded: this.expandedNodeIds.has(chapterKey),
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
          };
        }),
      };
    });
  }

  onNodeExpand(event: any) {
    if (event.node && event.node.key) {
      this.expandedNodeIds.add(event.node.key);
    }
  }

  onNodeCollapse(event: any) {
    if (event.node && event.node.key) {
      this.expandedNodeIds.delete(event.node.key);
    }
  }

  onNodeSelection(event: any) {
    if (event.originalEvent && event.originalEvent.button === 2) {
      // Right click should not trigger selection event for navigation
      return;
    }
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
        command: () => this.openRenameDialog(data),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.confirmDelete(data),
      },
    ];

    if (type === 'theme') {
      this.menuItems.unshift({
        label: 'New Chapter',
        icon: 'pi pi-folder-plus',
        command: () => this.openCreateDialog('chapter', data.id),
      });
      this.menuItems.push({
        label: 'Properties',
        icon: 'pi pi-info-circle',
        command: () => this.showProperties(data),
      });
    } else if (type === 'chapter') {
      this.menuItems.unshift({
        label: 'New Article',
        icon: 'pi pi-file-plus',
        command: () => this.openCreateDialog('article', data.id),
      });
    }
  }

  // --- Actions ---

  openCreateDialog(type: 'theme' | 'chapter' | 'article', parentId?: string) {
    this.dialogType = 'create';
    this.targetNodeType = type;
    this.targetParentId = parentId;
    this.dialogTitle = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    this.dialogInputName = '';
    this.displayDialog = true;
  }

  openRenameDialog(data: FileNodeData) {
    this.dialogType = 'rename';
    this.targetNodeData = data;
    this.dialogTitle = `Rename ${data.type}`;

    // Set initial value
    if (data.type === 'theme') this.dialogInputName = data.item.name;
    else if (data.type === 'chapter') this.dialogInputName = data.item.name;
    else if (data.type === 'article') this.dialogInputName = data.item.title;

    this.displayDialog = true;
  }

  handleDialogSubmit() {
    if (!this.dialogInputName.trim()) return;
    this.displayDialog = false;

    if (this.dialogType === 'create') {
      this.executeCreate();
    } else {
      this.executeRename();
    }
  }

  executeCreate() {
    const name = this.dialogInputName;
    const parentId = this.targetParentId || '';

    if (this.targetNodeType === 'theme') {
      this.themeService.createOne(name, name).subscribe(this.handleResponse());
    } else if (this.targetNodeType === 'chapter') {
      this.chapterService
        .createOne(name, parentId)
        .subscribe(this.handleResponse());
    } else if (this.targetNodeType === 'article') {
      this.articleService
        .createArticle(name, name, parentId)
        .subscribe(this.handleResponse());
    }
  }

  executeRename() {
    if (!this.targetNodeData) return;
    const name = this.dialogInputName;
    const id = this.targetNodeData.id;
    const item = this.targetNodeData.item;

    if (this.targetNodeData.type === 'theme') {
      this.themeService
        .updateOne({ ...item, name })
        .subscribe(this.handleResponse());
    } else if (this.targetNodeData.type === 'chapter') {
      // Warning: API signature check needed. Chapter.updateOne takes ApiChapter
      this.chapterService
        .updateOne({ ...item, name })
        .subscribe(this.handleResponse());
    } else if (this.targetNodeData.type === 'article') {
      // For article rename, we need updateArticleContent, but that takes full content.
      // Assuming updateArticleContent is the way or we might need a specific rename endpoint if exists.
      // Checking Article Service: updateArticleContent(updateArticleSchema).
      // Let's assume fetching details -> updating title -> saving.
      // Or simpler: just try to update what we have if the object matches.
      // Ideally we need a lightweight rename. If not available, we might skip rename for article or do full fetch.
      // Let's defer article rename or try it.
      // Actually, fetching detail first is safer.
      this.articleService.getArticleDetailAdmin(id).subscribe((res) => {
        if (res.code === 200 && res.data) {
          const updated = { ...res.data, title: name };
          this.articleService
            .updateArticleContent(updated)
            .subscribe(this.handleResponse());
        }
      });
    }
  }

  confirmDelete(data: FileNodeData) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this ${data.type}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (data.type === 'theme') {
          this.themeService.removeOne(data.id).subscribe(this.handleResponse());
        } else if (data.type === 'chapter') {
          this.chapterService
            .removeOne(data.id)
            .subscribe(this.handleResponse());
        } else if (data.type === 'article') {
          this.articleService
            .removeArticle(data.id)
            .subscribe(this.handleResponse());
        }
      },
    });
  }

  showProperties(data: FileNodeData) {
    // Placeholder for properties
    this.messageService.add({
      severity: 'info',
      summary: 'Properties',
      detail: `ID: ${data.id}`,
    });
  }

  handleResponse() {
    return {
      next: (res: any) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Operation completed',
          });
          this.loadExplorerData();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.msg || 'Operation failed',
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Network error',
        });
      },
    };
  }

  // Filter/Search Logic could go here (simple visual filter or data filter)
  filterNodes() {
    // Implement simple local filtering if needed
  }
}
