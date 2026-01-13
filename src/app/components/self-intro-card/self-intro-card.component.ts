import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-self-intro-card',
  imports: [CommonModule],
  templateUrl: './self-intro-card.component.html',
  styleUrl: './self-intro-card.component.css',
})
export class SelfIntroCardComponent {
  userName = input<string>('用户名');
  userSignature = input<string>('个性签名');
}
