import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-simple-footer',
  imports: [CommonModule, Card],
  templateUrl: './simple-footer.html',
  styleUrl: './simple-footer.css'
})
export class SimpleFooter {
  currentYear: number = new Date().getFullYear();
  copyright = environment.copyright;
  icp = environment.icp;
}
