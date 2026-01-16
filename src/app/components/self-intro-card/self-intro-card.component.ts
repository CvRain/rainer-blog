import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLink } from '../../services/types';

@Component({
  selector: 'app-self-intro-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './self-intro-card.component.html',
  styleUrl: './self-intro-card.component.css',
})
export class SelfIntroCardComponent {
  userName = input<string>('用户名');
  userSignature = input<string>('个性签名');
  avatar = input<string>('');
  links = input<UserLink[]>([]);
}
