import { describe, it, expect } from 'vitest';
import { DomParser } from '../src/dom-parser.js';

describe('DomParser', () => {
  it('should convert HTML to clean Markdown with headings, paragraphs, and links', () => {
    const html = `
      <html>
        <head><title>Test Page</title></head>
        <body>
          <h1>Welcome to DeepSeek Harness</h1>
          <p>This is a paragraph with a <a href="https://deepseek.com">DeepSeek Link</a>.</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
          </ul>
        </body>
      </html>
    `;

    const md = DomParser.htmlToMarkdown(html);
    expect(md).toContain('# Welcome to DeepSeek Harness');
    expect(md).toContain('[DeepSeek Link](https://deepseek.com)');
    expect(md).toContain('- Feature 1');
  });

  it('should extract structured hyperlinks from HTML', () => {
    const html = `
      <div>
        <a href="https://example.com/docs">Documentation</a>
        <a href="https://example.com/api">API Reference</a>
      </div>
    `;

    const links = DomParser.extractLinks(html);
    expect(links.length).toBe(2);
    expect(links[0].href).toBe('https://example.com/docs');
    expect(links[0].text).toBe('Documentation');
  });
});
