import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
} from "@angular/core";
import { ScrollPanel } from "primeng/scrollpanel";
import { MarkdownModule } from "ngx-markdown";

@Component({
  selector: "app-markdown-viewer",
  imports: [ScrollPanel, MarkdownModule],
  templateUrl: "./markdown-viewer.html",
  styleUrls: [],
})
export class MarkdownViewer {
  markdownText = input<string>("# hello world!");
  @Output() headingsParsed = new EventEmitter<
    Array<{ level: number; text: string; id: string }>
  >();

  constructor(private elementRef: ElementRef) {}

  onMarkdownReady(): void {
    const headings =
      this.elementRef.nativeElement.querySelectorAll("h1, h2, h3");
    const toc: Array<{ level: number; text: string; id: string }> = [];
    headings.forEach((heading: HTMLElement, index: number) => {
      const level = parseInt(heading.tagName.substring(1), 10);
      const text = heading.textContent?.trim() || "";
      const id = `heading-${level}-${index}`;
      heading.id = id;
      toc.push({ level, text, id });
    });
    this.headingsParsed.emit(toc);
  }
}
