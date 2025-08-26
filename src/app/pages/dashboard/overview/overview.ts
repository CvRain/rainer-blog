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

}
