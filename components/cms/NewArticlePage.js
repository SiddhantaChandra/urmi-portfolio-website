'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle } from '@/app/actions/db';
import { uploadToR2 } from '@/app/actions/r2';
import BlockNoteEditor from '@/components/cms/BlockNoteEditor';
import { blockNoteToBlocks } from '@/lib/article-content';
import { HiArrowLeft, HiOutlineDocumentAdd, HiOutlineUpload, HiOutlineSave } from 'react-icons/hi';

const baseForm = {
  title: '',
  slug: '',
  excerpt: '',
  image: '',
  category: '',
  tagsText: '',
  type: 'journalism',
  articleType: 'Internal Article',
  readingTime: '',
  author: 'Urmi Chakraborty',
  publication: '',
  status: 'draft',
};

export default function NewArticlePage() {
  const router = useRouter();
  const imageInputRef = useRef(null);
  const [form, setForm] = useState(baseForm);
  const [editorDocument, setEditorDocument] = useState([]);
  const [savingState, setSavingState] = useState('');
  const [message, setMessage] = useState('');

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

    updateField('image', result.filePath);
    showMessage('Cover image uploaded');
  };

  const handleSave = async (targetStatus) => {
    setSavingState(targetStatus);

    const result = await createArticle({
      ...form,
      status: targetStatus,
      isExternal: false,
      tags: form.tagsText,
      content: JSON.stringify(blockNoteToBlocks(editorDocument)),
    });

    if (!result.success) {
      showMessage(result.error || 'Failed to save article');
      setSavingState('');
      return;
    }

    router.push(`/cms/dashboard/articles/${result.data.id}`);
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
            <p className="cms-eyebrow">Internal article</p>
            <h1 className="cms-page-title">Write a new article</h1>
            <p className="cms-page-subtitle">
              Drafts stay private until you publish them on the site.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={!!savingState}
            className="cms-secondary-btn"
          >
            <HiOutlineSave className="w-4 h-4" />
            {savingState === 'draft' ? 'Saving draft...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={!!savingState}
            className="cms-primary-btn"
          >
            <HiOutlineDocumentAdd className="w-4 h-4" />
            {savingState === 'published' ? 'Publishing...' : 'Publish Article'}
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
              placeholder="Article title"
              className="cms-input"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="cms-label">Slug</label>
              <input
                value={form.slug}
                onChange={(event) => updateField('slug', event.target.value)}
                placeholder="article-slug"
                className="cms-input"
              />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Category</label>
              <input
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                placeholder="Entertainment"
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
              placeholder="Short summary used in the CMS and public article cards"
              className="cms-input min-h-28"
            />
          </div>

          <div className="space-y-2">
            <label className="cms-label">Article body</label>
            <BlockNoteEditor initialContent={null} onChange={setEditorDocument} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="cms-card p-6 space-y-4">
            <div>
              <p className="cms-section-title">Publishing</p>
              <p className="cms-muted">Save freely as draft, then publish when ready.</p>
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
                  placeholder="Optional internal label"
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
                    placeholder="5"
                    className="cms-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="cms-label">Tags</label>
                <input
                  value={form.tagsText}
                  onChange={(event) => updateField('tagsText', event.target.value)}
                  placeholder="anime, review, feature"
                  className="cms-input"
                />
                <p className="cms-help-text">Use commas to separate tags.</p>
              </div>
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
              placeholder="Or paste an image URL"
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
