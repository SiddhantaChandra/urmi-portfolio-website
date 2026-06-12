/**
 * Data Transformation Layer for BlockNote Editor
 * Bridges BlockNote's internal format and the application's stored format.
 */

// Convert BlockNote block array -> app's internal { blocks: [...] } JSON structure
export function blockNoteToBlocks(editorDocument) {
  if (!Array.isArray(editorDocument)) return { blocks: [] };

  const blocks = editorDocument.map((block) => {
    const base = {
      id: block.id || generateId(),
      type: mapBlockNoteTypeToAppType(block.type),
    };

    switch (block.type) {
      case 'paragraph':
        return {
          ...base,
          content: { text: inlineContentToText(block.content) },
        };

      case 'heading':
        return {
          ...base,
          content: {
            text: inlineContentToText(block.content),
            level: block.props?.level || 2,
          },
        };

      case 'bulletListItem':
      case 'numberedListItem':
        return {
          ...base,
          content: {
            text: inlineContentToText(block.content),
          },
        };

      case 'quote':
        return {
          ...base,
          content: {
            text: inlineContentToText(block.content),
          },
        };

      case 'table':
        return {
          ...base,
          content: {
            rows: (block.content?.rows || []).map((row) =>
              (row.cells || []).map((cell) => inlineContentToText(cell))
            ),
          },
        };

      case 'image':
        return {
          ...base,
          content: {
            url: block.props?.url || '',
            alt: block.props?.alt || '',
            caption: block.props?.caption || '',
            name: block.props?.name || '',
          },
        };

      default:
        return {
          ...base,
          content: { text: inlineContentToText(block.content) },
        };
    }
  });

  return { blocks };
}

// Convert stored { blocks: [...] } -> BlockNote format for editing
export function blocksToBlockNote(contentJson) {
  if (!contentJson || !Array.isArray(contentJson.blocks)) {
    return [
      { type: 'paragraph', content: '' },
    ];
  }

  return contentJson.blocks.map((block) => {
    switch (block.type) {
      case 'text':
        return {
          type: 'paragraph',
          content: textToInlineContent(block.content?.text || ''),
        };

      case 'heading':
        return {
          type: 'heading',
          props: { level: block.content?.level || 2 },
          content: textToInlineContent(block.content?.text || ''),
        };

      case 'bulletList':
        return {
          type: 'bulletListItem',
          content: textToInlineContent(block.content?.text || ''),
        };

      case 'numberedList':
        return {
          type: 'numberedListItem',
          content: textToInlineContent(block.content?.text || ''),
        };

      case 'quote':
        return {
          type: 'quote',
          content: textToInlineContent(block.content?.text || ''),
        };

      case 'table':
        return {
          type: 'table',
          content: {
            rows: (block.content?.rows || []).map((row) => ({
              cells: row.map((cell) => textToInlineContent(cell || '')),
            })),
          },
        };

      case 'image':
        return {
          type: 'image',
          props: {
            url: block.content?.url || '',
            alt: block.content?.alt || '',
            caption: block.content?.caption || '',
            name: block.content?.name || '',
          },
        };

      default:
        return {
          type: 'paragraph',
          content: textToInlineContent(block.content?.text || ''),
        };
    }
  });
}

// Render stored blocks to HTML for frontend display
export function blocksToHtml(contentJson) {
  if (!contentJson || !Array.isArray(contentJson.blocks)) return '';

  return contentJson.blocks.map((block) => renderBlockToHtml(block)).join('');
}

function renderBlockToHtml(block) {
  const c = block.content;
  switch (block.type) {
    case 'text':
      return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${escapeHtml(c?.text || '')}</p>`;

    case 'heading': {
      const Tag = `h${c?.level || 2}`;
      return `<${Tag} class="font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">${escapeHtml(c?.text || '')}</${Tag}>`;
    }

    case 'bulletList':
      return `<ul class="list-disc list-inside space-y-2 mb-6 ml-4"><li class="text-gray-700 dark:text-gray-300 leading-relaxed">${escapeHtml(c?.text || '')}</li></ul>`;

    case 'numberedList':
      return `<ol class="list-decimal list-inside space-y-2 mb-6 ml-4"><li class="text-gray-700 dark:text-gray-300 leading-relaxed">${escapeHtml(c?.text || '')}</li></ol>`;

    case 'quote':
      return `<blockquote class="border-l-4 border-purple-600 dark:border-purple-400 pl-6 py-4 my-8 bg-purple-50/50 dark:bg-purple-900/20 rounded-r-lg italic text-lg text-gray-700 dark:text-gray-300">${escapeHtml(c?.text || '')}</blockquote>`;

    case 'table': {
      const rows = c?.rows || [];
      if (!rows.length) return '';
      return `<table class="w-full border-collapse mb-6"><tbody>${rows.map((row, ri) => `<tr class="${ri % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}">${row.map((cell) => `<td class="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">${escapeHtml(cell || '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }

    case 'image':
      return `<figure class="my-8"><img src="${escapeHtml(c?.url || '')}" alt="${escapeHtml(c?.alt || '')}" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" />${c?.caption ? `<figcaption class="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 italic">${escapeHtml(c.caption)}</figcaption>` : ''}</figure>`;

    default:
      return '';
  }
}

// Helpers
function inlineContentToText(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        if (item.type === 'text') return item.text || '';
        return item.text || '';
      }
      return '';
    }).join('');
  }
  if (content.text !== undefined) return content.text || '';
  return '';
}

function textToInlineContent(text) {
  if (!text) return '';
  return [{ type: 'text', text, styles: {} }];
}

function mapBlockNoteTypeToAppType(type) {
  switch (type) {
    case 'paragraph': return 'text';
    case 'heading': return 'heading';
    case 'bulletListItem': return 'bulletList';
    case 'numberedListItem': return 'numberedList';
    case 'quote': return 'quote';
    case 'table': return 'table';
    case 'image': return 'image';
    default: return 'text';
  }
}

function generateId() {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
