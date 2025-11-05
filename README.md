# RainerBlog

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.

## Development server
## Mermaid 支持

Markdown 查看组件 `MarkdownViewer` 已支持 Mermaid 渲染。使用方法：

- 在 Markdown 中使用代码围栏并指定语言为 `mermaid`：

````markdown
```mermaid
graph TD;
	A[Start] --> B{Is it working?};
	B -- Yes --> C[Ship it];
	B -- No --> D[Fix it] --> B;
```
````

- 组件会在渲染完成后自动将上述代码块替换为 SVG 图。
- 主题将根据页面是否存在 `.app-dark` 类自动使用浅色/深色主题。

注意事项：

- 渲染时采用 `securityLevel: 'strict'` 以提升安全性。
- 重复渲染会跳过已处理的代码块，避免闪烁和重复替换。

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
