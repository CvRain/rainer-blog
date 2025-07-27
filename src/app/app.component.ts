import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rainer-blog';
}
