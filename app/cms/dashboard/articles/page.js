'use client';

import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import {
  getArticles, createArticle, updateArticle, deleteArticle, publishArticle, archiveArticle,
} from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';
import { HiPencil, HiEye, HiLink, HiDocumentText, HiPlus, HiX } from 'react-icons/hi';

export const dynamic = 'force-dynamic';

export default function EditArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState(null); // 'custom' | 'link' | null
  const [editingId, setEditingId] = useState(null);
  const imageInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', image: '', category: '', type: 'journalism',
    articleType: 'Published Article', readingTime: '', author: 'Urmi Chakraborty',
    isExternal: false, externalLink: '', publication: '', status: 'draft',
  });

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }
      const arts = await getArticles();
      setArticles(arts);
      setLoading(false);
    }
    load();
  }, [router]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'articles/');
    const res = await uploadToR2(fd);
    if (res.success) {
      if (form.image) {
        await deleteFromR2(form.image);
      }
      setForm(prev => ({ ...prev, image: res.filePath }));
      showMessage('Image uploaded to R2');
    } else {
      showMessage('Upload failed: ' + res.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      readingTime: form.readingTime ? parseInt(form.readingTime) : null,
      isExternal: form.isExternal === true || form.isExternal === 'true',
    };
    if (editingId) {
      const res = await updateArticle(editingId, data);
      if (res.success) {
        setArticles(articles.map(a => a.id === editingId ? res.data : a));
        setEditingId(null);
        setShowForm(false);
        setFormMode(null);
        resetForm();
        showMessage('Article updated');
      }
    } else {
      const res = await createArticle(data);
      if (res.success) {
        setArticles([...articles, res.data]);
        setShowForm(false);
        setFormMode(null);
        resetForm();
        showMessage('Article created');
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: '', slug: '', excerpt: '', image: '', category: '', type: 'journalism',
      articleType: 'Published Article', readingTime: '', author: 'Urmi Chakraborty',
      isExternal: false, externalLink: '', publication: '', status: 'draft',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    const res = await deleteArticle(id);
    if (res.success) {
      setArticles(articles.filter(a => a.id !== id));
      showMessage('Article deleted');
    }
  };

  const handlePublish = async (id) => {
    const res = await publishArticle(id);
    if (res.success) {
      setArticles(articles.map(a => a.id === id ? { ...a, status: 'published' } : a));
      showMessage('Article published');
    }
  };

  const handleArchive = async (id) => {
    const res = await archiveArticle(id);
    if (res.success) {
      setArticles(articles.map(a => a.id === id ? { ...a, status: 'archived' } : a));
      showMessage('Article archived');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getArticleTypeBadge = (article) => {
    if (article.isExternal) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
          <HiLink className="w-3 h-3" /> Link
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
        <HiDocumentText className="w-3 h-3" /> Article
      </span>
    );
  };

  const startCreate = (mode) => {
    setFormMode(mode);
    setEditingId(null);
    setShowForm(true);
    setForm({
      title: '', slug: '', excerpt: '', image: '', category: '', type: 'journalism',
      articleType: 'Published Article', readingTime: '', author: 'Urmi Chakraborty',
      isExternal: mode === 'link',
      externalLink: '', publication: '', status: 'draft',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <div className="flex items-center gap-2">
          {!showForm && (
            <>
              <button
                onClick={() => router.push('/cms/dashboard/articles/new')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                <HiDocumentText className="w-4 h-4" /> New Article
              </button>
              <button
                onClick={() => startCreate('link')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <HiLink className="w-4 h-4" /> Add Link
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}

      {/* Creation Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit' : formMode === 'link' ? 'Add Link' : 'New Article'}
              </h3>
              <button onClick={() => { setShowForm(false); setFormMode(null); resetForm(); }} className="p-1 text-gray-400 hover:text-gray-600">
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
                <div><label className="block text-sm font-medium mb-1">Slug</label><input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
                <div><label className="block text-sm font-medium mb-1">Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
                <div><label className="block text-sm font-medium mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required>
                    <option value="journalism">Journalism</option>
                    <option value="content-writing">Content Writing</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Article Type</label><input value={form.articleType} onChange={e => setForm({...form, articleType: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
                <div><label className="block text-sm font-medium mb-1">Reading Time (min)</label><input type="number" value={form.readingTime} onChange={e => setForm({...form, readingTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
                    <button type="button" onClick={() => imageInputRef.current?.click()} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">Upload to R2</button>
                    <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Or paste image URL" className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                  </div>
                  {form.image && <img src={form.image} alt="" className="mt-2 w-20 h-20 object-cover rounded" />}
                </div>
                <div><label className="block text-sm font-medium mb-1">Publication</label><input value={form.publication} onChange={e => setForm({...form, publication: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" /></div>
                <div><label className="block text-sm font-medium mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {formMode === 'link' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">External Link</label>
                    <input value={form.externalLink} onChange={e => setForm({...form, externalLink: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required />
                  </div>
                )}
              </div>
              <div><label className="block text-sm font-medium mb-1">Excerpt</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowForm(false); setFormMode(null); resetForm(); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{articles.length} articles</span>
        <span className="text-sm text-gray-300">|</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {articles.filter(a => a.isExternal).length} links, {articles.filter(a => !a.isExternal).length} custom
        </span>
      </div>

      {/* Article List */}
      <div className="space-y-2">
        {articles.map((article) => (
          <div key={article.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 min-w-0">
              {article.image ? (
                <img src={article.image} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {article.isExternal ? <HiLink className="w-5 h-5 text-gray-400" /> : <HiDocumentText className="w-5 h-5 text-gray-400" />}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-medium truncate">{article.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(article.status)}`}>{article.status}</span>
                  {getArticleTypeBadge(article)}
                  <span>{article.category}</span>
                  <span>{article.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!article.isExternal && (
                <button
                  onClick={() => router.push(`/cms/dashboard/articles/${article.id}`)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded"
                  title="Edit content"
                >
                  <HiPencil className="w-3 h-3" /> Content
                </button>
              )}
              {article.status !== 'published' && <button onClick={() => handlePublish(article.id)} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">Publish</button>}
              {article.status === 'published' && <button onClick={() => handleArchive(article.id)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded">Archive</button>}
              <button onClick={() => { setEditingId(article.id); setForm({ ...article, readingTime: article.readingTime ? String(article.readingTime) : '', isExternal: article.isExternal }); setShowForm(true); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
              <button onClick={() => handleDelete(article.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
