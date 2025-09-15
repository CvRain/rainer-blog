import { Component, input } from "@angular/core";
import { ScrollPanel } from "primeng/scrollpanel";
import { MarkdownComponent, MarkdownModule } from "ngx-markdown";

@Component({
  selector: "app-markdown-viewer",
  imports: [ScrollPanel, MarkdownModule],
  templateUrl: "./markdown-viewer.html",
  styleUrls: [],
})
export class MarkdownViewer {
  markdownText = input<string>("# hello world!");
}
