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
