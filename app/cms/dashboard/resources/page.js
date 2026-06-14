'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { getResources, createResource, updateResource } from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';
import {
  HiOutlineUpload,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineExternalLink,
  HiOutlineCheck,
  HiOutlineX,
} from 'react-icons/hi';

export const dynamic = 'force-dynamic';

const TABS = [
  {
    id: 'cv',
    label: 'CV',
    defaultDescription: 'Download my CV',
    accept: '.pdf',
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
  },
  {
    id: 'portfolio-pdf',
    label: 'Portfolio (PDF)',
    defaultDescription: 'Download Portfolio PDF',
    accept: '.pdf',
    allowedTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
  },
  {
    id: 'portfolio-docx',
    label: 'Portfolio (DOCX)',
    defaultDescription: 'Download Portfolio DOCX',
    accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    allowedTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions: ['.docx'],
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getFileExtension(name) {
  if (!name) return '';
  const lastDot = name.lastIndexOf('.');
  return lastDot === -1 ? '' : name.slice(lastDot).toLowerCase();
}

function isAllowedFile(file, tab) {
  const ext = getFileExtension(file.name);
  return tab.allowedExtensions.includes(ext) && tab.allowedTypes.includes(file.type);
}

function formatFileName(url) {
  if (!url) return '';
  try {
    return url.split('/').pop() || url;
  } catch {
    return url;
  }
}

export default function EditResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingTab, setSavingTab] = useState(null);
  const [uploadingTab, setUploadingTab] = useState(null);
  const [removingTab, setRemovingTab] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('cv');
  const fileInputRefs = useRef({});

  const [forms, setForms] = useState({
    cv: { description: '', filePath: '', previousFilePath: '', selectedFile: null },
    'portfolio-pdf': { description: '', filePath: '', previousFilePath: '', selectedFile: null },
    'portfolio-docx': { description: '', filePath: '', previousFilePath: '', selectedFile: null },
  });

  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  }, []);

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }

      let data = await getResources();

      // Ensure all three tabs exist
      for (const tab of TABS) {
        const existing = data.find(
          (d) => d.title?.toLowerCase() === tab.id.toLowerCase()
        );
        if (!existing) {
          const res = await createResource({
            title: tab.id,
            description: tab.defaultDescription,
            filePath: '',
          });
          if (res.success) {
            data = [...data, res.data];
          }
        }
      }

      setResources(data);
      setForms({
        cv: {
          description: data.find((d) => d.title?.toLowerCase() === 'cv')?.description || '',
          filePath: data.find((d) => d.title?.toLowerCase() === 'cv')?.filePath || '',
          previousFilePath: data.find((d) => d.title?.toLowerCase() === 'cv')?.filePath || '',
          selectedFile: null,
        },
        'portfolio-pdf': {
          description: data.find((d) => d.title?.toLowerCase() === 'portfolio-pdf')?.description || '',
          filePath: data.find((d) => d.title?.toLowerCase() === 'portfolio-pdf')?.filePath || '',
          previousFilePath: data.find((d) => d.title?.toLowerCase() === 'portfolio-pdf')?.filePath || '',
          selectedFile: null,
        },
        'portfolio-docx': {
          description: data.find((d) => d.title?.toLowerCase() === 'portfolio-docx')?.description || '',
          filePath: data.find((d) => d.title?.toLowerCase() === 'portfolio-docx')?.filePath || '',
          previousFilePath: data.find((d) => d.title?.toLowerCase() === 'portfolio-docx')?.filePath || '',
          selectedFile: null,
        },
      });
      setLoading(false);
    }
    load();
  }, [router]);

  const updateForm = useCallback((tabId, field, value) => {
    setForms((prev) => ({ ...prev, [tabId]: { ...prev[tabId], [field]: value } }));
  }, []);

  const handleFileSelect = useCallback((tabId, file) => {
    const tab = TABS.find((t) => t.id === tabId);
    if (!file || !tab) return;

    if (file.size > MAX_FILE_SIZE) {
      showMessage(`File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      if (fileInputRefs.current[tabId]) {
        fileInputRefs.current[tabId].value = '';
      }
      return;
    }

    if (!isAllowedFile(file, tab)) {
      showMessage(`Invalid file type. Please upload ${tab.accept.replace(/,/g, ' or ')}.`);
      if (fileInputRefs.current[tabId]) {
        fileInputRefs.current[tabId].value = '';
      }
      return;
    }

    updateForm(tabId, 'selectedFile', file);
  }, [showMessage, updateForm]);

  const handleUpload = useCallback(async (tabId) => {
    const file = forms[tabId]?.selectedFile;
    if (!file) return;

    setUploadingTab(tabId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('prefix', 'documents/');
      const res = await uploadToR2(fd);

      if (res.success) {
        // Keep previous path so we can delete it after DB save succeeds
        setForms((prev) => ({
          ...prev,
          [tabId]: {
            ...prev[tabId],
            filePath: res.filePath,
            selectedFile: null,
          },
        }));
        showMessage('File uploaded. Click Save to confirm.');
      } else {
        showMessage('Upload failed: ' + res.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('Upload failed.');
    } finally {
      setUploadingTab(null);
      if (fileInputRefs.current[tabId]) {
        fileInputRefs.current[tabId].value = '';
      }
    }
  }, [forms, showMessage]);

  const handleRemoveFile = useCallback((tabId) => {
    const currentPath = forms[tabId]?.filePath;
    if (!currentPath) {
      updateForm(tabId, 'selectedFile', null);
      if (fileInputRefs.current[tabId]) {
        fileInputRefs.current[tabId].value = '';
      }
      return;
    }

    setRemovingTab(tabId);
    try {
      // Clear the file path locally. The physical file is deleted after DB save succeeds.
      setForms((prev) => ({
        ...prev,
        [tabId]: {
          ...prev[tabId],
          filePath: '',
          selectedFile: null,
        },
      }));
      showMessage('File removed. Click Save to confirm.');
    } catch (error) {
      console.error('Remove error:', error);
      showMessage('Failed to remove file.');
    } finally {
      setRemovingTab(null);
    }
  }, [forms, showMessage, updateForm]);

  const handleSubmit = useCallback(async (e, tabId) => {
    e.preventDefault();
    const tab = TABS.find((t) => t.id === tabId);
    const item = resources.find((d) => d.title?.toLowerCase() === tabId.toLowerCase());
    if (!item || !tab) return;

    setSavingTab(tabId);
    try {
      const currentForm = forms[tabId];
      const res = await updateResource(item.id, {
        title: tab.id,
        description: currentForm.description,
        filePath: currentForm.filePath,
      });

      if (res.success) {
        setResources((prev) => prev.map((r) => (r.id === item.id ? res.data : r)));

        // After DB save succeeds, delete the old R2 file if the path changed
        if (
          currentForm.previousFilePath &&
          currentForm.previousFilePath !== currentForm.filePath
        ) {
          await deleteFromR2(currentForm.previousFilePath);
        }

        setForms((prev) => ({
          ...prev,
          [tabId]: {
            ...prev[tabId],
            previousFilePath: currentForm.filePath,
          },
        }));
        showMessage(`${tab.label} updated`);
      } else {
        showMessage('Save failed: ' + res.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      showMessage('Failed to save resource.');
    } finally {
      setSavingTab(null);
    }
  }, [forms, resources, showMessage]);

  const cancelSelection = useCallback((tabId) => {
    updateForm(tabId, 'selectedFile', null);
    if (fileInputRefs.current[tabId]) {
      fileInputRefs.current[tabId].value = '';
    }
  }, [updateForm]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="cms-skeleton h-28" />
        <div className="cms-skeleton h-96" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-60">
      <div className="mb-6">
        <p className="cms-eyebrow">Resources</p>
        <h1 className="cms-page-title">Edit Resources</h1>
        <p className="cms-muted mt-2">
          Upload, replace, or remove the CV, portfolio PDF, and portfolio DOCX files.
        </p>
      </div>

      {message ? <div className="cms-toast mb-4">{message}</div> : null}

      <div className="cms-filter-group mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'cms-filter-active' : 'cms-filter-button'}
          >
            {tab.label}
            {forms[tab.id]?.filePath ? (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            ) : null}
          </button>
        ))}
      </div>

      {TABS.map((tab) =>
        activeTab === tab.id ? (
          <form
            key={tab.id}
            onSubmit={(e) => handleSubmit(e, tab.id)}
            className="cms-card p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <p className="cms-section-title">{tab.label}</p>
              {forms[tab.id]?.filePath ? (
                <span className="cms-pill-internal">File attached</span>
              ) : (
                <span className="cms-pill-neutral">No file</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="cms-label">Description</label>
              <input
                value={forms[tab.id].description}
                onChange={(e) => updateForm(tab.id, 'description', e.target.value)}
                className="cms-input"
                placeholder={tab.defaultDescription}
              />
            </div>

            <div className="space-y-3">
              <label className="cms-label">File</label>

              {forms[tab.id].filePath ? (
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--cms-border)] bg-[rgba(255,253,248,0.6)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--cms-accent-soft)] flex items-center justify-center flex-shrink-0">
                    <HiOutlineDocumentText className="w-5 h-5 text-[var(--cms-accent-strong)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={forms[tab.id].filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--cms-accent-strong)] hover:underline truncate block"
                      title={forms[tab.id].filePath}
                    >
                      {formatFileName(forms[tab.id].filePath)}
                    </a>
                    <p className="text-xs text-[var(--cms-muted)] truncate">
                      {forms[tab.id].filePath}
                    </p>
                  </div>
                  <a
                    href={forms[tab.id].filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cms-icon-button flex-shrink-0"
                    title="Open file"
                  >
                    <HiOutlineExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-[var(--cms-border-strong)] bg-[rgba(255,253,248,0.5)] text-center">
                  <p className="text-sm text-[var(--cms-muted)]">
                    No file uploaded. Select a{' '}
                    <span className="font-semibold text-[var(--cms-ink)]">
                      {tab.accept.replace(/,/g, ' or ')}
                    </span>{' '}
                    file below.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <input
                  ref={(el) => (fileInputRefs.current[tab.id] = el)}
                  type="file"
                  accept={tab.accept}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(tab.id, file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[tab.id]?.click()}
                  className="cms-secondary-btn"
                  disabled={uploadingTab === tab.id || removingTab === tab.id}
                >
                  <HiOutlineUpload className="w-4 h-4" />
                  {forms[tab.id].filePath ? 'Replace File' : 'Upload File'}
                </button>

                {forms[tab.id].filePath && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(tab.id)}
                    className="cms-danger-btn"
                    disabled={removingTab === tab.id || uploadingTab === tab.id}
                  >
                    {removingTab === tab.id ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HiOutlineTrash className="w-4 h-4" />
                    )}
                    Remove
                  </button>
                )}
              </div>

              {forms[tab.id].selectedFile && (
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--cms-border)] bg-[var(--cms-accent-soft)]">
                  <span className="text-sm text-[var(--cms-ink)] flex-1 truncate">
                    Selected: {forms[tab.id].selectedFile.name} (
                    {(forms[tab.id].selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpload(tab.id)}
                    className="cms-primary-btn !py-1.5 !px-3 text-sm"
                    disabled={uploadingTab === tab.id}
                  >
                    {uploadingTab === tab.id ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HiOutlineCheck className="w-4 h-4" />
                    )}
                    Confirm Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelSelection(tab.id)}
                    className="cms-icon-button"
                    disabled={uploadingTab === tab.id}
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="cms-primary-btn"
                disabled={savingTab === tab.id}
              >
                {savingTab === tab.id ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                Save {tab.label}
              </button>
            </div>
          </form>
        ) : null
      )}
    </div>
  );
}
