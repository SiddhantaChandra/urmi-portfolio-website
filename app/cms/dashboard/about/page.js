'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    async function load() {
      const { data: session } = await authClient.getSession();
      if (!session || session.user?.role !== 'admin') {
        router.push('/');
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit About Me</h1>
      
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <form onSubmit={handleSkillSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phosphor Icon</label>
                <input value={skillForm.icon} onChange={e => setSkillForm({...skillForm, icon: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="e.g. Globe" required />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingSkill ? 'Update' : 'Add'}</button>
              {editingSkill && <button type="button" onClick={() => { setEditingSkill(null); setSkillForm({name:'',icon:''}); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>}
            </div>
          </form>

          <div className="space-y-2">
            {skills.map((skill, index) => {
              const Icon = PhosphorIcons[skill.icon] || PhosphorIcons.Question;
              return (
                <div key={skill.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveItem(skills, setSkills, skill.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↑</button>
                    <button onClick={() => moveItem(skills, setSkills, skill.id, 'down')} disabled={index === skills.length - 1} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↓</button>
                    <button onClick={() => { setEditingSkill(skill.id); setSkillForm({ name: skill.name, icon: skill.icon }); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
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
          <form onSubmit={handleDiffSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editingDiff ? 'Edit Differentiator' : 'Add Differentiator'}</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input value={diffForm.title} onChange={e => setDiffForm({...diffForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={diffForm.description} onChange={e => setDiffForm({...diffForm, description: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingDiff ? 'Update' : 'Add'}</button>
              {editingDiff && <button type="button" onClick={() => { setEditingDiff(null); setDiffForm({title:'',description:''}); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>}
            </div>
          </form>

          <div className="space-y-2">
            {differentiators.map((diff, index) => (
              <div key={diff.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                  <span className="font-medium">{diff.title}</span>
                  <p className="text-sm text-gray-500">{diff.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveItem(differentiators, setDifferentiators, diff.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↑</button>
                  <button onClick={() => moveItem(differentiators, setDifferentiators, diff.id, 'down')} disabled={index === differentiators.length - 1} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↓</button>
                  <button onClick={() => { setEditingDiff(diff.id); setDiffForm({ title: diff.title, description: diff.description }); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                  <button onClick={() => handleDeleteDiff(diff.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands Tab */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <form onSubmit={handleBrandSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              <div className="flex items-center gap-4">
                {brandForm.logo && <img src={brandForm.logo} alt="" className="w-16 h-16 object-contain" />}
                <input type="file" accept="image/*" onChange={handleBrandImageUpload} className="text-sm" />
                <span className="text-sm text-gray-500">{brandForm.logo || 'No logo'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <input value={brandForm.alt} onChange={e => setBrandForm({...brandForm, alt: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingBrand ? 'Update' : 'Add'}</button>
              {editingBrand && <button type="button" onClick={() => { setEditingBrand(null); setBrandForm({name:'',logo:'',alt:''}); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>}
            </div>
          </form>

          <div className="space-y-2">
            {brands.map((brand, index) => (
              <div key={brand.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  {brand.logo && <img src={brand.logo} alt={brand.alt} className="w-10 h-10 object-contain" />}
                  <span className="font-medium">{brand.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveItem(brands, setBrands, brand.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↑</button>
                  <button onClick={() => moveItem(brands, setBrands, brand.id, 'down')} disabled={index === brands.length - 1} className="p-1 text-gray-500 hover:text-purple-600 disabled:opacity-30">↓</button>
                  <button onClick={() => { setEditingBrand(brand.id); setBrandForm({ name: brand.name, logo: brand.logo, alt: brand.alt }); }} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                  <button onClick={() => handleDeleteBrand(brand.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
