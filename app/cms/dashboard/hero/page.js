'use client';

import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile } from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';

export const dynamic = 'force-dynamic';

export default function EditHeroPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [form, setForm] = useState({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    articleCount: '',
    profileImage: '',
    resumePath: '',
  });

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }
      const p = await getProfile();
      setProfile(p);
      if (p) {
        setForm({
          heroBadge: p.heroBadge || '',
          heroTitle: p.heroTitle || '',
          heroSubtitle: p.heroSubtitle || '',
          heroDescription: p.heroDescription || '',
          articleCount: String(p.articleCount || 0),
          profileImage: p.profileImage || '',
          resumePath: p.resumePath || '',
        });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'images/');
    const res = await uploadToR2(fd);
    if (res.success) {
      if (form.profileImage) {
        await deleteFromR2(form.profileImage);
      }
      setForm(prev => ({ ...prev, profileImage: res.filePath }));
      setMessage('Image uploaded to R2 successfully');
    } else {
      setMessage('Image upload failed: ' + res.error);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'documents/');
    const res = await uploadToR2(fd);
    if (res.success) {
      if (form.resumePath) {
        await deleteFromR2(form.resumePath);
      }
      setForm(prev => ({ ...prev, resumePath: res.filePath }));
      setMessage('Resume uploaded to R2 successfully');
    } else {
      setMessage('Resume upload failed: ' + res.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const res = await updateProfile({
      ...form,
      articleCount: parseInt(form.articleCount) || 0,
    });
    setSaving(false);
    if (res.success) {
      setMessage('Profile saved successfully');
      setProfile(res.data);
    } else {
      setMessage('Error: ' + res.error);
    }
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
      <h1 className="text-2xl font-bold mb-6">Edit Hero Section</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Badge</label>
            <input
              name="heroBadge"
              value={form.heroBadge}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
            <input
              name="heroTitle"
              value={form.heroTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
            <textarea
              name="heroSubtitle"
              value={form.heroSubtitle}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Description</label>
            <textarea
              name="heroDescription"
              value={form.heroDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Article Count</label>
            <input
              name="articleCount"
              type="number"
              value={form.articleCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image</label>
            <div className="flex items-center gap-4">
              {form.profileImage && (
                <img src={form.profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              )}
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload Image
              </button>
              <span className="text-sm text-gray-500">{form.profileImage || 'No image'}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf"
                ref={resumeInputRef}
                onChange={handleResumeUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload Resume
              </button>
              <span className="text-sm text-gray-500">{form.resumePath || 'No resume'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
