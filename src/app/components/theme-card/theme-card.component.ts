import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Image } from 'primeng/image';

@Component({
  selector: 'app-theme-card',
  imports: [CardModule, ButtonModule, Image],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.css'
})
export class ThemeCardComponent {

}
