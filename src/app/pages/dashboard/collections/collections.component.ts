
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Collection } from '../../../services/collection';
import { ApiCollection } from '../../../services/types';

@Component({
	selector: 'app-collections',
	standalone: true,
	imports: [CommonModule, TableModule, ButtonModule, InputTextModule, DialogModule, FormsModule, ConfirmDialogModule, ToastModule],
	providers: [ConfirmationService, MessageService],
	templateUrl: './collections.component.html',
	styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit {
	private collectionService = inject(Collection);
	private confirmationService = inject(ConfirmationService);
	private messageService = inject(MessageService);

	collections: ApiCollection[] = [];
	loading = false;
	searchText = '';
	displayDialog = false;
	editingCollection: ApiCollection | null = null;
	newCollection: Partial<ApiCollection> = { name: '', description: '' };
	expandedRows: { [key: string]: boolean } = {};

	// 假数据资源
	fakeResources = [
		{ id: 'r1', name: '示例图片1.jpg', type: 'image', url: '/public/images/gallery-default-1.jpg', created_at: '2024-01-01' },
		{ id: 'r2', name: '文档A.pdf', type: 'document', url: '', created_at: '2024-01-02' },
		{ id: 'r3', name: '视频B.mp4', type: 'video', url: '', created_at: '2024-01-03' },
	];

	ngOnInit() {
		this.loadCollections();
	}

	loadCollections() {
		this.loading = true;
		this.collectionService.getAllCollections().subscribe({
			next: (res) => {
				this.collections = res.data || [];
				this.loading = false;
			},
			error: () => {
				this.loading = false;
				this.messageService.add({ severity: 'error', summary: '错误', detail: '加载集合失败' });
			}
		});
	}

	openNewDialog() {
		this.newCollection = { name: '', description: '' };
		this.editingCollection = null;
		this.displayDialog = true;
	}

	openEditDialog(collection: ApiCollection) {
		this.editingCollection = { ...collection };
		this.newCollection = { name: collection.name, description: collection.description, id: collection.id };
		this.displayDialog = true;
	}

	saveCollection() {
		if (!this.newCollection.name?.trim()) {
			this.messageService.add({ severity: 'warn', summary: '警告', detail: '集合名称不能为空' });
			return;
		}
		if (this.editingCollection) {
			// 更新
			this.collectionService.updateOneCollection(this.editingCollection.id, this.newCollection).subscribe({
				next: () => {
					this.messageService.add({ severity: 'success', summary: '成功', detail: '集合更新成功' });
					this.displayDialog = false;
					this.loadCollections();
				},
				error: () => {
					this.messageService.add({ severity: 'error', summary: '错误', detail: '集合更新失败' });
				}
			});
		} else {
			// 新建
			this.collectionService.createOneCollection(this.newCollection).subscribe({
				next: () => {
					this.messageService.add({ severity: 'success', summary: '成功', detail: '集合创建成功' });
					this.displayDialog = false;
					this.loadCollections();
				},
				error: () => {
					this.messageService.add({ severity: 'error', summary: '错误', detail: '集合创建失败' });
				}
			});
		}
	}

	deleteCollection(collection: ApiCollection) {
		this.confirmationService.confirm({
			message: `确定要删除集合"${collection.name}"吗？`,
			header: '确认删除',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.collectionService.deleteOneCollection(collection.id).subscribe({
					next: () => {
						this.messageService.add({ severity: 'success', summary: '成功', detail: '集合删除成功' });
						this.loadCollections();
					},
					error: () => {
						this.messageService.add({ severity: 'error', summary: '错误', detail: '集合删除失败' });
					}
				});
			}
		});
	}

	toggleRowExpand(collection: ApiCollection) {
		this.expandedRows[collection.id] = !this.expandedRows[collection.id];
	}

	get filteredCollections() {
		if (!this.searchText.trim()) return this.collections;
		return this.collections.filter(c =>
			c.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
			(c.description || '').toLowerCase().includes(this.searchText.toLowerCase())
		);
	}

	// 获取集合下的资源（假数据，后续可接接口）
	getResourcesForCollection(collectionId: string) {
		// 可根据 collectionId 返回不同假数据
		return this.fakeResources;
	}
}
