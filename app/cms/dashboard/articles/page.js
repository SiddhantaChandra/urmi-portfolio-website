'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import {
  archiveArticle,
  createArticle,
  deleteArticle,
  getArticles,
  normalizeLegacyArticleContent,
  publishArticle,
  updateArticle,
} from '@/app/actions/db';
import { deleteFromR2, uploadToR2 } from '@/app/actions/r2';
import {
  HiLink,
  HiOutlineAdjustments,
  HiOutlineDocumentAdd,
  HiOutlineExternalLink,
  HiOutlinePencilAlt,
  HiOutlineSave,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineViewGrid,
  HiX,
} from 'react-icons/hi';

export const dynamic = 'force-dynamic';

const emptyForm = {
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  image: '',
  category: '',
  tagsText: '',
  type: 'journalism',
  articleType: 'External Link',
  readingTime: '',
  author: 'Urmi Chakraborty',
  publication: '',
  status: 'draft',
  externalLink: '',
  isExternal: true,
};

const sortOptions = [
  { value: 'updated-desc', label: 'Recently updated' },
  { value: 'created-desc', label: 'Newest created' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'status-asc', label: 'Status' },
  { value: 'kind-asc', label: 'Internal first' },
];

function compareArticles(left, right, sortValue) {
  switch (sortValue) {
    case 'created-desc':
      return new Date(right.createdAt) - new Date(left.createdAt);
    case 'title-asc':
      return left.title.localeCompare(right.title);
    case 'status-asc':
      return left.status.localeCompare(right.status) || left.title.localeCompare(right.title);
    case 'kind-asc':
      return Number(left.isExternal) - Number(right.isExternal) || left.title.localeCompare(right.title);
    case 'updated-desc':
    default:
      return new Date(right.updatedAt) - new Date(left.updatedAt);
  }
}

function StatsCard({ label, value, hint }) {
  return (
    <div className="cms-card p-5">
      <p className="cms-muted uppercase tracking-[0.18em] text-[11px]">{label}</p>
      <p className="text-3xl font-semibold text-[var(--cms-ink)] mt-3">{value}</p>
      <p className="cms-help-text mt-2">{hint}</p>
    </div>
  );
}

