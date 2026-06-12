/**
 * Article Content Transformation Layer
 * Bridges BlockNote editor format with the application's stored JSON format.
 */

// Supported block types in our application
const SUPPORTED_BLOCK_TYPES = [
  'paragraph',
  'heading',
  'image',
  'list',
  'quote',
  'table',
];

/**
 * Convert BlockNote editor document to our application's stored JSON format.
 * BlockNote format: { type: 'paragraph', props: {}, content: [...], children: [...] }
 * Our format: { type: 'paragraph', content: { text: '...', level: 2, ... } }
 */
export function blockNoteToBlocks(editorDocument) {
  if (!editorDocument || !Array.isArray(editorDocument)) {
    return { blocks: [] };
  }

  const blocks = editorDocument.map((block, index) => {
    return convertBlockNoteBlock(block, index);
  }).filter(Boolean);

  return { blocks };
}

function convertBlockNoteBlock(block, index) {
  const base = {
    id: block.id || `block-${index}`,
    type: block.type,
    displayOrder: index,
  };

  switch (block.type) {
    case 'paragraph': {
      return {
        ...base,
        type: 'paragraph',
        content: {
          text: blockNoteTextToString(block.content),
        },
      };
    }

    case 'heading': {
      return {
        ...base,
        type: 'heading',
        content: {
          text: blockNoteTextToString(block.content),
          level: block.props?.level || 2,
        },
      };
    }

    case 'image': {
      return {
        ...base,
        type: 'image',
        content: {
          src: block.props?.url || '',
          alt: block.props?.alt || '',
          caption: block.props?.caption || '',
        },
      };
    }

    case 'bulletListItem': {
      // BlockNote bullet items are separate blocks. We group them into a single list block.
      // But for simplicity, we store each item individually and let the frontend handle grouping.
      return {
        ...base,
        type: 'list',
        content: {
          listType: 'bullet',
          items: [blockNoteTextToString(block.content)],
        },
      };
    }

    case 'numberedListItem': {
      return {
        ...base,
        type: 'list',
        content: {
          listType: 'numbered',
          items: [blockNoteTextToString(block.content)],
        },
      };
    }

    case 'quote': {
      return {
        ...base,
        type: 'quote',
        content: {
          text: blockNoteTextToString(block.content),
        },
      };
    }

    case 'table': {
      return {
        ...base,
        type: 'table',
        content: {
          rows: (block.content?.rows || []).map(row =>
            (row.cells || []).map(cell => blockNoteTextToString(cell))
          ),
        },
      };
    }

    default:
      // Fallback: treat as paragraph
      return {
        ...base,
        type: 'paragraph',
        content: {
          text: blockNoteTextToString(block.content),
        },
      };
  }
}

/**
 * Convert BlockNote inline content array to a plain string.
 * BlockNote: [{ type: 'text', text: 'hello', styles: { bold: true } }, { type: 'text', text: ' world' }]
 * For our storage, we keep the raw array for rich text, but also provide a string fallback.
 */
function blockNoteTextToString(content) {
  if (!content || !Array.isArray(content)) return '';
  return content.map(item => {
    if (typeof item === 'string') return item;
    if (item.type === 'text') return item.text || '';
    if (item.type === 'link') return item.text || item.href || '';
    return '';
  }).join('');
}

function blockNoteTextToRichText(content) {
  if (!content || !Array.isArray(content)) return [];
  return content.map(item => {
    if (typeof item === 'string') return { type: 'text', text: item };
    if (item.type === 'text') {
      return {
        type: 'text',
        text: item.text || '',
        styles: item.styles || {},
      };
    }
    if (item.type === 'link') {
      return {
        type: 'link',
        text: item.text || '',
        href: item.href || '',
        styles: item.styles || {},
      };
    }
    return { type: 'text', text: '' };
  });
}

/**
 * Convert our stored JSON format to BlockNote format for editing.
 */
export function blocksToBlockNote(contentJson) {
  if (!contentJson || !contentJson.blocks || !Array.isArray(contentJson.blocks)) {
    return [];
  }

  return contentJson.blocks.map((block, index) => {
    return convertAppBlockToBlockNote(block, index);
  }).filter(Boolean);
}

