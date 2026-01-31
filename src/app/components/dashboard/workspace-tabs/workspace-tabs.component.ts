import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileNodeData } from '../project-explorer/project-explorer.component';

export interface TabData extends FileNodeData {
  title: string;
  icon?: string;
  isDirty?: boolean; // For unsaved changes indicator
}

@Component({
  selector: 'app-workspace-tabs',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './workspace-tabs.component.html',
  styleUrl: './workspace-tabs.component.css',
})
export class WorkspaceTabsComponent {
  @Input() tabs: TabData[] = [];
  @Input() activeTabId: string | null = null;

  @Output() onTabClick = new EventEmitter<string>();
  @Output() onTabClose = new EventEmitter<string>();

  handleTabClick(id: string) {
    this.onTabClick.emit(id);
  }

  handleTabClose(event: MouseEvent, id: string) {
    event.stopPropagation(); // Prevent tab activation when closing
    this.onTabClose.emit(id);
  }
}
