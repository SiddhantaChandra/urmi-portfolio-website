'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';
import {
  HiArrowLeft,
  HiOutlineSave,
  HiOutlineUpload,
} from 'react-icons/hi';

export default function HeroEditorPage({ initialProfile }) {
  const router = useRouter();
  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    heroBadge: initialProfile?.heroBadge || '',
    heroTitle: initialProfile?.heroTitle || '',
    heroSubtitle: initialProfile?.heroSubtitle || '',
    heroDescription: initialProfile?.heroDescription || '',
    articleCount: String(initialProfile?.articleCount || 0),
    profileImage: initialProfile?.profileImage || '',
    resumePath: initialProfile?.resumePath || '',
  });

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
    payload.append('prefix', 'images/');

    const result = await uploadToR2(payload);
    if (!result.success) {
      showMessage(result.error || 'Image upload failed');
      return;
    }

    if (form.profileImage) {
      await deleteFromR2(form.profileImage);
    }

    updateField('profileImage', result.filePath);
    showMessage('Image uploaded to R2 successfully');
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append('file', file);
    payload.append('prefix', 'documents/');

    const result = await uploadToR2(payload);
    if (!result.success) {
      showMessage(result.error || 'Resume upload failed');
      return;
    }

    if (form.resumePath) {
      await deleteFromR2(form.resumePath);
    }

    updateField('resumePath', result.filePath);
    showMessage('Resume uploaded to R2 successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const result = await updateProfile({
      ...form,
      articleCount: parseInt(form.articleCount) || 0,
    });

    setSaving(false);

    if (result.success) {
      showMessage('Profile saved successfully');
    } else {
      showMessage('Error: ' + result.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="cms-page-header">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push('/cms/dashboard')}
            className="cms-icon-button mt-1"
            aria-label="Back to dashboard"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="cms-eyebrow">Hero section</p>
            <h1 className="cms-page-title">Edit hero section</h1>
            <p className="cms-page-subtitle">
              Update the content and media that appear in the home page hero section.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="cms-primary-btn"
          >
            <HiOutlineSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message ? <div className="cms-toast">{message}</div> : null}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.9fr)]"
      >
        <section className="cms-card p-6 space-y-5">
          <div className="space-y-2">
            <label className="cms-label">Top Badge</label>
            <input
              value={form.heroBadge}
              onChange={(e) => updateField('heroBadge', e.target.value)}
              className="cms-input"
              placeholder="e.g. Dedicated Entertainment Journalist"
            />
          </div>

          <div className="space-y-2">
            <label className="cms-label">Hero Title</label>
            <input
              value={form.heroTitle}
              onChange={(e) => updateField('heroTitle', e.target.value)}
              className="cms-input"
              placeholder="e.g. Hi, I'm Urmi Chakraborty"
            />
          </div>

          <div className="space-y-2">
            <label className="cms-label">Subtitle</label>
            <textarea
              value={form.heroSubtitle}
              onChange={(e) => updateField('heroSubtitle', e.target.value)}
              rows={3}
              className="cms-input min-h-24"
              placeholder="Short subtitle that appears under the title"
            />
          </div>

          <div className="space-y-2">
            <label className="cms-label">Description</label>
            <textarea
              value={form.heroDescription}
              onChange={(e) => updateField('heroDescription', e.target.value)}
              rows={5}
              className="cms-input min-h-32"
              placeholder="Longer description about experience and specialisation"
            />
          </div>

          <div className="space-y-2">
            <label className="cms-label">Article Count</label>
            <input
              type="number"
              value={form.articleCount}
              onChange={(e) => updateField('articleCount', e.target.value)}
              className="cms-input"
              placeholder="e.g. 2434"
            />
            <p className="cms-help-text">
              This number is displayed as &quot;{form.articleCount || 0}+ Articles&quot; in the hero badge.
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="cms-card p-6 space-y-4">
            <p className="cms-section-title">Profile Image</p>
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
              value={form.profileImage}
              onChange={(e) => updateField('profileImage', e.target.value)}
              className="cms-input"
              placeholder="Image URL or path"
            />
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt="Profile preview"
                className="w-full h-48 rounded-2xl object-cover border border-[var(--cms-border)]"
              />
            ) : (
              <div className="cms-list-art-placeholder h-48 w-full flex items-center justify-center">
                <span className="cms-muted">No image uploaded</span>
              </div>
            )}
          </section>

          <section className="cms-card p-6 space-y-4">
            <p className="cms-section-title">Resume</p>
            <div className="flex flex-wrap gap-3">
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="cms-secondary-btn"
              >
                <HiOutlineUpload className="w-4 h-4" />
                Upload PDF
              </button>
            </div>
            <input
              value={form.resumePath}
              onChange={(e) => updateField('resumePath', e.target.value)}
              className="cms-input"
              placeholder="Resume URL or path"
            />
            <p className="cms-help-text">
              {form.resumePath
                ? `Current: ${form.resumePath}`
                : 'No resume uploaded'}
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
