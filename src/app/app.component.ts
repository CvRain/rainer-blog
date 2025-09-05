import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TestPageComponent } from "./pages/test-page/test-page.component";
import { ThemeService } from "./services/theme.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "rainer-blog";
  themeService = inject(ThemeService);
}
