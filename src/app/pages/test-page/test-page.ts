import { Component } from '@angular/core';
import { MarkdownViewer } from '../../components/markdown-viewer/markdown-viewer';

@Component({
  selector: 'app-test-page',
  imports: [MarkdownViewer],
  templateUrl: './test-page.html',
  styleUrl: './test-page.css'
})
export class TestPage {
  testContent = `
# 数学公式测试

这是一个行内公式 $E = mc^2$ 的示例。

这是一个块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

另一个公式：

$$
\\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r},t) = \\frac{i\\hbar}{2m} \\nabla^2 \\Psi(\\mathbf{r},t) + V(\\mathbf{r}) \\Psi(\\mathbf{r},t)
$$
`;
}