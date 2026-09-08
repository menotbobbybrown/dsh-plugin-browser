# dsh-plugin-browser

> **Native Headless & Visible Web Browser Automation Agent Plugin for DeepSeek Harness (`dsh`)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![DeepSeek Harness](https://img.shields.io/badge/dsh-plugin-brightgreen.svg)](https://github.com/deepseek-ai/deepseek-harness)

`dsh-plugin-browser` empowers DeepSeek Harness agents with native web browsing, live page content extraction, DOM parsing, form interaction, and visual screenshot verification.

---

## Features

- 🌐 **Web Navigation & Exploration**: Navigate to any public or internal website URL.
- 📄 **Semantic Markdown & Link Extraction**: Convert complex HTML pages into clean, token-efficient Markdown.
- 📸 **Visual Screenshots**: Capture high-resolution visual snapshots for multi-modal verification.
- 💻 **CLI Utility (`dsh-browser`)**: Direct terminal commands (`open`, `extract`, `screenshot`).
- 🧩 **Cordis Native**: Automatically exposes `browser_navigate`, `browser_extract`, and `browser_screenshot` tools.

---

## Installation

```bash
# Add from GitHub
dsh plugin --profile web add "github:menotbobbybrown/dsh-plugin-browser"
```

---

## CLI Usage

```bash
# Navigate to a URL and inspect HTTP status
npx dsh-browser open https://news.ycombinator.com

# Extract clean Markdown and hyperlinks
npx dsh-browser extract https://github.com/deepseek-ai/deepseek-harness

# Capture a screenshot
npx dsh-browser screenshot https://github.com my_screenshot.png
```

---

## Programmatic Usage (Cordis API)

```typescript
import { Context } from 'cordis';
import * as BrowserPlugin from 'dsh-plugin-browser';

const ctx = new Context();
ctx.plugin(BrowserPlugin);

// Navigate to a URL
await ctx.browser.navigate('https://deepseek.com');

// Extract clean markdown
const { markdown, links } = await ctx.browser.extract();

// Capture screenshot
const screenshot = await ctx.browser.screenshot();
```

---

## License

MIT © DeepSeek Harness Community

---

## 🤝 Contributing

Contributions are warmly welcome! Whether you are reporting an issue, proposing an adapter, optimizing performance, or fixing a bug, please check out our [Contributing Guide](CONTRIBUTING.md).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a [Pull Request](https://github.com/menotbobbybrown/dsh-plugin-browser/pulls)

---

## 📄 License & Community

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

Built with 💙 for the DeepSeek Harness community.
