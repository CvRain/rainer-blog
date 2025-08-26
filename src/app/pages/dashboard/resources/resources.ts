import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule],
  templateUrl: './resources.html',
  styleUrl: './resources.css'
})
export class Resources {

}
