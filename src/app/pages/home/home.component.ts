import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BlurCoverComponent } from '../../components/blur-cover/blur-cover.component';
import { HomeContentComponent } from '../../components/home-content/home-content.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    BlurCoverComponent,
    HomeContentComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

}