export default function EditArticlesPage() {
  const router = useRouter();
  const imageInputRef = useRef(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortValue, setSortValue] = useState('updated-desc');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }

      const normalization = await normalizeLegacyArticleContent();
      const loadedArticles = await getArticles();
      setArticles(loadedArticles);
      setLoading(false);

      if (normalization.success && normalization.count) {
        setMessage(`Normalized ${normalization.count} legacy article bodies.`);
      }
    }

    load();
  }, [router]);

  const showMessage = (next) => {
    setMessage(next);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openExternalCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const openMetadataEditor = (article) => {
    setForm({
      id: article.id,
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      image: article.image || '',
      category: article.category || '',
      tagsText: article.tagsText || '',
      type: article.type || 'journalism',
      articleType: article.articleType || (article.isExternal ? 'External Link' : 'Internal Article'),
      readingTime: article.readingTime ? String(article.readingTime) : '',
      author: article.author || 'Urmi Chakraborty',
      publication: article.publication || '',
      status: article.status || 'draft',
      externalLink: article.externalLink || '',
      isExternal: article.isExternal,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append('file', file);
    payload.append('prefix', 'articles/');
    const result = await uploadToR2(payload);

    if (!result.success) {
      showMessage(result.error || 'Upload failed');
      return;
    }

    if (form.image) {
      await deleteFromR2(form.image);
    }

    updateField('image', result.filePath);
    showMessage('Image uploaded');
  };

  const handleMetadataSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tagsText,
    };

    const result = form.id
      ? await updateArticle(form.id, payload)
      : await createArticle(payload);

    setSaving(false);

    if (!result.success) {
      showMessage(result.error || 'Failed to save article');
      return;
    }

    setArticles((current) => {
      if (form.id) {
        return current.map((article) => (article.id === form.id ? result.data : article));
      }

      return [result.data, ...current];
    });

    closeModal();
    showMessage(form.id ? 'Metadata updated' : 'External link created');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    const result = await deleteArticle(id);
    if (!result.success) {
      showMessage(result.error || 'Failed to delete article');
      return;
    }

    setArticles((current) => current.filter((article) => article.id !== id));
    showMessage('Article deleted');
  };

  const handlePublish = async (id) => {
    const result = await publishArticle(id);
    if (!result.success) {
      showMessage(result.error || 'Failed to publish article');
      return;
    }

    setArticles((current) => current.map((article) => (article.id === id ? { ...article, ...result.data } : article)));
    showMessage('Article published');
  };

  const handleArchive = async (id) => {
    const result = await archiveArticle(id);
    if (!result.success) {
      showMessage(result.error || 'Failed to archive article');
      return;
    }

    setArticles((current) => current.map((article) => (article.id === id ? { ...article, ...result.data } : article)));
    showMessage('Article archived');
  };

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return articles
      .filter((article) => {
        const matchesType =
          typeFilter === 'all' ||
          (typeFilter === 'internal' && !article.isExternal) ||
          (typeFilter === 'external' && article.isExternal);

        if (!matchesType) return false;
        if (!query) return true;

        const haystack = [
          article.title,
          article.excerpt,
          article.category,
          article.publication,
          article.externalLink,
          article.tagsText,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort((left, right) => compareArticles(left, right, sortValue));
  }, [articles, searchTerm, sortValue, typeFilter]);

  const stats = useMemo(() => {
    const internal = articles.filter((article) => !article.isExternal).length;
    const external = articles.filter((article) => article.isExternal).length;
    const drafts = articles.filter((article) => article.status === 'draft').length;
    const published = articles.filter((article) => article.status === 'published').length;

    return {
      total: articles.length,
      internal,
      external,
      drafts,
      published,
    };
  }, [articles]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="cms-skeleton h-28" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="cms-skeleton h-28" />
          ))}
        </div>
        <div className="cms-skeleton h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="cms-page-header">
        <div>
          <p className="cms-eyebrow">Articles desk</p>
          <h1 className="cms-page-title">Manage articles and external links</h1>
          <p className="cms-page-subtitle">
            Internal articles publish on this site. External links stay as portfolio references to third-party publications.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/cms/dashboard/articles/new')}
            className="cms-primary-btn"
          >
            <HiOutlineDocumentAdd className="w-4 h-4" />
            New Article
          </button>
          <button onClick={openExternalCreate} className="cms-secondary-btn">
            <HiLink className="w-4 h-4" />
            Add Link
          </button>
        </div>
      </div>

      {message ? <div className="cms-toast">{message}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Total" value={stats.total} hint="All managed entries" />
        <StatsCard label="Internal" value={stats.internal} hint="Published on this site" />
        <StatsCard label="External" value={stats.external} hint="Outbound portfolio links" />
        <StatsCard label="Drafts" value={stats.drafts} hint="Not visible publicly" />
        <StatsCard label="Published" value={stats.published} hint="Visible in the public portfolio" />
      </div>

      <section className="cms-card p-5 space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1 max-w-xl">
            <HiOutlineSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cms-muted)] w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, excerpt, category, tags or URL"
              className="cms-input"
              style={{ paddingLeft: '3.25rem' }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="cms-filter-group">
              <button
                onClick={() => setTypeFilter('all')}
                className={typeFilter === 'all' ? 'cms-filter-active' : 'cms-filter-button'}
              >
                <HiOutlineViewGrid className="w-4 h-4" />
                All
              </button>
              <button
                onClick={() => setTypeFilter('internal')}
                className={typeFilter === 'internal' ? 'cms-filter-active' : 'cms-filter-button'}
              >
                Internal
              </button>
              <button
                onClick={() => setTypeFilter('external')}
                className={typeFilter === 'external' ? 'cms-filter-active' : 'cms-filter-button'}
              >
                External
              </button>
            </div>

            <div className="relative min-w-52">
              <HiOutlineAdjustments className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cms-muted)] w-4 h-4" />
              <select
                value={sortValue}
                onChange={(event) => setSortValue(event.target.value)}
                className="cms-input"
                style={{ paddingLeft: '3rem' }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <article key={article.id} className="cms-list-card">
              <div className="flex items-start gap-4 min-w-0">
                {article.image ? (
                  <img
                    src={article.image}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border border-[var(--cms-border)] shrink-0"
                  />
                ) : (
                  <div className="cms-list-art-placeholder shrink-0">
                    {article.isExternal ? <HiOutlineExternalLink className="w-5 h-5" /> : <HiOutlineDocumentAdd className="w-5 h-5" />}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={article.isExternal ? 'cms-pill-external' : 'cms-pill-internal'}>
                      {article.isExternal ? 'External' : 'Internal'}
                    </span>
                    <span className="cms-pill-status capitalize">{article.status}</span>
                    {article.category ? <span className="cms-pill-neutral">{article.category}</span> : null}
                    {article.tagsText ? <span className="cms-pill-neutral">{article.tagsText}</span> : null}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--cms-ink)] truncate">{article.title}</h3>
                  <p className="cms-muted mt-1 line-clamp-2">{article.excerpt}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-[var(--cms-muted)]">
                    <span>{article.publication || 'No publication label'}</span>
                    <span>{article.type}</span>
                    <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                    {article.isExternal && article.externalLink ? <span className="truncate">{article.externalLink}</span> : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!article.isExternal ? (
                  <button
                    onClick={() => router.push(`/cms/dashboard/articles/${article.id}`)}
                    className="cms-secondary-btn"
                  >
                    <HiOutlinePencilAlt className="w-4 h-4" />
                    Edit Content
                  </button>
                ) : null}
                <button onClick={() => openMetadataEditor(article)} className="cms-secondary-btn">
                  <HiOutlineSave className="w-4 h-4" />
                  Edit Meta
                </button>
                {article.status !== 'published' ? (
                  <button onClick={() => handlePublish(article.id)} className="cms-primary-btn">
                    Publish
                  </button>
                ) : (
                  <button onClick={() => handleArchive(article.id)} className="cms-secondary-btn">
                    Archive
                  </button>
                )}
                <button onClick={() => handleDelete(article.id)} className="cms-danger-btn">
                  <HiOutlineTrash className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </article>
          ))}

          {!filteredArticles.length ? (
            <div className="cms-empty-state">
              <h3 className="text-xl font-semibold text-[var(--cms-ink)]">No articles match the current view</h3>
              <p className="cms-muted">
                Try a different search term, switch the type filter, or create a new internal article or external link.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="cms-modal">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="cms-eyebrow">{form.isExternal ? 'External link' : 'Internal metadata'}</p>
                <h2 className="text-2xl font-semibold text-[var(--cms-ink)]">
                  {form.id ? 'Edit article metadata' : 'Add external article link'}
                </h2>
              </div>
              <button onClick={closeModal} className="cms-icon-button">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-6">
              <div className="space-y-2 md:col-span-2">
                <label className="cms-label">Title</label>
                <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="cms-input" />
              </div>
              <div className="space-y-2">
                <label className="cms-label">Slug</label>
                <input
                  value={form.slug}
                  onChange={(event) => updateField('slug', event.target.value)}
                  className="cms-input"
                  disabled={form.isExternal}
                />
              </div>
              <div className="space-y-2">
                <label className="cms-label">Category</label>
                <input value={form.category} onChange={(event) => updateField('category', event.target.value)} className="cms-input" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="cms-label">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(event) => updateField('excerpt', event.target.value)}
                  rows={4}
                  className="cms-input min-h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="cms-label">Author</label>
                <input value={form.author} onChange={(event) => updateField('author', event.target.value)} className="cms-input" />
              </div>
              <div className="space-y-2">
                <label className="cms-label">Publication</label>
                <input value={form.publication} onChange={(event) => updateField('publication', event.target.value)} className="cms-input" />
              </div>
              <div className="space-y-2">
                <label className="cms-label">Portfolio type</label>
                <select value={form.type} onChange={(event) => updateField('type', event.target.value)} className="cms-input">
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
              <div className="space-y-2 md:col-span-2">
                <label className="cms-label">Tags</label>
                <input value={form.tagsText} onChange={(event) => updateField('tagsText', event.target.value)} className="cms-input" />
              </div>
              <div className="space-y-2">
                <label className="cms-label">Status</label>
                <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className="cms-input">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {form.isExternal ? (
                <div className="space-y-2">
                  <label className="cms-label">External URL</label>
                  <input value={form.externalLink} onChange={(event) => updateField('externalLink', event.target.value)} className="cms-input" />
                </div>
              ) : null}
              <div className="space-y-2 md:col-span-2">
                <label className="cms-label">Cover image</label>
                <div className="flex flex-wrap gap-3">
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="cms-secondary-btn">
                    <HiOutlineUpload className="w-4 h-4" />
                    Upload to R2
                  </button>
                </div>
                <input value={form.image} onChange={(event) => updateField('image', event.target.value)} className="cms-input mt-3" />
                {form.image ? (
                  <img
                    src={form.image}
                    alt=""
                    className="w-full h-44 rounded-2xl object-cover border border-[var(--cms-border)] mt-3"
                  />
                ) : null}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={closeModal} className="cms-secondary-btn">Cancel</button>
              <button onClick={handleMetadataSave} disabled={saving} className="cms-primary-btn">
                {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Create Link'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
