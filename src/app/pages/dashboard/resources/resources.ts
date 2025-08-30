import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { inject } from '@angular/core';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, DialogModule, FormsModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './resources.html',
  styleUrl: './resources.css'
})
export class Resources {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  collections: any[] = [];
  loading = false;
  searchText = '';
  displayDialog = false;
  editingCollection: any = null;
  newCollection = { name: '', description: '' };
  filterType = 'all';

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections() {
    this.loading = true;
    // 模拟数据，后续接入真实服务
    setTimeout(() => {
      this.collections = [
        {
          id: '1',
          name: '示例集合',
          description: '这是一个示例集合',
          resource_count: 5,
          created_at: '2024-01-15T10:30:00Z'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  openNewDialog() {
    this.newCollection = { name: '', description: '' };
    this.editingCollection = null;
    this.displayDialog = true;
  }

  openEditDialog(collection: any) {
    this.editingCollection = { ...collection };
    this.newCollection = { name: collection.name, description: collection.description };
    this.displayDialog = true;
  }

  saveCollection() {
    if (!this.newCollection.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: '警告',
        detail: '集合名称不能为空'
      });
      return;
    }

    // 模拟保存操作
    this.messageService.add({
      severity: 'success',
      summary: '成功',
      detail: this.editingCollection ? '集合更新成功' : '集合创建成功'
    });
    this.displayDialog = false;
    this.loadCollections();
  }

  deleteCollection(collection: any) {
    this.confirmationService.confirm({
      message: `确定要删除集合"${collection.name}"吗？`,
      header: '确认删除',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // 模拟删除操作
        this.messageService.add({
          severity: 'success',
          summary: '成功',
          detail: '集合删除成功'
        });
        this.loadCollections();
      }
    });
  }

  get filteredCollections() {
    let filtered = this.collections;
    
    if (this.searchText.trim()) {
      filtered = filtered.filter(collection => 
        collection.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        collection.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.filterType !== 'all') {
      // 后续可根据类型筛选
      filtered = filtered.filter(collection => collection.type === this.filterType);
    }

    return filtered;
  }
}
