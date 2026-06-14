import React from 'react';

/**
 * Shared article content utilities for the CMS editor and public renderer.
 * The stored shape is JSON serializable and preserves BlockNote inline styles.
 */

function createTextInline(text = '') {
  return text ? [{ type: 'text', text, styles: {} }] : [];
}

function normalizeInlineNode(node) {
  if (typeof node === 'string') {
    return { type: 'text', text: node, styles: {} };
  }

  if (!node || typeof node !== 'object') {
    return { type: 'text', text: '', styles: {} };
  }

  return {
    type: node.type === 'link' ? 'link' : 'text',
    text: typeof node.text === 'string' ? node.text : '',
    href: typeof node.href === 'string' ? node.href : undefined,
    styles: node.styles && typeof node.styles === 'object' ? node.styles : {},
  };
}

function normalizeInlineContent(content) {
  if (!Array.isArray(content)) {
    if (typeof content === 'string') return createTextInline(content);
    if (content?.text) return createTextInline(content.text);
    return [];
  }

  return content
    .map(normalizeInlineNode)
    .filter((node) => node.text || (node.type === 'link' && node.href));
}

function inlineContentToText(content) {
  return normalizeInlineContent(content).map((item) => item.text || '').join('');
}

function normalizeListItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (Array.isArray(item)) {
        return { id: `item-${index}`, inline: normalizeInlineContent(item) };
      }

      if (item && typeof item === 'object' && Array.isArray(item.inline)) {
        return {
          id: item.id || `item-${index}`,
          inline: normalizeInlineContent(item.inline),
        };
      }

      return {
        id: `item-${index}`,
        inline: createTextInline(typeof item === 'string' ? item : ''),
      };
    })
    .filter((item) => item.inline.length > 0 || item.id);
}

function normalizeTableRows(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.map((row) =>
    Array.isArray(row)
      ? row.map((cell) => normalizeInlineContent(Array.isArray(cell) ? cell : createTextInline(cell || '')))
      : []
  );
}

function normalizeStoredBlock(block, index = 0) {
  if (!block || typeof block !== 'object') return null;

  const id = block.id || `block-${index}`;
  const type = block.type || 'paragraph';
  const content = block.content || {};

  switch (type) {
    case 'paragraph':
    case 'text':
      return {
        id,
        type: 'paragraph',
        displayOrder: block.displayOrder ?? index,
        content: {
          inline: normalizeInlineContent(content.inline || content.richText || content.text || ''),
        },
      };

    case 'heading':
      return {
        id,
        type: 'heading',
        displayOrder: block.displayOrder ?? index,
        content: {
          level: content.level || 2,
          inline: normalizeInlineContent(content.inline || content.richText || content.text || ''),
        },
      };

    case 'quote':
      return {
        id,
        type: 'quote',
        displayOrder: block.displayOrder ?? index,
        content: {
          inline: normalizeInlineContent(content.inline || content.richText || content.text || ''),
        },
      };

    case 'list':
    case 'bulletList':
    case 'numberedList':
      return {
        id,
        type: 'list',
        displayOrder: block.displayOrder ?? index,
        content: {
          listType:
            content.listType ||
            (type === 'numberedList' ? 'numbered' : 'bullet'),
          items: normalizeListItems(content.items || (content.text ? [content.text] : [])),
        },
      };

    case 'image':
      return {
        id,
        type: 'image',
        displayOrder: block.displayOrder ?? index,
        content: {
          src: content.src || content.url || '',
          alt: content.alt || '',
          caption: content.caption || '',
        },
      };

    case 'table':
      return {
        id,
        type: 'table',
        displayOrder: block.displayOrder ?? index,
        content: {
          rows: normalizeTableRows(content.rows),
        },
      };

    default:
      return {
        id,
        type: 'paragraph',
        displayOrder: block.displayOrder ?? index,
        content: {
          inline: normalizeInlineContent(content.inline || content.text || ''),
        },
      };
  }
}

export function normalizeStoredContent(contentJson) {
  if (!contentJson || !Array.isArray(contentJson.blocks)) {
    return { blocks: [] };
  }

  return {
    blocks: contentJson.blocks
      .map((block, index) => normalizeStoredBlock(block, index))
      .filter(Boolean),
  };
}

export function hasLegacyContentFormat(contentJson) {
  if (!contentJson || !Array.isArray(contentJson.blocks)) return false;

  return contentJson.blocks.some((block) => {
    const content = block?.content || {};

    if (block?.type === 'text') return true;
    if ((block?.type === 'paragraph' || block?.type === 'heading' || block?.type === 'quote') && !Array.isArray(content.inline)) {
      return true;
    }
    if ((block?.type === 'list' || block?.type === 'bulletList' || block?.type === 'numberedList') && content.items?.some?.((item) => typeof item === 'string')) {
      return true;
    }
    if (block?.type === 'image' && content.url && !content.src) return true;
    if (block?.type === 'table' && content.rows?.some?.((row) => row?.some?.((cell) => typeof cell === 'string'))) {
      return true;
    }

    return false;
  });
}

