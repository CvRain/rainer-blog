import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { ScrollPanel } from 'primeng/scrollpanel';
import { MarkdownModule } from 'ngx-markdown';
import mermaid from 'mermaid';

@Component({
  selector: 'app-markdown-viewer',
  imports: [ScrollPanel, MarkdownModule],
  templateUrl: './markdown-viewer.html',
  styleUrls: [],
})
export class MarkdownViewer {
  markdownText = input<string>('# hello world!');
  @Output() headingsParsed = new EventEmitter<
    Array<{ level: number; text: string; id: string }>
  >();

  constructor(private elementRef: ElementRef) {}

  async onMarkdownReady(): Promise<void> {
    const headings =
      this.elementRef.nativeElement.querySelectorAll('h1, h2, h3');
    const toc: Array<{ level: number; text: string; id: string }> = [];
    headings.forEach((heading: HTMLElement, index: number) => {
      const level = parseInt(heading.tagName.substring(1), 10);
      const text = heading.textContent?.trim() || '';
      const id = `heading-${level}-${index}`;
      heading.id = id;
      toc.push({ level, text, id });
    });
    this.headingsParsed.emit(toc);

    // 渲染 mermaid 图表
    await this.renderMermaidDiagrams();
  }

  private mermaidInitialized = false;

  private async renderMermaidDiagrams(): Promise<void> {
    try {
      if (!this.mermaidInitialized) {
        const isDark =
          document.body.classList.contains('app-dark') ||
          document.documentElement.classList.contains('app-dark');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: isDark ? 'dark' : 'default',
        });
        this.mermaidInitialized = true;
      }

      const root: HTMLElement = this.elementRef.nativeElement;
      const codeBlocks = root.querySelectorAll(
        'pre > code.language-mermaid, pre > code.lang-mermaid, code.language-mermaid'
      );

      let index = 0;
      for (const code of Array.from(codeBlocks) as HTMLElement[]) {
        // 已渲染则跳过
        if (code.dataset['rendered'] === 'true') continue;

        const pre = code.parentElement as HTMLElement | null;
        const source = code.textContent ?? '';
        if (!source.trim() || !pre) continue;

        const id = `mermaid-${Date.now()}-${index++}`;
        try {
          const { svg } = await mermaid.render(id, source);
          const container = document.createElement('div');
          container.className = 'mermaid-diagram';
          container.innerHTML = svg;
          pre.replaceWith(container);
          code.dataset['rendered'] = 'true';
        } catch (err) {
          // 保留原始代码块并打印错误，避免页面崩溃
          // eslint-disable-next-line no-console
          console.error('[Mermaid] render error:', err);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[Mermaid] initialize/run error:', e);
    }
  }
}
