'use client';

import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import {
  getResources, createResource, updateResource, deleteResource, reorderResources,
} from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';
import * as PhosphorIcons from '@phosphor-icons/react';

export const dynamic = 'force-dynamic';

export default function EditResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', filePath: '', icon: '', gradient: '',
  });

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }
      const data = await getResources();
      setResources(data);
      setLoading(false);
    }
    load();
  }, [router]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'documents/');
    const res = await uploadToR2(fd);
    if (res.success) {
      if (form.filePath) {
        await deleteFromR2(form.filePath);
      }
      setForm(prev => ({ ...prev, filePath: res.filePath }));
      showMessage('File uploaded to R2');
    } else {
      showMessage('Upload failed: ' + res.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await updateResource(editingId, form);
      if (res.success) {
        setResources(resources.map(r => r.id === editingId ? res.data : r));
        setEditingId(null);
        setShowForm(false);
        setForm({ title: '', description: '', filePath: '', icon: '', gradient: '' });
        showMessage('Resource updated');
      }
    } else {
      const res = await createResource(form);
      if (res.success) {
        setResources([...resources, res.data]);
        setShowForm(false);
        setForm({ title: '', description: '', filePath: '', icon: '', gradient: '' });
        showMessage('Resource created');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return;
    const resource = resources.find(r => r.id === id);
    if (resource?.filePath) {
      await deleteFromR2(resource.filePath);
    }
    const res = await deleteResource(id);
    if (res.success) {
      setResources(resources.filter(r => r.id !== id));
      showMessage('Resource deleted');
    }
  };

  const moveItem = (id, direction) => {
    const index = resources.findIndex(r => r.id === id);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= resources.length) return;
    const newArr = [...resources];
    [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
    setResources(newArr);
    reorderResources(newArr.map(r => r.id));
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
        <h1 className="text-2xl font-bold">Resources</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', description: '', filePath: '', icon: '', gradient: '' }); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">+ Add Resource</button>
      </div>

      {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4 mb-6">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Resource' : 'Add Resource'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Icon</label><input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Phosphor icon name" required /></div>
            <div><label className="block text-sm font-medium mb-1">Gradient</label><input value={form.gradient} onChange={e => setForm({...form, gradient: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="e.g. from-blue-500 to-purple-600" required /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File</label>
            <div className="flex items-center gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Upload File</button>
              <span className="text-sm text-gray-500">{form.filePath || 'No file'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingId ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {resources.map((resource, index) => {
          const Icon = PhosphorIcons[resource.icon] || PhosphorIcons.Download;
          return (
            <div key={resource.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${resource.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-medium">{resource.title}</span>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => moveItem(resource.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↑</button>
                <button onClick={() => moveItem(resource.id, 'down')} disabled={index === resources.length - 1} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↓</button>
                <button onClick={() => { setEditingId(resource.id); setForm({ title: resource.title, description: resource.description, filePath: resource.filePath, icon: resource.icon, gradient: resource.gradient }); setShowForm(true); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                <button onClick={() => handleDelete(resource.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
