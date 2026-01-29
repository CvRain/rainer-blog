import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.css',
})
export class ActivityCardComponent {
  // Fake data for last week
  newArticles = signal(3);
  newVisitors = signal(420);

  // Simple sparkline-like visual helpers
  weeklyActivity = signal([
    { day: 'M', val: 20 },
    { day: 'T', val: 45 },
    { day: 'W', val: 30 },
    { day: 'T', val: 60 },
    { day: 'F', val: 80 },
    { day: 'S', val: 55 },
    { day: 'S', val: 40 },
  ]);

  // Calculate max for bar height
  maxVal = 80;
}
