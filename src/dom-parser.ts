/**
 * Semantic HTML to Markdown Converter & Link Extractor
 */
export class DomParser {
  public static htmlToMarkdown(html: string): string {
    let text = html;

    // Remove scripts and styles
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Headings
    text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
    text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
    text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');

    // Paragraphs & Line breaks
    text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');
    text = text.replace(/<br\s*[\/]?>/gi, '\n');

    // List items
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

    // Links
    text = text.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Strip all remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Normalize multiple newlines and spaces
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line, i, arr) => line !== '' || (i > 0 && arr[i - 1] !== ''))
      .join('\n')
      .trim();
  }

  public static extractLinks(html: string): Array<{ text: string; href: string }> {
    const links: Array<{ text: string; href: string }> = [];
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
        links.push({ text: text || href, href });
      }
    }

    return links;
  }
}
