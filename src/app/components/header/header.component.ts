import { Component } from '@angular/core';
import { File, Home, Menu, LucideAngularModule } from 'lucide-angular';
import { RippleModule } from 'primeng/ripple';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    LucideAngularModule,
    RippleModule,
    RouterOutlet
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
