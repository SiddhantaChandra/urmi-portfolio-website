'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import {
  getContactInfo, createContactInfo, updateContactInfo, deleteContactInfo, reorderContactInfo,
} from '@/app/actions/db';
import * as PhosphorIcons from '@phosphor-icons/react';

export const dynamic = 'force-dynamic';

export default function EditSocialsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    label: '', value: '', href: '', icon: '', type: 'email',
  });

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }
      const data = await getContactInfo();
      setItems(data);
      setLoading(false);
    }
    load();
  }, [router]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await updateContactInfo(editingId, form);
      if (res.success) {
        setItems(items.map(i => i.id === editingId ? res.data : i));
        setEditingId(null);
        setShowForm(false);
        setForm({ label: '', value: '', href: '', icon: '', type: 'email' });
        showMessage('Updated');
      }
    } else {
      const res = await createContactInfo(form);
      if (res.success) {
        setItems([...items, res.data]);
        setShowForm(false);
        setForm({ label: '', value: '', href: '', icon: '', type: 'email' });
        showMessage('Created');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    const res = await deleteContactInfo(id);
    if (res.success) {
      setItems(items.filter(i => i.id !== id));
      showMessage('Deleted');
    }
  };

  const moveItem = (id, direction) => {
    const index = items.findIndex(i => i.id === id);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newArr = [...items];
    [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
    setItems(newArr);
    reorderContactInfo(newArr.map(i => i.id));
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
        <h1 className="text-2xl font-bold">Social Links & Contact</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ label: '', value: '', href: '', icon: '', type: 'email' }); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">+ Add</button>
      </div>

      {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4 mb-6">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit' : 'Add'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Label</label><input value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Value</label><input value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Href (optional)</label><input value={form.href} onChange={e => setForm({...form, href: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" /></div>
            <div><label className="block text-sm font-medium mb-1">Icon</label><input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Phosphor icon name" required /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required>
                <option value="email">Email</option>
                <option value="location">Location</option>
                <option value="social">Social</option>
                <option value="action">Action</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingId ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map((item, index) => {
          const Icon = PhosphorIcons[item.icon] || PhosphorIcons.Question;
          return (
            <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <div>
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded">{item.type}</span>
                  <p className="text-sm text-gray-500">{item.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => moveItem(item.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↑</button>
                <button onClick={() => moveItem(item.id, 'down')} disabled={index === items.length - 1} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↓</button>
                <button onClick={() => { setEditingId(item.id); setForm({ label: item.label, value: item.value, href: item.href || '', icon: item.icon, type: item.type }); setShowForm(true); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
