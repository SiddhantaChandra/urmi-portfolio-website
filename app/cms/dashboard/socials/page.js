'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import {
  getContactInfo, createContactInfo, updateContactInfo,
} from '@/app/actions/db';

export const dynamic = 'force-dynamic';

const TABS = [
  { id: 'linkedin', label: 'LinkedIn', defaultIcon: 'LinkedinLogo', defaultType: 'social' },
  { id: 'muckrack', label: 'Muckrack', defaultIcon: 'Globe', defaultType: 'social' },
];

export default function EditSocialsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('linkedin');

  const [forms, setForms] = useState({
    linkedin: { value: '', href: '' },
    muckrack: { value: '', href: '' },
  });

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session) {
        router.replace('/cms/login');
        return;
      }
      if (session.user?.role !== 'admin') {
        router.replace('/');
        return;
      }
      const data = await getContactInfo();

      // Ensure both tabs exist
      const updatedData = [...data];
      for (const tab of TABS) {
        const existing = updatedData.find(
          d => d.label.toLowerCase() === tab.id.toLowerCase()
        );
        if (!existing) {
          const res = await createContactInfo({
            label: tab.label,
            value: '',
            href: '',
            icon: tab.defaultIcon,
            type: tab.defaultType,
          });
          if (res.success) {
            updatedData.push(res.data);
          }
        }
      }

      setItems(updatedData);
      setForms({
        linkedin: {
          value: updatedData.find(d => d.label.toLowerCase() === 'linkedin')?.value || '',
          href: updatedData.find(d => d.label.toLowerCase() === 'linkedin')?.href || '',
        },
        muckrack: {
          value: updatedData.find(d => d.label.toLowerCase() === 'muckrack')?.value || '',
          href: updatedData.find(d => d.label.toLowerCase() === 'muckrack')?.href || '',
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

  const handleSubmit = async (e, tabId) => {
    e.preventDefault();
    const tab = TABS.find(t => t.id === tabId);
    const item = items.find(d => d.label.toLowerCase() === tabId.toLowerCase());
    if (!item) return;

    const res = await updateContactInfo(item.id, {
      label: tab.label,
      value: forms[tabId].value,
      href: forms[tabId].href,
      icon: tab.defaultIcon,
      type: tab.defaultType,
    });

    if (res.success) {
      setItems(items.map(i => (i.id === item.id ? res.data : i)));
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
      <div className="cms-page-header mb-6">
        <div>
          <p className="cms-eyebrow">Socials</p>
          <h1 className="cms-page-title">Edit Social Links</h1>
        </div>
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
              <label className="cms-label">Value (display text or username)</label>
              <input
                value={forms[tab.id].value}
                onChange={(e) => updateForm(tab.id, 'value', e.target.value)}
                className="cms-input"
                placeholder={`e.g. ${tab.label} profile`}
              />
            </div>
            <div className="space-y-2">
              <label className="cms-label">URL (href)</label>
              <input
                value={forms[tab.id].href}
                onChange={(e) => updateForm(tab.id, 'href', e.target.value)}
                className="cms-input"
                placeholder="https://..."
              />
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
