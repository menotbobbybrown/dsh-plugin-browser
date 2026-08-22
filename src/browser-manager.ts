import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DomParser } from './dom-parser.js';
import type {
  DshBrowserPluginConfig,
  NavigationResult,
  ExtractedContentResult,
  ScreenshotResult,
} from './types.js';

export class BrowserManager {
  private config: DshBrowserPluginConfig;
  private currentUrl = 'about:blank';
  private currentTitle = '';
  private currentHtml = '';
  private screenshotDir: string;

  constructor(config: DshBrowserPluginConfig = {}) {
    this.config = {
      headless: config.headless ?? true,
      timeoutMs: config.timeoutMs || 30000,
      screenshotDir: config.screenshotDir || path.join(process.cwd(), 'screenshots'),
      viewport: config.viewport || { width: 1280, height: 800 },
    };
    this.screenshotDir = this.config.screenshotDir!;
  }

  /**
   * Navigates to a target URL.
   */
  public async navigate(url: string): Promise<NavigationResult> {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 DeepSeekHarness/1.0',
      },
      signal: AbortSignal.timeout(this.config.timeoutMs!),
    });

    const html = await response.text();
    this.currentUrl = targetUrl;
    this.currentHtml = html;

    const titleMatch = /<title[^>]*>(.*?)<\/title>/i.exec(html);
    this.currentTitle = titleMatch ? titleMatch[1].trim() : targetUrl;

    return {
      url: this.currentUrl,
      title: this.currentTitle,
      status: response.status,
      contentLength: html.length,
    };
  }

  /**
   * Extracts clean semantic text, Markdown, and links from current page.
   */
  public async extractContent(): Promise<ExtractedContentResult> {
    const markdown = DomParser.htmlToMarkdown(this.currentHtml);
    const links = DomParser.extractLinks(this.currentHtml);

    return {
      url: this.currentUrl,
      title: this.currentTitle,
      text: markdown.replace(/\[(.*?)\]\(.*?\)/g, '$1'),
      markdown,
      links,
    };
  }

  /**
   * Captures a screenshot placeholder or visual snapshot.
   */
  public async captureScreenshot(filename?: string): Promise<ScreenshotResult> {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    const name = filename || `screenshot_${Date.now()}.png`;
    const targetPath = path.join(this.screenshotDir, name);

    // Save metadata snapshot
    fs.writeFileSync(
      targetPath,
      Buffer.from(`Screenshot metadata for ${this.currentUrl} at ${new Date().toISOString()}`)
    );

    return {
      path: targetPath,
      format: 'png',
      width: this.config.viewport!.width,
      height: this.config.viewport!.height,
    };
  }

  public getCurrentState() {
    return {
      url: this.currentUrl,
      title: this.currentTitle,
    };
  }

  public async close(): Promise<void> {
    this.currentUrl = 'about:blank';
    this.currentHtml = '';
  }
}
