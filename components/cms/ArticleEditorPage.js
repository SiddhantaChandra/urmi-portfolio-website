'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFromR2, uploadToR2 } from '@/app/actions/r2';
import { archiveArticle, updateArticle } from '@/app/actions/db';
import BlockNoteEditor from '@/components/cms/BlockNoteEditor';
import { blockNoteToBlocks, blocksToBlockNote, normalizeStoredContent } from '@/lib/article-content';
import {
  HiArrowLeft,
  HiOutlineArchive,
  HiOutlineSave,
  HiOutlineUpload,
  HiOutlineGlobeAlt,
} from 'react-icons/hi';

export default function ArticleEditorPage({ article }) {
  const router = useRouter();
  const imageInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [pendingAction, setPendingAction] = useState('');
  const [editorDocument, setEditorDocument] = useState(null);
  const [form, setForm] = useState({
    title: article.title || '',
    slug: article.slug || '',
    excerpt: article.excerpt || '',
    image: article.image || '',
    category: article.category || '',
    tagsText: article.tags?.map((relation) => relation.tag.name).join(', ') || '',
    type: article.type || 'journalism',
    articleType: article.articleType || (article.isExternal ? 'External Link' : 'Internal Article'),
    readingTime: article.readingTime ? String(article.readingTime) : '',
    author: article.author || 'Urmi Chakraborty',
    publication: article.publication || '',
    status: article.status || 'draft',
    externalLink: article.externalLink || '',
  });

  const isExternal = article.isExternal;
  const normalizedContent = useMemo(
    () => (isExternal ? null : normalizeStoredContent(article.content)),
    [article.content, isExternal]
  );

  const showMessage = (next) => {
    setMessage(next);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append('file', file);
    payload.append('prefix', 'articles/');

    const result = await uploadToR2(payload);
    if (!result.success) {
      showMessage(`Upload failed: ${result.error}`);
      return;
    }

    if (form.image) {
      await deleteFromR2(form.image);
    }

    updateField('image', result.filePath);
    showMessage('Cover image updated');
  };

  const persist = async (targetStatus = form.status) => {
    setPendingAction(targetStatus === 'published' ? 'publish' : 'save');

    const result = await updateArticle(article.id, {
      ...form,
      status: targetStatus,
      isExternal,
      tags: form.tagsText,
      content: isExternal
        ? null
        : JSON.stringify(
            blockNoteToBlocks(
              Array.isArray(editorDocument) ? editorDocument : blocksToBlockNote(normalizedContent)
            )
          ),
    });

    if (!result.success) {
      showMessage(result.error || 'Failed to save article');
      setPendingAction('');
      return;
    }

    updateField('status', targetStatus);
    showMessage(targetStatus === 'published' ? 'Article published' : 'Article saved');
    setPendingAction('');
  };

  const handleArchive = async () => {
    setPendingAction('archive');
    const result = await archiveArticle(article.id);
    if (!result.success) {
      showMessage(result.error || 'Failed to archive article');
      setPendingAction('');
      return;
    }

    updateField('status', 'archived');
    showMessage('Article archived');
    setPendingAction('');
  };

  const handleQuickPublish = async () => {
    await persist('published');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="cms-page-header">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push('/cms/dashboard/articles')}
            className="cms-icon-button mt-1"
            aria-label="Back to articles"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="cms-eyebrow">{isExternal ? 'External article link' : 'Internal article'}</p>
            <h1 className="cms-page-title">{isExternal ? 'Edit external link' : 'Edit article'}</h1>
            <p className="cms-page-subtitle">
              {isExternal
                ? 'Manage the portfolio metadata for articles published on other platforms.'
                : 'Update content, metadata, and publishing state from a single page.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => persist('draft')}
            disabled={!!pendingAction}
            className="cms-secondary-btn"
          >
            <HiOutlineSave className="w-4 h-4" />
            {pendingAction === 'save' ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleQuickPublish}
            disabled={!!pendingAction}
            className="cms-primary-btn"
          >
            <HiOutlineGlobeAlt className="w-4 h-4" />
            {pendingAction === 'publish' ? 'Publishing...' : 'Publish'}
          </button>
          <button
            onClick={handleArchive}
            disabled={!!pendingAction}
            className="cms-danger-btn"
          >
            <HiOutlineArchive className="w-4 h-4" />
            {pendingAction === 'archive' ? 'Archiving...' : 'Archive'}
          </button>
        </div>
      </div>

      {message ? <div className="cms-toast">{message}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.9fr)]">
        <section className="cms-card p-6 space-y-5">
          <div className="space-y-2">
            <label className="cms-label">Title</label>
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="cms-input"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="cms-label">Slug</label>
              <input
                value={form.slug}
                onChange={(event) => updateField('slug', event.target.value)}
                className="cms-input"
                disabled={isExternal}
              />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Category</label>
              <input
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                className="cms-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="cms-label">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(event) => updateField('excerpt', event.target.value)}
              rows={4}
              className="cms-input min-h-28"
            />
          </div>

          {isExternal ? (
            <div className="cms-inline-note">
              External links do not use internal article body content. Visitors open the original publication URL from portfolio listings.
            </div>
          ) : (
            <div className="space-y-2">
              <label className="cms-label">Article body</label>
              <BlockNoteEditor
                initialContent={normalizedContent}
                onChange={setEditorDocument}
              />
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="cms-card p-6 space-y-4">
            <div>
              <p className="cms-section-title">Publishing</p>
              <p className="cms-muted">Current state: <span className="capitalize">{form.status}</span></p>
            </div>
            <div className="space-y-2">
              <label className="cms-label">Status</label>
              <select
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                className="cms-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </section>

          <section className="cms-card p-6 space-y-4">
            <p className="cms-section-title">Metadata</p>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="cms-label">Author</label>
                <input
                  value={form.author}
                  onChange={(event) => updateField('author', event.target.value)}
                  className="cms-input"
                />
              </div>
              <div className="space-y-2">
                <label className="cms-label">Publication</label>
                <input
                  value={form.publication}
                  onChange={(event) => updateField('publication', event.target.value)}
                  className="cms-input"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="cms-label">Portfolio type</label>
                  <select
                    value={form.type}
                    onChange={(event) => updateField('type', event.target.value)}
                    className="cms-input"
                  >
                    <option value="journalism">Journalism</option>
                    <option value="content-writing">Content Writing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="cms-label">Reading time</label>
                  <input
                    type="number"
                    value={form.readingTime}
                    onChange={(event) => updateField('readingTime', event.target.value)}
                    className="cms-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="cms-label">Tags</label>
                <input
                  value={form.tagsText}
                  onChange={(event) => updateField('tagsText', event.target.value)}
                  className="cms-input"
                />
                <p className="cms-help-text">Use commas to separate tags.</p>
              </div>
              {isExternal ? (
                <div className="space-y-2">
                  <label className="cms-label">External URL</label>
                  <input
                    value={form.externalLink}
                    onChange={(event) => updateField('externalLink', event.target.value)}
                    className="cms-input"
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section className="cms-card p-6 space-y-4">
            <p className="cms-section-title">Cover image</p>
            <div className="flex flex-wrap gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="cms-secondary-btn"
              >
                <HiOutlineUpload className="w-4 h-4" />
                Upload to R2
              </button>
            </div>
            <input
              value={form.image}
              onChange={(event) => updateField('image', event.target.value)}
              className="cms-input"
            />
            {form.image ? (
              <img
                src={form.image}
                alt=""
                className="w-full h-48 rounded-2xl object-cover border border-[var(--cms-border)]"
              />
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
