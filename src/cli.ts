#!/usr/bin/env node

import { BrowserManager } from './browser-manager.js';

export async function runCli(argv: string[]): Promise<void> {
  const args = argv.slice(2);
  const command = args[0] || 'help';

  const manager = new BrowserManager();

  switch (command) {
    case 'open':
    case 'navigate': {
      const url = args[1];
      if (!url) {
        console.error('Error: URL is required.');
        console.error('Usage: dsh-browser open <url>');
        process.exit(1);
      }
      console.log(`🌐 Navigating to ${url}...`);
      const res = await manager.navigate(url);
      console.log(`\n✅ Loaded: ${res.title} (${res.url}) - Status: ${res.status} [${res.contentLength} bytes]\n`);
      break;
    }

    case 'extract': {
      const url = args[1];
      if (!url) {
        console.error('Error: URL is required.');
        console.error('Usage: dsh-browser extract <url>');
        process.exit(1);
      }
      await manager.navigate(url);
      const content = await manager.extractContent();
      console.log(`\n📄 Extracted Markdown for "${content.title}":\n`);
      console.log(content.markdown.slice(0, 1500));
      console.log('\n...');
      console.log(`🔗 Found ${content.links.length} hyperlinks.\n`);
      break;
    }

    case 'screenshot': {
      const url = args[1];
      if (!url) {
        console.error('Error: URL is required.');
        console.error('Usage: dsh-browser screenshot <url> [output.png]');
        process.exit(1);
      }
      await manager.navigate(url);
      const filename = args[2];
      const shot = await manager.captureScreenshot(filename);
      console.log(`\n📸 Screenshot captured at: ${shot.path}\n`);
      break;
    }

    case 'help':
    default: {
      console.log(`
dsh-browser - DeepSeek Harness Web Browser Automation CLI

Usage:
  dsh-browser open <url>
      Navigate to a website and inspect HTTP response status and title.

  dsh-browser extract <url>
      Extract semantic clean Markdown and hyperlinks from a web page.

  dsh-browser screenshot <url> [filename.png]
      Capture a visual snapshot of a web page.
      `);
      break;
    }
  }
}

const isDirectExecution =
  typeof process !== 'undefined' &&
  Boolean(
    process.argv[1] &&
      (process.argv[1].endsWith('cli.js') ||
        process.argv[1].endsWith('cli.cjs') ||
        process.argv[1].endsWith('dsh-browser'))
  );

if (isDirectExecution) {
  runCli(process.argv).catch((err) => {
    console.error('Fatal CLI Error:', err);
    process.exit(1);
  });
}
