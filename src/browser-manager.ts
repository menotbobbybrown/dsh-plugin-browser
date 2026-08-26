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
   * Validates target URL against SSRF and cloud metadata endpoints.
   */
  private validateUrlSafety(targetUrl: string): void {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      throw new Error(`[Security] Invalid target URL: ${targetUrl}`);
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`[Security] Forbidden protocol "${parsed.protocol}". Only http: and https: are allowed.`);
    }

    const host = parsed.hostname.toLowerCase();

    // Check for loopback, cloud metadata, and private network ranges
    const isPrivate =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '169.254.169.254' || // AWS/GCP/Azure IMDS
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^10\.\d+\.\d+\.\d+$/.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(host) ||
      /^192\.168\.\d+\.\d+$/.test(host);

    if (isPrivate && !this.config.allowPrivateNetworks) {
      throw new Error(`[Security] SSRF Guard: Blocked connection to restricted/private host "${host}".`);
    }
  }

  /**
   * Navigates to a target URL.
   */
  public async navigate(url: string): Promise<NavigationResult> {
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url);
    const targetUrl = hasScheme ? url : `https://${url}`;
    this.validateUrlSafety(targetUrl);

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

    // Sanitize filename to prevent directory traversal
    const safeName = filename
      ? path.basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, '_')
      : `screenshot_${Date.now()}.png`;

    const targetPath = path.resolve(this.screenshotDir, safeName);
    if (!targetPath.startsWith(path.resolve(this.screenshotDir))) {
      throw new Error(`[Security] Path traversal attempt detected in screenshot filename.`);
    }

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
