import { Component, inject, OnInit } from '@angular/core';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { SimpleFooter } from '../../components/simple-footer/simple-footer';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TotalOverview } from '../../services/types';
import { User } from '../../services/user';
import {
  ProjectExplorerComponent,
  FileNodeData,
} from '../../components/dashboard/project-explorer/project-explorer.component';
import {
  WorkspaceTabsComponent,
  TabData,
} from '../../components/dashboard/workspace-tabs/workspace-tabs.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [
    MiniHeader,
    SimpleFooter,
    RouterOutlet,
    CommonModule,
    ButtonModule,
    TooltipModule,
    ProjectExplorerComponent,
    WorkspaceTabsComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userService = inject(User);
  router = inject(Router);

  sidebarVisible = true;
  totalView: TotalOverview = {} as TotalOverview;

  // Tabs State
  tabs: TabData[] = [];
  activeTabId: string | null = null;

  ngOnInit(): void {
    this.loadTotalOverview();

    // Attempt to restore tab state from URL on load (basic sync)
    // This is optional but good for UX if user refreshes
  }

  loadTotalOverview() {
    this.userService.totalOverview().subscribe((res) => {
      if (res.code === 200) {
        this.totalView = res.data || ({} as TotalOverview);
        console.log(this.totalView);
      }
    });
  }

  handleFileSelect(data: FileNodeData) {
    this.openTab(data);
  }

  openTab(data: FileNodeData) {
    // 1. Check if tab already exists
    const existingTab = this.tabs.find((t) => t.id === data.id);

    if (existingTab) {
      this.activeTabId = existingTab.id;
    } else {
      // 2. Add new tab
      const newTab: TabData = {
        ...data,
        title: this.getNodeTitle(data),
      };
      this.tabs.push(newTab);
      this.activeTabId = newTab.id;
    }

    // 3. Navigate
    this.navigateToTab(data);
  }

  getNodeTitle(data: FileNodeData): string {
    if (data.type === 'article') return data.item.title;
    if (data.type === 'chapter') return data.item.name;
    if (data.type === 'theme') return data.item.name;
    return 'Untitled';
  }

  navigateToTab(data: FileNodeData) {
    switch (data.type) {
      case 'theme':
        this.router.navigate(['/dashboard/themes', data.id]);
        break;
      case 'chapter':
        if (data.parentId) {
          this.router.navigate([
            '/dashboard/themes',
            data.parentId,
            'chapters',
            data.id,
          ]);
        }
        break;
      case 'article':
        this.router.navigate(['/dashboard/articles', data.id, 'edit']);
        break;
    }
  }

  onTabClicked(tabId: string) {
    this.activeTabId = tabId;
    const tab = this.tabs.find((t) => t.id === tabId);
    if (tab) {
      this.navigateToTab(tab);
    }
  }

  onTabClosed(tabId: string) {
    const index = this.tabs.findIndex((t) => t.id === tabId);
    if (index === -1) return;

    // Remove tab
    this.tabs.splice(index, 1);

    // Any active tab left?
    if (this.tabs.length === 0) {
      this.activeTabId = null;
      this.router.navigate(['/dashboard/overview']);
      return;
    }

    // If we closed the active tab, switch to another one
    if (this.activeTabId === tabId) {
      // Try to go to the right, otherwise left
      const nextTab = this.tabs[index] || this.tabs[index - 1];
      if (nextTab) {
        this.activeTabId = nextTab.id;
        this.navigateToTab(nextTab);
      }
    }
  }

  onChildActivate(instance: any) {
    if (
      instance &&
      'setTotalView' in instance &&
      typeof instance.setTotalView === 'function'
    ) {
      instance.setTotalView(this.totalView);
    }
  }

  handleCreate(event: {
    type: 'theme' | 'chapter' | 'article';
    parentId?: string;
  }) {
    if (event.type === 'theme') {
      this.router.navigate(['/dashboard/themes', 'new']);
    } else if (event.type === 'article') {
      // If we have parentId (chapter), maybe pre-select it?
      // For now just go to new article page
      this.router.navigate(['/dashboard/articles', 'new'], {
        queryParams: { chapterId: event.parentId },
      });
    }
  }
}
