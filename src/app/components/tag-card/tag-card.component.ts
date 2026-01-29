import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-card.component.html',
  styleUrl: './tag-card.component.css',
})
export class TagCardComponent {
  tags = signal([
    {
      name: 'Angular',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    },
    {
      name: 'TailwindCSS',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      name: 'TypeScript',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      name: 'Node.js',
      color:
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    },
    {
      name: 'Docker',
      color:
        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
    },
    {
      name: 'Git',
      color:
        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
    },
    {
      name: 'Design',
      color:
        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    },
    {
      name: 'Life',
      color:
        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
  ]);
}
