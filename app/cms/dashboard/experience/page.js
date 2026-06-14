'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import {
  getExperiences, createExperience, updateExperience, deleteExperience,
  createAchievement, updateAchievement, deleteAchievement,
  createExperienceSkill, updateExperienceSkill, deleteExperienceSkill,
  reorderExperiences,
} from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';
import * as PhosphorIcons from '@phosphor-icons/react';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';

export const dynamic = 'force-dynamic';

const COLOR_OPTIONS = [
  { name: 'Green', color: 'from-green-500 to-emerald-500', darkColor: 'dark:from-green-400 dark:to-emerald-400' },
  { name: 'Blue', color: 'from-blue-500 to-cyan-500', darkColor: 'dark:from-blue-400 dark:to-cyan-400' },
  { name: 'Purple', color: 'from-purple-500 to-indigo-500', darkColor: 'dark:from-purple-400 dark:to-indigo-400' },
  { name: 'Red', color: 'from-red-500 to-rose-500', darkColor: 'dark:from-red-400 dark:to-rose-400' },
  { name: 'Pink', color: 'from-pink-500 to-fuchsia-500', darkColor: 'dark:from-pink-400 dark:to-fuchsia-400' },
  { name: 'Indigo', color: 'from-indigo-500 to-violet-500', darkColor: 'dark:from-indigo-400 dark:to-violet-400' },
  { name: 'Orange', color: 'from-orange-500 to-amber-500', darkColor: 'dark:from-orange-400 dark:to-amber-400' },
  { name: 'Teal', color: 'from-teal-500 to-cyan-500', darkColor: 'dark:from-teal-400 dark:to-cyan-400' },
  { name: 'Lime', color: 'from-lime-500 to-green-500', darkColor: 'dark:from-lime-400 dark:to-green-400' },
  { name: 'Sky', color: 'from-sky-500 to-blue-500', darkColor: 'dark:from-sky-400 dark:to-blue-400' },
];

