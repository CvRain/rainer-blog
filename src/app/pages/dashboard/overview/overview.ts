import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview {
  totalView = {
    article_append_weekly: 0,
    article_count: 0,
    collection_append_weekly: 0,
    collection_count: 0,
    resource_append_weekly: 0,
    resource_count: 0,
    theme_append_weekly: 0,
    theme_count: 0
  };

  setTotalView(totalView: any) {
    if (totalView) {
      this.totalView = totalView;
    }
  }
}
