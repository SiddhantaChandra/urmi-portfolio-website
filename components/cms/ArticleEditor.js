'use client';

import { useState, useEffect, useCallback } from 'react';
import { HiTrash, HiPlus, HiEye, HiPencil, HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';

/**
 * Custom Block-Based Article Editor
 * A lightweight, portfolio-specific block editor that maps to our ArticleContentBlock schema.
 * Supports: paragraph, heading (2/3/4), image, bullet list, numbered list, quote.
 */

const BLOCK_TYPES = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading', label: 'Heading' },
  { value: 'image', label: 'Image' },
  { value: 'list', label: 'List' },
  { value: 'quote', label: 'Quote' },
];

function createEmptyBlock(type = 'paragraph') {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: getEmptyContent(type),
  };
}

function getEmptyContent(type) {
  switch (type) {
    case 'paragraph': return { text: '' };
    case 'heading': return { text: '', level: 2 };
    case 'image': return { src: '', alt: '', caption: '' };
    case 'list': return { listType: 'bullet', items: [''] };
    case 'quote': return { text: '' };
    default: return { text: '' };
  }
}

function BlockEditor({ block, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'articles/content/');
    const res = await uploadToR2(fd);
    if (res.success) {
      if (block.content.src) {
        await deleteFromR2(block.content.src);
      }
      onChange({ ...block.content, src: res.filePath });
    }
    setUploading(false);
  };

  const renderBlockInput = () => {
    const c = block.content;

    switch (block.type) {
      case 'paragraph':
        return (
          <textarea
            value={c.text || ''}
            onChange={(e) => onChange({ ...c, text: e.target.value })}
            placeholder="Write a paragraph..."
            rows={3}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm leading-relaxed resize-y"
          />
        );

      case 'heading':
        return (
          <div className="flex gap-2">
            <select
              value={c.level || 2}
              onChange={(e) => onChange({ ...c, level: parseInt(e.target.value) })}
              className="px-2 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
              <option value={4}>H4</option>
            </select>
            <input
              value={c.text || ''}
              onChange={(e) => onChange({ ...c, text: e.target.value })}
              placeholder="Heading text..."
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm font-semibold"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm" />
              {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>
            {c.src && (
              <img src={c.src} alt={c.alt || ''} className="w-full h-48 object-cover rounded-lg" />
            )}
            <div className="grid grid-cols-2 gap-2">
              <input
                value={c.alt || ''}
                onChange={(e) => onChange({ ...c, alt: e.target.value })}
                placeholder="Alt text"
                className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              />
              <input
                value={c.caption || ''}
                onChange={(e) => onChange({ ...c, caption: e.target.value })}
                placeholder="Caption"
                className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <select
                value={c.listType || 'bullet'}
                onChange={(e) => onChange({ ...c, listType: e.target.value })}
                className="px-2 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
              >
                <option value="bullet">Bullet</option>
                <option value="numbered">Numbered</option>
              </select>
            </div>
            {(c.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-6 text-right">{c.listType === 'numbered' ? `${idx + 1}.` : '•'}</span>
                <input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...c.items];
                    newItems[idx] = e.target.value;
                    onChange({ ...c, items: newItems });
                  }}
                  placeholder="List item..."
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
                />
                <button
                  onClick={() => {
                    const newItems = c.items.filter((_, i) => i !== idx);
                    onChange({ ...c, items: newItems.length ? newItems : [''] });
                  }}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove item"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange({ ...c, items: [...(c.items || []), ''] })}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <HiPlus className="w-4 h-4" /> Add item
            </button>
          </div>
        );

      case 'quote':
        return (
          <textarea
            value={c.text || ''}
            onChange={(e) => onChange({ ...c, text: e.target.value })}
            placeholder="Enter a quote..."
            rows={3}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm italic leading-relaxed resize-y"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <select
            value={block.type}
            onChange={(e) => onChange(getEmptyContent(e.target.value), e.target.value)}
            className="px-2 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-xs font-medium uppercase tracking-wide"
          >
            {BLOCK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={isFirst} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Move up">
            <HiArrowUp className="w-4 h-4" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Move down">
            <HiArrowDown className="w-4 h-4" />
          </button>
          <button onClick={onRemove} className="p-1 text-red-400 hover:text-red-600" title="Delete block">
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      {renderBlockInput()}
    </div>
  );
}

export default function ArticleEditor({ initialBlocks = [], onChange, readOnly = false }) {
  const [blocks, setBlocks] = useState(() => {
    if (Array.isArray(initialBlocks) && initialBlocks.length > 0) {
      return initialBlocks.map((b, i) => ({
        id: b.id || `block-${Date.now()}-${i}`,
        type: b.type || 'paragraph',
        content: b.content || getEmptyContent(b.type),
      }));
    }
    return [createEmptyBlock('paragraph')];
  });

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (onChange) {
      onChange(blocks);
    }
  }, [blocks, onChange]);

  const handleAddBlock = (type = 'paragraph') => {
    setBlocks((prev) => [...prev, createEmptyBlock(type)]);
  };

  const handleBlockChange = (index, newContent, newType) => {
    setBlocks((prev) => {
      const updated = [...prev];
      const current = updated[index];
      const type = newType || current.type;
      // If type changed, use the new content directly; otherwise merge
      const content = newType ? newContent : { ...current.content, ...newContent };
      updated[index] = { ...current, type, content };
      return updated;
    });
  };

  const handleRemoveBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveBlock = (index, direction) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newBlocks.length) return prev;
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      return newBlocks;
    });
  };

  const renderPreview = () => {
    return (
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {blocks.map((block, i) => {
          const c = block.content;
          switch (block.type) {
            case 'paragraph':
              return <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{c.text}</p>;
            case 'heading': {
              const Tag = `h${c.level || 2}`;
              return <Tag key={i} className="font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">{c.text}</Tag>;
            }
            case 'image':
              return (
                <figure key={i} className="my-8">
                  <img src={c.src} alt={c.alt || ''} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" />
                  {c.caption && <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 italic">{c.caption}</figcaption>}
                </figure>
              );
            case 'list': {
              const Tag = c.listType === 'numbered' ? 'ol' : 'ul';
              return (
                <Tag key={i} className="list-inside space-y-2 mb-6 ml-4">
                  {(c.items || []).map((item, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</li>
                  ))}
                </Tag>
              );
            }
            case 'quote':
              return (
                <blockquote key={i} className="border-l-4 border-purple-600 dark:border-purple-400 pl-6 py-4 my-8 bg-purple-50/50 dark:bg-purple-900/20 rounded-r-lg italic text-lg text-gray-700 dark:text-gray-300">
                  {c.text}
                </blockquote>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  if (readOnly) {
    return renderPreview();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(false)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${!previewMode ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          >
            <HiPencil className="w-4 h-4" /> Editor
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${previewMode ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
          >
            <HiEye className="w-4 h-4" /> Preview
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          {renderPreview()}
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block.id}
              block={block}
              onChange={(content, type) => handleBlockChange(index, content, type)}
              onRemove={() => handleRemoveBlock(index)}
              onMoveUp={() => handleMoveBlock(index, -1)}
              onMoveDown={() => handleMoveBlock(index, 1)}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
            />
          ))}
          <div className="flex items-center gap-2 pt-4">
            <button
              onClick={() => handleAddBlock('paragraph')}
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
            >
              <HiPlus className="w-4 h-4" /> Add Paragraph
            </button>
            <button
              onClick={() => handleAddBlock('heading')}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              <HiPlus className="w-4 h-4" /> Heading
            </button>
            <button
              onClick={() => handleAddBlock('image')}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              <HiPlus className="w-4 h-4" /> Image
            </button>
            <button
              onClick={() => handleAddBlock('list')}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              <HiPlus className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => handleAddBlock('quote')}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              <HiPlus className="w-4 h-4" /> Quote
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
