import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule],
  templateUrl: './themes.html',
  styleUrl: './themes.css'
})
export class Themes {

}
