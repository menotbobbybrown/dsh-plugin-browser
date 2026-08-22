import { describe, it, expect } from 'vitest';
import { Context } from 'cordis';
import * as BrowserPlugin from '../src/index.js';

describe('BrowserPlugin (Cordis)', () => {
  it('should attach browser service to cordis context', async () => {
    const ctx = new Context();
    ctx.plugin(BrowserPlugin);

    expect(ctx.browser).toBeDefined();
    expect(typeof ctx.browser.navigate).toBe('function');
    expect(typeof ctx.browser.extract).toBe('function');
    expect(typeof ctx.browser.screenshot).toBe('function');
  });
});
