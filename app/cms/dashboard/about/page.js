'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import {
  getSkills, createSkill, updateSkill, deleteSkill, reorderSkills,
  getDifferentiators, createDifferentiator, updateDifferentiator, deleteDifferentiator, reorderDifferentiators,
  getBrands, createBrand, updateBrand, deleteBrand, reorderBrands,
} from '@/app/actions/db';
import { uploadToR2, deleteFromR2 } from '@/app/actions/r2';
import * as PhosphorIcons from '@phosphor-icons/react';

export const dynamic = 'force-dynamic';

export default function EditAboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('skills');
  const [skills, setSkills] = useState([]);
  const [differentiators, setDifferentiators] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const iconPickerRef = useRef(null);

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
      const [s, d, b] = await Promise.all([getSkills(), getDifferentiators(), getBrands()]);
      setSkills(s);
      setDifferentiators(d);
      setBrands(b);
      setLoading(false);
    }
    load();
  }, [router]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const ALL_PHOSPHOR_ICONS = useMemo(() => {
    return Object.keys(PhosphorIcons).filter(k => {
      const val = PhosphorIcons[k];
      if (typeof val !== 'function' && typeof val !== 'object') return false;
      const nonIcons = ['Icon', 'IconBase', 'IconContext', 'IconProps', 'IconWeight', 'SSR', 'renderPathForWeight', 'default', '__esModule'];
      return !nonIcons.includes(k);
    }).sort();
  }, []);

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

  // Skills
  const [skillForm, setSkillForm] = useState({ name: '', icon: '' });
  const [editingSkill, setEditingSkill] = useState(null);

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    if (editingSkill) {
      const res = await updateSkill(editingSkill, skillForm);
      if (res.success) {
        setSkills(skills.map(s => s.id === editingSkill ? res.data : s));
        setEditingSkill(null);
        setSkillForm({ name: '', icon: '' });
        showMessage('Skill updated');
      }
    } else {
      const res = await createSkill(skillForm);
      if (res.success) {
        setSkills([...skills, res.data]);
        setSkillForm({ name: '', icon: '' });
        showMessage('Skill created');
      }
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return;
    const res = await deleteSkill(id);
    if (res.success) {
      setSkills(skills.filter(s => s.id !== id));
      showMessage('Skill deleted');
    }
  };

  // Differentiators
  const [diffForm, setDiffForm] = useState({ title: '', description: '' });
  const [editingDiff, setEditingDiff] = useState(null);

  const handleDiffSubmit = async (e) => {
    e.preventDefault();
    if (editingDiff) {
      const res = await updateDifferentiator(editingDiff, diffForm);
      if (res.success) {
        setDifferentiators(differentiators.map(d => d.id === editingDiff ? res.data : d));
        setEditingDiff(null);
        setDiffForm({ title: '', description: '' });
        showMessage('Differentiator updated');
      }
    } else {
      const res = await createDifferentiator(diffForm);
      if (res.success) {
        setDifferentiators([...differentiators, res.data]);
        setDiffForm({ title: '', description: '' });
        showMessage('Differentiator created');
      }
    }
  };

  const handleDeleteDiff = async (id) => {
    if (!confirm('Delete this differentiator?')) return;
    const res = await deleteDifferentiator(id);
    if (res.success) {
      setDifferentiators(differentiators.filter(d => d.id !== id));
      showMessage('Differentiator deleted');
    }
  };

  // Brands
  const [brandForm, setBrandForm] = useState({ name: '', logo: '', alt: '' });
  const [editingBrand, setEditingBrand] = useState(null);
  const brandFileRef = { current: null };

  const handleBrandImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', 'brands/');
    const res = await uploadToR2(fd);
    if (res.success) {
      if (brandForm.logo) {
        await deleteFromR2(brandForm.logo);
      }
      setBrandForm(prev => ({ ...prev, logo: res.filePath }));
      showMessage('Logo uploaded to R2');
    } else {
      showMessage('Upload failed: ' + res.error);
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (editingBrand) {
      const res = await updateBrand(editingBrand, brandForm);
      if (res.success) {
        setBrands(brands.map(b => b.id === editingBrand ? res.data : b));
        setEditingBrand(null);
        setBrandForm({ name: '', logo: '', alt: '' });
        showMessage('Brand updated');
      }
    } else {
      const res = await createBrand(brandForm);
      if (res.success) {
        setBrands([...brands, res.data]);
        setBrandForm({ name: '', logo: '', alt: '' });
        showMessage('Brand created');
      }
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!confirm('Delete this brand?')) return;
    const brand = brands.find(b => b.id === id);
    if (brand?.logo) {
      await deleteFromR2(brand.logo);
    }
    const res = await deleteBrand(id);
    if (res.success) {
      setBrands(brands.filter(b => b.id !== id));
      showMessage('Brand deleted');
    }
  };

  const moveItem = (arr, setArr, id, direction) => {
    const index = arr.findIndex(item => item.id === id);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= arr.length) return;
    const newArr = [...arr];
    [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
    setArr(newArr);
    const ids = newArr.map(a => a.id);
    if (activeTab === 'skills') reorderSkills(ids);
    else if (activeTab === 'differentiators') reorderDifferentiators(ids);
    else if (activeTab === 'brands') reorderBrands(ids);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'skills', label: 'Skills' },
    { id: 'differentiators', label: 'Differentiators' },
    { id: 'brands', label: 'Brands' },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-60">
      <div className="mb-6">
        <p className="cms-eyebrow">About me</p>
        <h1 className="cms-page-title">Edit About Me</h1>
      </div>
      
      {message ? <div className="cms-toast mb-4">{message}</div> : null}

      <div className="cms-filter-group mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'cms-filter-active' : 'cms-filter-button'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <form onSubmit={handleSkillSubmit} className={`cms-card p-6 space-y-5 relative ${showIconPicker ? 'z-20' : ''}`}>
            <p className="cms-section-title">{editingSkill ? 'Edit Skill' : 'Add Skill'}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="cms-label">Name</label>
                <input value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="cms-input" required />
              </div>
              <div className="relative space-y-2">
                <label className="cms-label">Phosphor Icon</label>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="cms-input w-full flex items-center gap-3 text-left"
                >
                  {(() => {
                    const SelectedIcon = skillForm.icon ? (PhosphorIcons[skillForm.icon] || PhosphorIcons.Question) : null;
                    return SelectedIcon ? (
                      <>
                        <SelectedIcon className="w-5 h-5" />
                        <span className="flex-1">{skillForm.icon}</span>
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
                              setSkillForm({...skillForm, icon: name});
                              setShowIconPicker(false);
                              setIconSearch('');
                            }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-[18px] hover:bg-[var(--cms-accent-soft)] ${skillForm.icon === name ? 'bg-[var(--cms-accent-soft)] ring-1 ring-[var(--cms-accent)]' : ''}`}
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
            </div>
            <div className="flex gap-2">
              <button type="submit" className="cms-primary-btn">{editingSkill ? 'Update' : 'Add'}</button>
              {editingSkill && <button type="button" onClick={() => { setEditingSkill(null); setSkillForm({name:'',icon:''}); }} className="cms-secondary-btn">Cancel</button>}
            </div>
          </form>

          <div className="space-y-3">
            {skills.map((skill, index) => {
              const Icon = PhosphorIcons[skill.icon] || PhosphorIcons.Question;
              return (
                <div key={skill.id} className="cms-list-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[18px] bg-[var(--cms-accent-soft)] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--cms-accent-strong)]" />
                    </div>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveItem(skills, setSkills, skill.id, 'up')} disabled={index === 0} className="cms-icon-button disabled:opacity-30">↑</button>
                    <button onClick={() => moveItem(skills, setSkills, skill.id, 'down')} disabled={index === skills.length - 1} className="cms-icon-button disabled:opacity-30">↓</button>
                    <button onClick={() => { setEditingSkill(skill.id); setSkillForm({ name: skill.name, icon: skill.icon }); }} className="cms-secondary-btn">Edit</button>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="cms-danger-btn">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Differentiators Tab */}
      {activeTab === 'differentiators' && (
        <div className="space-y-6">
          <form onSubmit={handleDiffSubmit} className="cms-card p-6 space-y-5">
            <p className="cms-section-title">{editingDiff ? 'Edit Differentiator' : 'Add Differentiator'}</p>
            <div className="space-y-2">
              <label className="cms-label">Title</label>
              <input value={diffForm.title} onChange={e => setDiffForm({...diffForm, title: e.target.value})} className="cms-input" required />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Description</label>
              <textarea value={diffForm.description} onChange={e => setDiffForm({...diffForm, description: e.target.value})} rows={3} className="cms-input min-h-24" required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="cms-primary-btn">{editingDiff ? 'Update' : 'Add'}</button>
              {editingDiff && <button type="button" onClick={() => { setEditingDiff(null); setDiffForm({title:'',description:''}); }} className="cms-secondary-btn">Cancel</button>}
            </div>
          </form>

          <div className="space-y-3">
            {differentiators.map((diff, index) => (
              <div key={diff.id} className="cms-list-card">
                <div>
                  <span className="font-medium">{diff.title}</span>
                  <p className="text-sm text-[var(--cms-muted)]">{diff.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveItem(differentiators, setDifferentiators, diff.id, 'up')} disabled={index === 0} className="cms-icon-button disabled:opacity-30">↑</button>
                  <button onClick={() => moveItem(differentiators, setDifferentiators, diff.id, 'down')} disabled={index === differentiators.length - 1} className="cms-icon-button disabled:opacity-30">↓</button>
                  <button onClick={() => { setEditingDiff(diff.id); setDiffForm({ title: diff.title, description: diff.description }); }} className="cms-secondary-btn">Edit</button>
                  <button onClick={() => handleDeleteDiff(diff.id)} className="cms-danger-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands Tab */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <form onSubmit={handleBrandSubmit} className="cms-card p-6 space-y-5">
            <p className="cms-section-title">{editingBrand ? 'Edit Brand' : 'Add Brand'}</p>
            <div className="space-y-2">
              <label className="cms-label">Name</label>
              <input value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} className="cms-input" required />
            </div>
            <div className="space-y-2">
              <label className="cms-label">Logo</label>
              <div className="flex items-center gap-4 flex-wrap">
                {brandForm.logo ? (
                  <img src={brandForm.logo} alt="" className="w-16 h-16 object-contain rounded-2xl border border-[var(--cms-border)]" />
                ) : (
                  <div className="cms-list-art-placeholder w-16 h-16">
                    <span className="cms-muted text-sm">No logo</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleBrandImageUpload} className="cms-input text-sm py-2" />
                <span className="cms-help-text">{brandForm.logo || 'No logo uploaded'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="cms-label">Alt Text</label>
              <input value={brandForm.alt} onChange={e => setBrandForm({...brandForm, alt: e.target.value})} className="cms-input" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="cms-primary-btn">{editingBrand ? 'Update' : 'Add'}</button>
              {editingBrand && <button type="button" onClick={() => { setEditingBrand(null); setBrandForm({name:'',logo:'',alt:''}); }} className="cms-secondary-btn">Cancel</button>}
            </div>
          </form>

          <div className="space-y-3">
            {brands.map((brand, index) => (
              <div key={brand.id} className="cms-list-card">
                <div className="flex items-center gap-3">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.alt} className="w-10 h-10 object-contain rounded-xl border border-[var(--cms-border)]" />
                  ) : (
                    <div className="cms-list-art-placeholder w-10 h-10 rounded-xl">
                      <span className="cms-muted text-xs">—</span>
                    </div>
                  )}
                  <span className="font-medium">{brand.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveItem(brands, setBrands, brand.id, 'up')} disabled={index === 0} className="cms-icon-button disabled:opacity-30">↑</button>
                  <button onClick={() => moveItem(brands, setBrands, brand.id, 'down')} disabled={index === brands.length - 1} className="cms-icon-button disabled:opacity-30">↓</button>
                  <button onClick={() => { setEditingBrand(brand.id); setBrandForm({ name: brand.name, logo: brand.logo, alt: brand.alt }); }} className="cms-secondary-btn">Edit</button>
                  <button onClick={() => handleDeleteBrand(brand.id)} className="cms-danger-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
