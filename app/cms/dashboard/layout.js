'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

const navItems = [
  {
    label: 'Hero Section',
    children: [{ label: 'Edit Hero section', href: '/cms/dashboard/hero' }],
  },
  {
    label: 'Experience',
    children: [{ label: 'Edit experience', href: '/cms/dashboard/experience' }],
  },
  {
    label: 'Articles',
    children: [
      { label: 'Edit articles', href: '/cms/dashboard/articles' },
      { label: 'View articles', href: '/cms/dashboard/articles/view' },
    ],
  },
    {
    label: 'About me',
    children: [{ label: 'Edit About Me', href: '/cms/dashboard/about' }],
  },
  {
    label: 'Socials & Resource',
    children: [
      { label: 'Edit social links', href: '/cms/dashboard/socials' },
      { label: 'Edit resources', href: '/cms/dashboard/resources' },
    ],
  },
];

function SidebarItem({ item, pathname }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="cms-nav-group"
      >
        <span>{item.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen ? (
        <div className="ml-2 mt-2 space-y-1.5">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={pathname === child.href ? 'cms-nav-link-active' : 'cms-nav-link'}
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/cms/login');
  };

  return (
    <div className="cms-shell min-h-screen">
      <aside className="cms-sidebar">
        <div className="px-6 py-5 border-b border-[var(--cms-border)]">
          <Link href="/cms/dashboard" className="block">
            <h1 className="text-2xl font-semibold text-[var(--cms-ink)] mt-2">Urmi CMS</h1>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {navItems.map((item) => (
            <SidebarItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>
      </aside>

      <div className="ml-72 min-h-screen flex flex-col">
        <header className="cms-topbar">
          <div>
            <p className="cms-eyebrow">Workspace</p>
            <h2 className="text-lg font-semibold text-[var(--cms-ink)]">
              {navItems.flatMap((item) => item.children).find((child) => pathname === child.href)?.label || 'Dashboard'}
            </h2>
          </div>
          <button onClick={handleLogout} className="cms-danger-btn">
            Log out
          </button>
        </header>

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
