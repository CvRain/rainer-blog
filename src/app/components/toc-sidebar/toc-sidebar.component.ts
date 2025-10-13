import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-toc-sidebar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./toc-sidebar.component.html",
  styleUrls: ["./toc-sidebar.component.css"],
})
export class TocSidebarComponent {
  @Input() tocHeadings: Array<{ level: number; text: string; id: string }> = [];

  scrollToHeading(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
