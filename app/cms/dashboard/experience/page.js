'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import {
  getExperiences, createExperience, updateExperience, deleteExperience,
  createAchievement, updateAchievement, deleteAchievement,
  createExperienceSkill, updateExperienceSkill, deleteExperienceSkill,
  reorderExperiences,
} from '@/app/actions/db';
import * as PhosphorIcons from '@phosphor-icons/react';

export const dynamic = 'force-dynamic';

export default function EditExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    period: '', role: '', company: '', location: '', type: '',
    description: '', icon: '', color: '', darkColor: '',
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
        return;
      }
      const exps = await getExperiences();
      setExperiences(exps);
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
      const res = await updateExperience(editingId, form);
      if (res.success) {
        setExperiences(experiences.map(ex => ex.id === editingId ? res.data : ex));
        setEditingId(null);
        setShowForm(false);
        setForm({ period: '', role: '', company: '', location: '', type: '', description: '', icon: '', color: '', darkColor: '' });
        showMessage('Experience updated');
      }
    } else {
      const res = await createExperience(form);
      if (res.success) {
        setExperiences([...experiences, res.data]);
        setShowForm(false);
        setForm({ period: '', role: '', company: '', location: '', type: '', description: '', icon: '', color: '', darkColor: '' });
        showMessage('Experience created');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    const res = await deleteExperience(id);
    if (res.success) {
      setExperiences(experiences.filter(ex => ex.id !== id));
      showMessage('Experience deleted');
    }
  };

  const handleAddAchievement = async (expId) => {
    if (!newAchievement.trim()) return;
    const res = await createAchievement(expId, newAchievement.trim());
    if (res.success) {
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, achievements: [...ex.achievements, res.data] } : ex));
      setNewAchievement('');
      showMessage('Achievement added');
    }
  };

  const handleDeleteAchievement = async (id, expId) => {
    if (!confirm('Delete this achievement?')) return;
    const res = await deleteAchievement(id);
    if (res.success) {
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, achievements: ex.achievements.filter(a => a.id !== id) } : ex));
    }
  };

  const handleAddSkill = async (expId) => {
    if (!newSkill.trim()) return;
    const res = await createExperienceSkill(expId, newSkill.trim());
    if (res.success) {
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, skills: [...ex.skills, res.data] } : ex));
      setNewSkill('');
      showMessage('Skill added');
    }
  };

  const handleDeleteSkill = async (id, expId) => {
    if (!confirm('Delete this skill?')) return;
    const res = await deleteExperienceSkill(id);
    if (res.success) {
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, skills: ex.skills.filter(s => s.id !== id) } : ex));
    }
  };

  const moveItem = (id, direction) => {
    const index = experiences.findIndex(item => item.id === id);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= experiences.length) return;
    const newArr = [...experiences];
    [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
    setExperiences(newArr);
    reorderExperiences(newArr.map(a => a.id));
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
        <h1 className="text-2xl font-bold">Edit Experience</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ period: '', role: '', company: '', location: '', type: '', description: '', icon: '', color: '', darkColor: '' }); }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add Experience
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4 mb-6">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Period</label><input value={form.period} onChange={e => setForm({...form, period: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Role</label><input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Company</label><input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Type</label><input value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
            <div><label className="block text-sm font-medium mb-1">Icon</label><input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="Phosphor icon name" required /></div>
            <div><label className="block text-sm font-medium mb-1">Color</label><input value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="e.g. from-green-500 to-emerald-500" required /></div>
            <div><label className="block text-sm font-medium mb-1">Dark Color</label><input value={form.darkColor} onChange={e => setForm({...form, darkColor: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="e.g. dark:from-green-400 dark:to-emerald-400" required /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required /></div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingId ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {experiences.map((exp, index) => {
          const Icon = PhosphorIcons[exp.icon] || PhosphorIcons.Question;
          return (
            <div key={exp.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${exp.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.role}</h3>
                    <p className="text-sm text-gray-500">{exp.company} · {exp.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveItem(exp.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↑</button>
                  <button onClick={() => moveItem(exp.id, 'down')} disabled={index === experiences.length - 1} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↓</button>
                  <button onClick={() => { setEditingId(exp.id); setForm({ ...exp }); setShowForm(true); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
                  <button onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded">
                    {expandedId === exp.id ? 'Collapse' : 'Expand'}
                  </button>
                </div>
              </div>

              {expandedId === exp.id && (
                <div className="mt-4 space-y-4">
                  {/* Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Achievements</h4>
                    <div className="space-y-2">
                      {exp.achievements?.map(a => (
                        <div key={a.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <span className="text-sm">{a.text}</span>
                          <button onClick={() => handleDeleteAchievement(a.id, exp.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <input value={newAchievement} onChange={e => setNewAchievement(e.target.value)} placeholder="New achievement" className="flex-1 px-3 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm" />
                      <button onClick={() => handleAddAchievement(exp.id)} className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">Add</button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills?.map(s => (
                        <span key={s.id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                          {s.name}
                          <button onClick={() => handleDeleteSkill(s.id, exp.id)} className="text-red-600 hover:text-red-800">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="New skill" className="flex-1 px-3 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm" />
                      <button onClick={() => handleAddSkill(exp.id)} className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">Add</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
