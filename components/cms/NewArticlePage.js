'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle } from '@/app/actions/db';
import { uploadToR2 } from '@/app/actions/r2';
import BlockNoteEditor from '@/components/cms/BlockNoteEditor';
import { blockNoteToBlocks } from '@/components/cms/article-content';
import { HiArrowLeft, HiSave, HiDocumentText } from 'react-icons/hi';

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const imageInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    image: '',
    category: '',
    type: 'journalism',
    articleType: 'Published Article',
    readingTime: '',
    author: 'Urmi Chakraborty',
    publication: '',
    status: 'draft',
  });

  const [editorContent, setEditorContent] = useState([]);

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
      setForm((prev) => ({ ...prev, image: res.filePath }));
      showMessage('Image uploaded to R2');
    } else {
      showMessage('Upload failed: ' + res.error);
    }
  };

  const handleEditorChange = useCallback((document) => {
    setEditorContent(document);
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const content = blockNoteToBlocks(editorContent);
    const data = {
      ...form,
      readingTime: form.readingTime ? parseInt(form.readingTime) : null,
      isExternal: false,
      content: JSON.stringify(content),
    };

    const res = await createArticle(data);
    if (res.success) {
      showMessage('Article created successfully');
      router.push('/cms/dashboard/articles');
    } else {
      showMessage('Failed to create article: ' + (res.error || 'Unknown error'));
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
            <h1 className="text-2xl font-bold">New Article</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create a new article</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <HiSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Article'}
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
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="Article title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="article-slug"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="Short excerpt for the article..."
                required
              />
            </div>
          </div>

          {/* BlockNote Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">Article Content</label>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <BlockNoteEditor initialBlocks={[]} onChange={handleEditorChange} />
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="journalism">Journalism</option>
                <option value="content-writing">Content Writing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Article Type</label>
              <input
                value={form.articleType}
                onChange={(e) => updateField('articleType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reading Time (min)</label>
              <input
                type="number"
                value={form.readingTime}
                onChange={(e) => updateField('readingTime', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                value={form.author}
                onChange={(e) => updateField('author', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Publication</label>
              <input
                value={form.publication}
                onChange={(e) => updateField('publication', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                >
                  Upload to R2
                </button>
                <input
                  value={form.image}
                  onChange={(e) => updateField('image', e.target.value)}
                  placeholder="Or paste image URL"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              {form.image && (
                <img src={form.image} alt="" className="mt-2 w-20 h-20 object-cover rounded" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
