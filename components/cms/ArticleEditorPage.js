'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { updateArticle } from '@/app/actions/db';
import ArticleEditor from '@/components/cms/ArticleEditor';
import { HiArrowLeft, HiSave, HiEye } from 'react-icons/hi';

export default function ArticleEditorPage({ article }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState(article.title || '');
  const [excerpt, setExcerpt] = useState(article.excerpt || '');
  const [readingTime, setReadingTime] = useState(article.readingTime ? String(article.readingTime) : '');
  const [image, setImage] = useState(article.image || '');
  const [category, setCategory] = useState(article.category || '');
  const [articleType, setArticleType] = useState(article.articleType || 'Published Article');
  const [publication, setPublication] = useState(article.publication || '');
  const [status, setStatus] = useState(article.status || 'draft');
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    async function checkAuth() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    // Load content from article.content JSON
    if (article.content && article.content.blocks && Array.isArray(article.content.blocks)) {
      setBlocks(article.content.blocks);
    } else {
      // If no content, start with one empty paragraph
      setBlocks([{ id: 'block-1', type: 'paragraph', content: { text: '' } }]);
    }
  }, [article]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    const content = { blocks };
    const res = await updateArticle(article.id, {
      title,
      slug: article.slug,
      excerpt,
      image,
      category,
      type: article.type,
      articleType,
      readingTime: readingTime ? parseInt(readingTime) : null,
      author: article.author,
      isExternal: article.isExternal,
      externalLink: article.externalLink,
      publication,
      status,
      content: JSON.stringify(content),
    });
    if (res.success) {
      showMessage('Article saved successfully');
    } else {
      showMessage('Failed to save: ' + (res.error || 'Unknown error'));
    }
    setSaving(false);
  }, [article, blocks, title, excerpt, image, category, articleType, readingTime, publication, status]);

  const handleBlocksChange = useCallback((newBlocks) => {
    setBlocks(newBlocks);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/cms/dashboard/articles')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{article.isExternal ? 'Edit Link' : 'Edit Article'}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{article.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <HiSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'content' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'settings' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Settings
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {!article.isExternal ? (
            <ArticleEditor initialBlocks={blocks} onChange={handleBlocksChange} />
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <p className="text-yellow-800 dark:text-yellow-200">
                This is an external link article. It does not have custom content.
                The article redirects to: <a href={article.externalLink} target="_blank" rel="noopener noreferrer" className="underline font-medium">{article.externalLink}</a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input value={article.slug} disabled className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 bg-gray-50 dark:bg-gray-950" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Article Type</label>
              <input value={articleType} onChange={(e) => setArticleType(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reading Time (min)</label>
              <input type="number" value={readingTime} onChange={(e) => setReadingTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publication</label>
              <input value={publication} onChange={(e) => setPublication(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
}
