/**
 * A lightweight, self-contained Markdown parser that converts basic markdown
 * structure and inline elements into clean, safe HTML.
 */
export function renderMarkdown(md) {
  if (!md) return '';

  // 1. Escape HTML entities to prevent raw HTML injection/XSS
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Split lines and process block elements
  const lines = html.split('\n');
  const result = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let currentList = null; // 'ul', 'ol', or null
  let listItems = [];

  const closeList = () => {
    if (currentList) {
      const tag = currentList;
      const itemsHtml = listItems.map(item => `<li>${parseInlineMarkdown(item)}</li>`).join('');
      result.push(`<${tag}>${itemsHtml}</${tag}>`);
      currentList = null;
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks (toggle)
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Close code block - preserve code formatting
        result.push(`<pre><code>${codeBlockContent.join('\n')}</code></pre>`);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Open code block
        closeList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Headers
    const h4Match = line.match(/^####\s+(.*)$/);
    const h3Match = line.match(/^###\s+(.*)$/);
    const h2Match = line.match(/^##\s+(.*)$/);
    const h1Match = line.match(/^#\s+(.*)$/);

    if (h1Match || h2Match || h3Match || h4Match) {
      closeList();
      if (h1Match) result.push(`<h1>${parseInlineMarkdown(h1Match[1])}</h1>`);
      else if (h2Match) result.push(`<h2>${parseInlineMarkdown(h2Match[1])}</h2>`);
      else if (h3Match) result.push(`<h3>${parseInlineMarkdown(h3Match[1])}</h3>`);
      else if (h4Match) result.push(`<h4>${parseInlineMarkdown(h4Match[1])}</h4>`);
      continue;
    }

    // Blockquotes
    const bqMatch = line.match(/^\s*&gt;\s*(.*)$/);
    if (bqMatch) {
      closeList();
      result.push(`<blockquote>${parseInlineMarkdown(bqMatch[1])}</blockquote>`);
      continue;
    }

    // Unordered list items (- item or * item)
    const ulMatch = line.match(/^[\s]*[-*]\s+(.*)$/);
    if (ulMatch) {
      if (currentList !== 'ul') {
        closeList();
        currentList = 'ul';
      }
      listItems.push(ulMatch[1]);
      continue;
    }

    // Ordered list items (1. item)
    const olMatch = line.match(/^[\s]*\d+\.\s+(.*)$/);
    if (olMatch) {
      if (currentList !== 'ol') {
        closeList();
        currentList = 'ol';
      }
      listItems.push(olMatch[1]);
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      closeList();
      continue;
    }

    // Normal paragraph line
    closeList();
    result.push(`<p>${parseInlineMarkdown(line)}</p>`);
  }

  closeList();

  return result.join('\n');
}

function parseInlineMarkdown(text) {
  let inline = text;

  // Images: ![alt](url)
  inline = inline.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="md-image" />');

  // Links: [text](url)
  inline = inline.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>');

  // Bold: **text** or __text__
  inline = inline.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  inline = inline.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  inline = inline.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  inline = inline.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Inline Code: `code`
  inline = inline.replace(/`([^`]+)`/g, '<code>$1</code>');

  return inline;
}
