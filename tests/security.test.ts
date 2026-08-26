import { describe, it, expect } from 'vitest';
import { BrowserManager } from '../src/browser-manager.js';

describe('BrowserManager Security & SSRF Protection', () => {
  it('should block navigation to 169.254.169.254 cloud IMDS', async () => {
    const manager = new BrowserManager();
    await expect(manager.navigate('http://169.254.169.254/latest/meta-data')).rejects.toThrow(
      /SSRF Guard: Blocked connection/
    );
  });

  it('should block navigation to localhost and 127.0.0.1 by default', async () => {
    const manager = new BrowserManager();
    await expect(manager.navigate('http://localhost:8080/admin')).rejects.toThrow(
      /SSRF Guard: Blocked connection/
    );
    await expect(manager.navigate('http://127.0.0.1:3000')).rejects.toThrow(
      /SSRF Guard: Blocked connection/
    );
  });

  it('should reject non-http/https protocols', async () => {
    const manager = new BrowserManager();
    await expect(manager.navigate('file:///etc/passwd')).rejects.toThrow(
      /Forbidden protocol/
    );
  });

  it('should sanitize screenshot filename against path traversal', async () => {
    const manager = new BrowserManager({ screenshotDir: './test_screenshots' });
    const result = await manager.captureScreenshot('../../../etc/evil.png');
    expect(result.path).not.toContain('..');
  });
});
