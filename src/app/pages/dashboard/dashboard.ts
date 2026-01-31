import { Component, inject, OnInit } from '@angular/core';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { SimpleFooter } from '../../components/simple-footer/simple-footer';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TotalOverview } from '../../services/types';
import { User } from '../../services/user';
import {
  ProjectExplorerComponent,
  FileNodeData,
} from '../../components/dashboard/project-explorer/project-explorer.component';

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
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userService = inject(User);
  router = inject(Router);

  sidebarVisible = true;

  totalView: TotalOverview = {} as TotalOverview;

  ngOnInit(): void {
    this.loadTotalOverview();
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
    // Temporary navigation logic until we have full tab system
    switch (data.type) {
      case 'theme':
        this.router.navigate(['/dashboard/themes', data.id]);
        break;
      case 'chapter':
        // We need themeId for this route, which is parentId for a chapter
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

  onChildActivate(instance: any) {
    if (
      instance &&
      'setTotalView' in instance &&
      typeof instance.setTotalView === 'function'
    ) {
      instance.setTotalView(this.totalView);
    }
  }
}
