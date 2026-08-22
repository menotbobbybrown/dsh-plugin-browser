import { describe, it, expect } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { BrowserManager } from '../src/browser-manager.js';

describe('BrowserManager', () => {
  it('should manage navigation state and screenshot capture', async () => {
    const testScreenshotDir = path.join(os.tmpdir(), `test-shots-${Date.now()}`);
    const manager = new BrowserManager({ screenshotDir: testScreenshotDir });

    const shot = await manager.captureScreenshot('test_page.png');
    expect(fs.existsSync(shot.path)).toBe(true);
    expect(shot.format).toBe('png');

    await manager.close();
    expect(manager.getCurrentState().url).toBe('about:blank');

    try {
      fs.rmSync(testScreenshotDir, { recursive: true, force: true });
    } catch {}
  });
});