export default function EditExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    period: '', role: '', company: '', location: '', type: '',
    description: '', icon: '', color: '', darkColor: '', logo: '', useCompanyImage: false,
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const iconPickerRef = useRef(null);
  const logoInputRef = useRef(null);

  const ALL_PHOSPHOR_ICONS = useMemo(() => {
    return Object.keys(PhosphorIcons).filter(k => {
      const val = PhosphorIcons[k];
      if (typeof val !== 'function' && typeof val !== 'object') return false;
      const nonIcons = ['Icon', 'IconBase', 'IconContext', 'IconProps', 'IconWeight', 'SSR', 'renderPathForWeight', 'default', '__esModule'];
      return !nonIcons.includes(k);
    }).sort();
  }, []);

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
      const exps = await getExperiences();
      setExperiences(exps);
      setLoading(false);
    }
    load();
  }, [router]);

  useEffect(() => {
    if (!showIconPicker) return;
    const handleClick = (e) => {
      if (iconPickerRef.current && !iconPickerRef.current.contains(e.target)) {
        setShowIconPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showIconPicker]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'experience-logos/');
    const res = await uploadToR2(fd);
    if (res.success) {
      if (form.logo) {
        await deleteFromR2(form.logo);
      }
      setForm(prev => ({ ...prev, logo: res.filePath }));
      showMessage('Logo uploaded');
    } else {
      showMessage('Upload failed: ' + res.error);
    }
  };

  const handleRemoveLogo = async () => {
    if (form.logo) {
      await deleteFromR2(form.logo);
    }
    setForm(prev => ({ ...prev, logo: '' }));
    showMessage('Logo removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      period: form.period,
      role: form.role,
      company: form.company,
      location: form.location,
      type: form.type,
      description: form.description,
      icon: form.useCompanyImage ? '' : form.icon,
      color: form.useCompanyImage ? '' : form.color,
      darkColor: form.useCompanyImage ? '' : form.darkColor,
      logo: form.useCompanyImage ? (form.logo || null) : null,
    };

    if (editingId) {
      const res = await updateExperience(editingId, payload);
      if (res.success) {
        setExperiences(experiences.map(ex => ex.id === editingId ? res.data : ex));
        setEditingId(null);
        setShowForm(false);
        resetForm();
        showMessage('Experience updated');
      }
    } else {
      const res = await createExperience(payload);
      if (res.success) {
        setExperiences([...experiences, res.data]);
        setShowForm(false);
        resetForm();
        showMessage('Experience created');
      }
    }
  };

  const resetForm = () => {
    setForm({
      period: '', role: '', company: '', location: '', type: '',
      description: '', icon: '', color: '', darkColor: '', logo: '', useCompanyImage: false,
    });
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
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, achievements: [...(ex.achievements || []), res.data] } : ex));
      setNewAchievement('');
      showMessage('Achievement added');
    }
  };

  const handleDeleteAchievement = async (id, expId) => {
    if (!confirm('Delete this achievement?')) return;
    const res = await deleteAchievement(id);
    if (res.success) {
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, achievements: (ex.achievements || []).filter(a => a.id !== id) } : ex));
    }
  };

  const handleAddSkill = async (expId) => {
    if (!newSkill.trim()) return;
    const res = await createExperienceSkill(expId, newSkill.trim());
    if (res.success) {
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, skills: [...(ex.skills || []), res.data] } : ex));
      setNewSkill('');
      showMessage('Skill added');
    }
  };

  const handleDeleteSkill = async (id, expId) => {
    if (!confirm('Delete this skill?')) return;
    const res = await deleteExperienceSkill(id);
    if (res.success) {
      setExperiences(experiences.map(ex => ex.id === expId ? { ...ex, skills: (ex.skills || []).filter(s => s.id !== id) } : ex));
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

  const openAddForm = () => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (exp) => {
    const hasLogo = !!exp.logo;
    setEditingId(exp.id);
    setForm({
      period: exp.period || '',
      role: exp.role || '',
      company: exp.company || '',
      location: exp.location || '',
      type: exp.type || '',
      description: exp.description || '',
      icon: exp.icon || '',
      color: exp.color || '',
      darkColor: exp.darkColor || '',
      logo: exp.logo || '',
      useCompanyImage: hasLogo,
    });
    setShowForm(true);
  };

  const selectedColorOption = COLOR_OPTIONS.find(c => c.color === form.color && c.darkColor === form.darkColor) || null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="cms-skeleton h-28" />
        <div className="cms-skeleton h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="cms-page-header">
        <div>
          <p className="cms-eyebrow">Experience</p>
          <h1 className="cms-page-title">Edit Experience</h1>
          <p className="cms-page-subtitle">
            Manage your work history, achievements, and skills developed for each role.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={openAddForm} className="cms-primary-btn">
            + Add Experience
          </button>
        </div>
      </div>

      {message ? <div className="cms-toast">{message}</div> : null}

      {showForm && (
        <form onSubmit={handleSubmit} className="cms-card p-6 space-y-5 mb-6">
          <p className="cms-section-title">{editingId ? 'Edit Experience' : 'Add Experience'}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="cms-label">Role</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="cms-input" required placeholder="e.g. Sub Editor" />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Company</label>
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="cms-input" required placeholder="e.g. ABP Digital" />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="cms-input" required placeholder="e.g. Kolkata" />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Period</label>
              <input value={form.period} onChange={e => setForm({...form, period: e.target.value})} className="cms-input" required placeholder="e.g. Nov 2024 - Present" />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Type / Badge</label>
              <input value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="cms-input" required placeholder="e.g. Current Role" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="cms-label">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="cms-input min-h-24" required placeholder="Short description of the role" />
            </div>
          </div>

          {/* Company Image Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, useCompanyImage: !prev.useCompanyImage }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.useCompanyImage ? 'bg-[var(--cms-accent)]' : 'bg-[var(--cms-border)]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.useCompanyImage ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="cms-label !text-sm">Use Company Image</span>
          </div>

          {form.useCompanyImage ? (
            <div className="space-y-2">
              <label className="cms-label">Company Logo</label>
              <div className="flex items-center gap-4 flex-wrap">
                {form.logo ? (
                  <img src={form.logo} alt="" className="w-16 h-16 object-contain rounded-full border border-[var(--cms-border)]" />
                ) : (
                  <div className="cms-list-art-placeholder w-16 h-16 rounded-full">
                    <span className="cms-muted text-sm">No logo</span>
                  </div>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <button type="button" onClick={() => logoInputRef.current?.click()} className="cms-secondary-btn">
                  <HiOutlineUpload className="w-4 h-4" />
                  Upload to R2
                </button>
                {form.logo && (
                  <button type="button" onClick={handleRemoveLogo} className="cms-danger-btn">
                    <HiOutlineTrash className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
              <input value={form.logo} onChange={e => setForm({...form, logo: e.target.value})} className="cms-input" placeholder="Logo URL or path" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Icon Picker */}
              <div className="relative space-y-2">
                <label className="cms-label">Phosphor Icon</label>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="cms-input w-full flex items-center gap-3 text-left"
                >
                  {(() => {
                    const SelectedIcon = form.icon ? (PhosphorIcons[form.icon] || PhosphorIcons.Question) : null;
                    return SelectedIcon ? (
                      <>
                        <SelectedIcon className="w-5 h-5" />
                        <span className="flex-1">{form.icon}</span>
                      </>
                    ) : (
                      <span className="text-[var(--cms-muted)]">Select an icon...</span>
                    );
                  })()}
                  <span className="ml-auto text-[var(--cms-muted)]">▼</span>
                </button>
                {showIconPicker && (
                  <div
                    ref={iconPickerRef}
                    className="absolute top-full left-0 mt-2 w-full z-[100] bg-[var(--cms-surface)] border border-[var(--cms-border)] rounded-[28px] shadow-lg max-h-80 overflow-hidden flex flex-col"
                  >
                    <div className="p-3 border-b border-[var(--cms-border)]">
                      <input
                        autoFocus
                        value={iconSearch}
                        onChange={e => setIconSearch(e.target.value)}
                        placeholder="Search icons..."
                        className="cms-input"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                    <div className="overflow-y-auto p-3 grid grid-cols-6 gap-2 max-h-60">
                      {(iconSearch.trim()
                        ? ALL_PHOSPHOR_ICONS.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()))
                        : ALL_PHOSPHOR_ICONS
                      ).map(name => {
                        const Icon = PhosphorIcons[name];
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setForm({...form, icon: name});
                              setShowIconPicker(false);
                              setIconSearch('');
                            }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-[18px] hover:bg-[var(--cms-accent-soft)] ${form.icon === name ? 'bg-[var(--cms-accent-soft)] ring-1 ring-[var(--cms-accent)]' : ''}`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] truncate w-full text-center text-[var(--cms-muted)]">{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Color Dropdown */}
              <div className="space-y-2">
                <label className="cms-label">Accent Color</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(false)}
                    className="cms-input w-full flex items-center gap-3 text-left"
                    onClickCapture={() => { /* dropdown logic handled below */ }}
                  >
                    {selectedColorOption ? (
                      <>
                        <span className={`inline-block w-5 h-5 rounded-full bg-gradient-to-r ${selectedColorOption.color}`} />
                        <span className="flex-1">{selectedColorOption.name}</span>
                      </>
                    ) : (
                      <span className="text-[var(--cms-muted)]">Select a color...</span>
                    )}
                  </button>
                  <select
                    value={selectedColorOption ? COLOR_OPTIONS.indexOf(selectedColorOption) : ''}
                    onChange={e => {
                      const idx = parseInt(e.target.value);
                      const opt = COLOR_OPTIONS[idx];
                      if (opt) {
                        setForm({...form, color: opt.color, darkColor: opt.darkColor});
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="" disabled>Select a color...</option>
                    {COLOR_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={idx}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedColorOption && (
                  <div className="flex items-center gap-2 text-sm text-[var(--cms-muted)]">
                    <span className={`inline-block w-4 h-4 rounded-full bg-gradient-to-r ${selectedColorOption.color}`} />
                    <span>Light: {selectedColorOption.color}</span>
                    <span className={`inline-block w-4 h-4 rounded-full bg-gradient-to-r ${selectedColorOption.darkColor}`} />
                    <span>Dark: {selectedColorOption.darkColor}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="submit" className="cms-primary-btn">{editingId ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="cms-secondary-btn">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {experiences.map((exp, index) => {
          const Icon = PhosphorIcons[exp.icon] || PhosphorIcons.Question;
          return (
            <div key={exp.id} className="cms-card p-6 space-y-5">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {exp.logo ? (
                    <img src={exp.logo} alt="" className="w-12 h-12 rounded-full object-cover border border-[var(--cms-border)] shadow-sm" />
                  ) : (
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${exp.color} ${exp.darkColor} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-[var(--cms-ink)]">{exp.role}</h3>
                    <p className="text-sm text-[var(--cms-muted)]">{exp.company} · {exp.location}</p>
                    <p className="text-sm text-[var(--cms-muted)]">{exp.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="cms-pill-internal">{exp.type}</span>
                  <button onClick={() => moveItem(exp.id, 'up')} disabled={index === 0} className="cms-icon-button disabled:opacity-30">↑</button>
                  <button onClick={() => moveItem(exp.id, 'down')} disabled={index === experiences.length - 1} className="cms-icon-button disabled:opacity-30">↓</button>
                  <button onClick={() => openEditForm(exp)} className="cms-secondary-btn">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="cms-danger-btn">Delete</button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--cms-muted)] leading-relaxed">
                {exp.description}
              </p>

              {/* Achievements */}
              <div className="space-y-3">
                <p className="cms-section-title">Key Achievements</p>
                <div className="space-y-2">
                  {exp.achievements?.map(a => (
                    <div key={a.id} className="flex items-center justify-between gap-3 bg-[var(--cms-accent-soft)]/40 p-2 rounded-[18px]">
                      <span className="text-sm text-[var(--cms-ink)]">{a.text}</span>
                      <button onClick={() => handleDeleteAchievement(a.id, exp.id)} className="cms-danger-btn !py-1 !px-2 text-xs">Delete</button>
                    </div>
                  ))}
                  {exp.achievements?.length === 0 && (
                    <p className="text-sm text-[var(--cms-muted)] italic">No achievements yet.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input value={newAchievement} onChange={e => setNewAchievement(e.target.value)} placeholder="New achievement" className="cms-input text-sm flex-1" />
                  <button onClick={() => handleAddAchievement(exp.id)} className="cms-primary-btn !py-2 text-sm">Add</button>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <p className="cms-section-title">Skills Developed</p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills?.map(s => (
                    <span key={s.id} className="cms-pill-neutral inline-flex items-center gap-1">
                      {s.name}
                      <button onClick={() => handleDeleteSkill(s.id, exp.id)} className="text-[var(--cms-danger)] hover:text-[var(--cms-danger)] font-bold ml-1">×</button>
                    </span>
                  ))}
                  {exp.skills?.length === 0 && (
                    <p className="text-sm text-[var(--cms-muted)] italic">No skills yet.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="New skill" className="cms-input text-sm flex-1" />
                  <button onClick={() => handleAddSkill(exp.id)} className="cms-primary-btn !py-2 text-sm">Add</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
