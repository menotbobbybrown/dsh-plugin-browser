import type { Context } from 'cordis';
import { BrowserManager } from './browser-manager.js';
import { DomParser } from './dom-parser.js';
import type {
  DshBrowserPluginConfig,
  NavigationResult,
  ExtractedContentResult,
  ScreenshotResult,
} from './types.js';

export * from './types.js';
export * from './browser-manager.js';
export * from './dom-parser.js';

export const name = 'browser';

export interface DshBrowserService {
  manager: BrowserManager;
  navigate: (url: string) => Promise<NavigationResult>;
  extract: () => Promise<ExtractedContentResult>;
  screenshot: (filename?: string) => Promise<ScreenshotResult>;
  close: () => Promise<void>;
}

declare module 'cordis' {
  interface Context {
    browser?: DshBrowserService;
  }
}

export function apply(ctx: Context, config?: DshBrowserPluginConfig): void {
  const manager = new BrowserManager(config);

  const service: DshBrowserService = {
    manager,
    navigate: (url) => manager.navigate(url),
    extract: () => manager.extractContent(),
    screenshot: (filename) => manager.captureScreenshot(filename),
    close: () => manager.close(),
  };

  ctx.provide('browser');
  ctx.browser = service;

  ctx.on('ready', () => {
    console.info('[dsh-plugin-browser] Web Browser Automation Agent subsystem ready.');

    if ((ctx as any).tools && typeof (ctx as any).tools.register === 'function') {
      (ctx as any).tools.register({
        name: 'browser_navigate',
        description: 'Navigate to any web page URL and load its DOM contents',
        parameters: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'Target website URL' },
          },
          required: ['url'],
        },
        execute: async (args: any) => service.navigate(args.url),
      });

      (ctx as any).tools.register({
        name: 'browser_extract',
        description: 'Extract semantic Markdown, text, and hyperlinks from the current browser page',
        parameters: { type: 'object', properties: {} },
        execute: async () => service.extract(),
      });

      (ctx as any).tools.register({
        name: 'browser_screenshot',
        description: 'Capture a visual screenshot of the current page for visual validation',
        parameters: {
          type: 'object',
          properties: {
            filename: { type: 'string', description: 'Optional screenshot output filename' },
          },
        },
        execute: async (args: any) => service.screenshot(args.filename),
      });
    }
  });

  ctx.on('dispose', async () => {
    await service.close();
  });
}

export default {
  name,
  apply,
};
