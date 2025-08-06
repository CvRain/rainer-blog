import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, Card],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  copyright = environment.copyright;
  icp = environment.icp;
}
