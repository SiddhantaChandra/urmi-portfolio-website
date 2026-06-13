'use client';

import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { getResources, createResource, updateResource } from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';

export const dynamic = 'force-dynamic';

const TABS = [
  { id: 'cv', label: 'CV', defaultTitle: 'CV', defaultDescription: 'Download my CV' },
  { id: 'portfolio-pdf', label: 'Portfolio (PDF)', defaultTitle: 'Portfolio (PDF)', defaultDescription: 'Download Portfolio PDF' },
  { id: 'portfolio-docx', label: 'Portfolio (DOCX)', defaultTitle: 'Portfolio (DOCX)', defaultDescription: 'Download Portfolio DOCX' },
];

export default function EditResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('cv');
  const fileInputRef = useRef(null);

  const [forms, setForms] = useState({
    cv: { description: '', filePath: '' },
    'portfolio-pdf': { description: '', filePath: '' },
    'portfolio-docx': { description: '', filePath: '' },
  });

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }
      const data = await getResources();

      // Ensure all three tabs exist
      const updatedData = [...data];
      for (const tab of TABS) {
        const existing = updatedData.find(
          d => d.title?.toLowerCase() === tab.id.toLowerCase()
        );
        if (!existing) {
          const res = await createResource({
            title: tab.id,
            description: tab.defaultDescription,
            filePath: '',
          });
          if (res.success) {
            updatedData.push(res.data);
          }
        }
      }

      setResources(updatedData);
      setForms({
        cv: {
          description: updatedData.find(d => d.title?.toLowerCase() === 'cv')?.description || '',
          filePath: updatedData.find(d => d.title?.toLowerCase() === 'cv')?.filePath || '',
        },
        'portfolio-pdf': {
          description: updatedData.find(d => d.title?.toLowerCase() === 'portfolio-pdf')?.description || '',
          filePath: updatedData.find(d => d.title?.toLowerCase() === 'portfolio-pdf')?.filePath || '',
        },
        'portfolio-docx': {
          description: updatedData.find(d => d.title?.toLowerCase() === 'portfolio-docx')?.description || '',
          filePath: updatedData.find(d => d.title?.toLowerCase() === 'portfolio-docx')?.filePath || '',
        },
      });
      setLoading(false);
    }
    load();
  }, [router]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleFileUpload = async (tabId) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'documents/');
    const res = await uploadToR2(fd);
    if (res.success) {
      const existingPath = forms[tabId].filePath;
      if (existingPath) {
        await deleteFromR2(existingPath);
      }
      setForms(prev => ({ ...prev, [tabId]: { ...prev[tabId], filePath: res.filePath } }));
      showMessage('File uploaded');
    } else {
      showMessage('Upload failed: ' + res.error);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = async (tabId) => {
    const existingPath = forms[tabId].filePath;
    if (existingPath) {
      await deleteFromR2(existingPath);
    }
    setForms(prev => ({ ...prev, [tabId]: { ...prev[tabId], filePath: '' } }));
    showMessage('File removed');
  };

  const handleSubmit = async (e, tabId) => {
    e.preventDefault();
    const tab = TABS.find(t => t.id === tabId);
    const item = resources.find(d => d.title?.toLowerCase() === tabId.toLowerCase());
    if (!item) return;

    const res = await updateResource(item.id, {
      title: tab.id,
      description: forms[tabId].description,
      filePath: forms[tabId].filePath,
    });

    if (res.success) {
      setResources(resources.map(r => (r.id === item.id ? res.data : r)));
      showMessage(`${tab.label} updated`);
    }
  };

  const updateForm = (tabId, field, value) => {
    setForms(prev => ({ ...prev, [tabId]: { ...prev[tabId], [field]: value } }));
  };

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
      </div>

      {message ? <div className="cms-toast mb-4">{message}</div> : null}

      <div className="cms-filter-group mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'cms-filter-active' : 'cms-filter-button'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {TABS.map(tab =>
        activeTab === tab.id ? (
          <form
            key={tab.id}
            onSubmit={(e) => handleSubmit(e, tab.id)}
            className="cms-card p-6 space-y-5"
          >
            <p className="cms-section-title">{tab.label}</p>

            <div className="space-y-2">
              <label className="cms-label">Description</label>
              <input
                value={forms[tab.id].description}
                onChange={(e) => updateForm(tab.id, 'description', e.target.value)}
                className="cms-input"
                placeholder={tab.defaultDescription}
              />
            </div>

            <div className="space-y-2">
              <label className="cms-label">File</label>
              <div className="flex items-center gap-4 flex-wrap">
                {forms[tab.id].filePath ? (
                  <span className="cms-help-text">{forms[tab.id].filePath}</span>
                ) : (
                  <span className="cms-help-text">No file uploaded</span>
                )}
                <input ref={fileInputRef} type="file" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cms-secondary-btn"
                >
                  <HiOutlineUpload className="w-4 h-4" />
                  Upload File
                </button>
                {forms[tab.id].filePath && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(tab.id)}
                    className="cms-danger-btn"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
              {fileInputRef.current?.files?.[0] && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-[var(--cms-muted)]">
                    Selected: {fileInputRef.current.files[0].name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleFileUpload(tab.id)}
                    className="cms-primary-btn !py-1 !px-3 text-sm"
                  >
                    Confirm Upload
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="cms-primary-btn">
                Save {tab.label}
              </button>
            </div>
          </form>
        ) : null
      )}
    </div>
  );
}
