import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { full as emoji } from 'markdown-it-emoji';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import Shiki from '@shikijs/markdown-it';
import markdownit from 'markdown-it';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-markdown-viewer',
  imports: [],
  templateUrl: './markdown-viewer.html',
  styleUrls: ['./markdown-viewer.css'],
})
export class MarkdownViewer implements OnInit, OnChanges, OnDestroy {
  @Input() markdownText: string = '# Hello world!';
  @Input() theme: 'light' | 'dark' | 'auto' = 'light';
  htmlText: string = '';
  private styleLink: HTMLLinkElement | null = null;

  async ngOnInit(): Promise<void> {
    this.loadMarkdownStyles();
    await this.renderMarkdown();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['markdownText'] && !changes['markdownText'].firstChange) {
      await this.renderMarkdown();
    }

    if (changes['theme'] && !changes['theme'].firstChange) {
      this.loadMarkdownStyles();
      await this.renderMarkdown();
    }
  }

  ngOnDestroy(): void {
    // 组件销毁时移除动态添加的样式链接
    if (this.styleLink) {
      this.styleLink.remove();
    }
  }

  private loadMarkdownStyles(): void {
    // 移除之前添加的样式链接
    if (this.styleLink) {
      this.styleLink.remove();
    }

    // 根据主题选择合适的 CSS 文件
    let cssFile = 'github-markdown.css';
    if (this.theme === 'dark') {
      cssFile = 'github-markdown-dark.css';
    } else if (this.theme === 'light') {
      cssFile = 'github-markdown-light.css';
    }

    // 创建新的样式链接
    this.styleLink = document.createElement('link');
    this.styleLink.rel = 'stylesheet';
    this.styleLink.href = `styles/${cssFile}`;
    document.head.appendChild(this.styleLink);
  }

  async renderMarkdown(): Promise<void> {
    const md = markdownit({
      html: true,
      xhtmlOut: true,
      breaks: true,
      langPrefix: 'language-',
      linkify: true,
      typographer: true
    });

    md.use(emoji)
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.linkInsideHeader({
          symbol: `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          `,
          placement: 'before'
        })
      })
      .use(markdownItTocDoneRight, {
        listType: 'ul',
        containerClass: 'toc-container'
      })
      .use(markdownItLinkAttributes, {
        pattern: /^https?:\/\//,
        attrs: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      })
      .use(
        await Shiki({
          theme: 'github-light'
        })
      );

    this.htmlText = DOMPurify.sanitize(md.render(this.markdownText));
  }
}