export function blockNoteToBlocks(editorDocument) {
  if (!Array.isArray(editorDocument)) return { blocks: [] };

  const blocks = [];
  let listBlock = null;

  const flushList = () => {
    if (listBlock) {
      blocks.push(listBlock);
      listBlock = null;
    }
  };

  editorDocument.forEach((block, index) => {
    if (!block || typeof block !== 'object') return;

    if (block.type === 'bulletListItem' || block.type === 'numberedListItem') {
      const listType = block.type === 'numberedListItem' ? 'numbered' : 'bullet';
      const inline = normalizeInlineContent(block.content);

      if (!listBlock || listBlock.content.listType !== listType) {
        flushList();
        listBlock = {
          id: `list-${block.id || index}`,
          type: 'list',
          displayOrder: blocks.length,
          content: {
            listType,
            items: [],
          },
        };
      }

      listBlock.content.items.push({
        id: block.id || `item-${index}`,
        inline,
      });

      return;
    }

    flushList();

    switch (block.type) {
      case 'paragraph':
        blocks.push({
          id: block.id || `block-${index}`,
          type: 'paragraph',
          displayOrder: blocks.length,
          content: {
            inline: normalizeInlineContent(block.content),
          },
        });
        break;

      case 'heading':
        blocks.push({
          id: block.id || `block-${index}`,
          type: 'heading',
          displayOrder: blocks.length,
          content: {
            level: block.props?.level || 2,
            inline: normalizeInlineContent(block.content),
          },
        });
        break;

      case 'quote':
        blocks.push({
          id: block.id || `block-${index}`,
          type: 'quote',
          displayOrder: blocks.length,
          content: {
            inline: normalizeInlineContent(block.content),
          },
        });
        break;

      case 'image':
        blocks.push({
          id: block.id || `block-${index}`,
          type: 'image',
          displayOrder: blocks.length,
          content: {
            src: block.props?.url || '',
            alt: block.props?.alt || '',
            caption: block.props?.caption || '',
          },
        });
        break;

      case 'table':
        blocks.push({
          id: block.id || `block-${index}`,
          type: 'table',
          displayOrder: blocks.length,
          content: {
            rows: (block.content?.rows || []).map((row) =>
              (row.cells || []).map((cell) => normalizeInlineContent(cell))
            ),
          },
        });
        break;

      default:
        blocks.push({
          id: block.id || `block-${index}`,
          type: 'paragraph',
          displayOrder: blocks.length,
          content: {
            inline: normalizeInlineContent(block.content),
          },
        });
      }
  });

  flushList();
  return { blocks };
}

export function blocksToBlockNote(contentJson) {
  const normalized = normalizeStoredContent(contentJson);
  const output = [];

  normalized.blocks.forEach((block, index) => {
    const id = block.id || `block-${index}`;

    switch (block.type) {
      case 'paragraph':
        output.push({
          id,
          type: 'paragraph',
          props: {},
          content: normalizeInlineContent(block.content?.inline),
          children: [],
        });
        break;

      case 'heading':
        output.push({
          id,
          type: 'heading',
          props: { level: block.content?.level || 2 },
          content: normalizeInlineContent(block.content?.inline),
          children: [],
        });
        break;

      case 'quote':
        output.push({
          id,
          type: 'quote',
          props: {},
          content: normalizeInlineContent(block.content?.inline),
          children: [],
        });
        break;

      case 'image':
        output.push({
          id,
          type: 'image',
          props: {
            url: block.content?.src || '',
            alt: block.content?.alt || '',
            caption: block.content?.caption || '',
          },
          content: [],
          children: [],
        });
        break;

      case 'list':
        (block.content?.items || []).forEach((item, itemIndex) => {
          output.push({
            id: item.id || `${id}-${itemIndex}`,
            type: block.content?.listType === 'numbered' ? 'numberedListItem' : 'bulletListItem',
            props: {},
            content: normalizeInlineContent(item.inline),
            children: [],
          });
        });
        break;

      case 'table':
        output.push({
          id,
          type: 'table',
          props: {},
          content: {
            rows: (block.content?.rows || []).map((row) => ({
              cells: row.map((cell) => normalizeInlineContent(cell)),
            })),
          },
          children: [],
        });
        break;

      default:
        output.push({
          id,
          type: 'paragraph',
          props: {},
          content: normalizeInlineContent(block.content?.inline),
          children: [],
        });
      }
  });

  return output.length ? output : [{ type: 'paragraph', content: '' }];
}

export function renderInlineContent(inline, keyPrefix = 'inline') {
  const nodes = normalizeInlineContent(inline);

  return nodes.map((node, index) => {
    const style = {};
    const classNames = [];

    if (node.styles?.bold) classNames.push('font-semibold');
    if (node.styles?.italic) classNames.push('italic');
    if (node.styles?.underline) classNames.push('underline');
    if (node.styles?.strike) classNames.push('line-through');
    if (node.styles?.textColor) style.color = node.styles.textColor;
    if (node.styles?.backgroundColor) style.backgroundColor = node.styles.backgroundColor;

    const content = React.createElement(
      'span',
      {
        key: `${keyPrefix}-span-${index}`,
        className: classNames.join(' '),
        style,
      },
      node.text
    );

    if (node.type === 'link' && node.href) {
      return React.createElement(
        'a',
        {
          key: `${keyPrefix}-link-${index}`,
          href: node.href,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'underline decoration-sage-500 underline-offset-4 hover:text-sage-700 dark:hover:text-sage-300 transition-colors',
        },
        content
      );
    }

    return content;
  });
}

export function blocksToPlainText(contentJson, maxLength = 160) {
  const normalized = normalizeStoredContent(contentJson);
  const text = normalized.blocks
    .map((block) => {
      if (block.type === 'list') {
        return (block.content?.items || []).map((item) => inlineContentToText(item.inline)).join(' ');
      }
      if (block.type === 'table') {
        return (block.content?.rows || [])
          .flat()
          .map((cell) => inlineContentToText(cell))
          .join(' ');
      }
      return inlineContentToText(block.content?.inline);
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}
