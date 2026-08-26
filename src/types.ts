export interface DshBrowserPluginConfig {
  /**
   * Run browser in headless mode.
   * Default: true
   */
  headless?: boolean;

  /**
   * Default timeout in milliseconds for navigation and element waits.
   * Default: 30000ms
   */
  timeoutMs?: number;

  /**
   * Directory where screenshots are saved.
   * Default: ./screenshots
   */
  screenshotDir?: string;

  /**
   * Browser viewport dimensions.
   */
  viewport?: {
    width: number;
    height: number;
  };
  /**
   * Explicitly allow navigation to local / private loopback addresses.
   * Default: false (SSRF Protection Enabled)
   */
  allowPrivateNetworks?: boolean;
}

export interface NavigationResult {
  url: string;
  title: string;
  status: number;
  contentLength: number;
}

export interface ExtractedContentResult {
  url: string;
  title: string;
  text: string;
  markdown: string;
  links: Array<{ text: string; href: string }>;
}

export interface ScreenshotResult {
  path: string;
  format: 'png' | 'jpeg';
  width: number;
  height: number;
}