function convertAppBlockToBlockNote(block, index) {
  const content = block.content || {};

  switch (block.type) {
    case 'paragraph': {
      return {
        id: block.id || `block-${index}`,
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: content.text || '', styles: {} }],
        children: [],
      };
    }

    case 'heading': {
      return {
        id: block.id || `block-${index}`,
        type: 'heading',
        props: { level: content.level || 2 },
        content: [{ type: 'text', text: content.text || '', styles: {} }],
        children: [],
      };
    }

    case 'image': {
      return {
        id: block.id || `block-${index}`,
        type: 'image',
        props: {
          url: content.src || '',
          alt: content.alt || '',
          caption: content.caption || '',
        },
        content: [],
        children: [],
      };
    }

    case 'list': {
      const listType = content.listType || 'bullet';
      const items = content.items || [];
      // For BlockNote, we return individual list item blocks
      // But since blocksToBlockNote returns a flat array, the caller should handle grouping
      // Actually, for a simple editor, we can create nested blocks. Let me keep it simple.
      return items.map((item, itemIndex) => ({
        id: `${block.id || `block-${index}`}-${itemIndex}`,
        type: listType === 'numbered' ? 'numberedListItem' : 'bulletListItem',
        props: {},
        content: [{ type: 'text', text: item || '', styles: {} }],
        children: [],
      }));
    }

    case 'quote': {
      return {
        id: block.id || `block-${index}`,
        type: 'quote',
        props: {},
        content: [{ type: 'text', text: content.text || '', styles: {} }],
        children: [],
      };
    }

    case 'table': {
      return {
        id: block.id || `block-${index}`,
        type: 'table',
        props: {},
        content: {
          rows: (content.rows || []).map((row, rowIndex) => ({
            cells: row.map((cell) => [{ type: 'text', text: cell || '', styles: {} }]),
          })),
        },
        children: [],
      };
    }

    default:
      return {
        id: block.id || `block-${index}`,
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: content.text || '', styles: {} }],
        children: [],
      };
  }
}

// Handle the list block special case: it returns an array, so we need to flatten
export function blocksToBlockNoteFlat(contentJson) {
  const blocks = blocksToBlockNote(contentJson);
  const flat = [];
  blocks.forEach(block => {
    if (Array.isArray(block)) {
      flat.push(...block);
    } else {
      flat.push(block);
    }
  });
  return flat;
}

/**
 * Render our stored blocks to HTML for frontend display.
 * This is used for preview mode or non-React contexts.
 */
export function blocksToHtml(contentJson) {
  if (!contentJson || !contentJson.blocks || !Array.isArray(contentJson.blocks)) {
    return '';
  }

  return contentJson.blocks.map(block => {
    const content = block.content || {};

    switch (block.type) {
      case 'paragraph': {
        return `<p>${escapeHtml(content.text || '')}</p>`;
      }

      case 'heading': {
        const level = content.level || 2;
        return `<h${level}>${escapeHtml(content.text || '')}</h${level}>`;
      }

      case 'image': {
        const alt = escapeHtml(content.alt || '');
        const caption = content.caption ? `<figcaption>${escapeHtml(content.caption)}</figcaption>` : '';
        return `<figure><img src="${escapeHtml(content.src || '')}" alt="${alt}" />${caption}</figure>`;
      }

      case 'list': {
        const tag = content.listType === 'numbered' ? 'ol' : 'ul';
        const items = (content.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      }

      case 'quote': {
        return `<blockquote>${escapeHtml(content.text || '')}</blockquote>`;
      }

      case 'table': {
        const rows = (content.rows || []).map(row => {
          const cells = row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `<table>${rows}</table>`;
      }

      default:
        return `<p>${escapeHtml(content.text || '')}</p>`;
    }
  }).join('\n');
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Get a plain text excerpt from article content (for SEO/meta descriptions).
 */
export function blocksToPlainText(contentJson, maxLength = 160) {
  if (!contentJson || !contentJson.blocks || !Array.isArray(contentJson.blocks)) {
    return '';
  }

  let text = '';
  for (const block of contentJson.blocks) {
    const content = block.content || {};
    if (content.text) {
      text += content.text + ' ';
    }
    if (content.items && Array.isArray(content.items)) {
      text += content.items.join(' ') + ' ';
    }
    if (text.length > maxLength * 2) break;
  }

  text = text.trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + '...';
  }
  return text;
}
