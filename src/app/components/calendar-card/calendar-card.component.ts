import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-card.component.html',
  styleUrl: './calendar-card.component.css',
})
export class CalendarCardComponent {
  currentDate = signal(new Date());

  monthName = computed(() => {
    return this.currentDate().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  });

  days = computed(() => {
    const today = new Date();
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);

    const daysArr = [];

    // Padding for empty days at start
    const startDay = firstDay.getDay(); // 0 is Sunday
    for (let i = 0; i < startDay; i++) {
      daysArr.push({ num: '', isToday: false, hasPost: false });
    }

    // Days combined with fake post data
    for (let i = 1; i <= lastDay.getDate(); i++) {
      // Fake random posts on some days
      const hasPost = [3, 12, 15, 24, 28].includes(i);
      const isToday =
        today.getDate() === i &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      daysArr.push({ num: i, isToday, hasPost });
    }

    return daysArr;
  });

  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
}
