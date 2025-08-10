export class MarkdownViewer {
  markdownText = '# hello world!'; // 初始化 Markdown 内容

  // 添加一个方法来动态更新 Markdown 内容（如果需要）
  updateMarkdown(newContent: string) {
    this.markdownText = newContent;
  }
}