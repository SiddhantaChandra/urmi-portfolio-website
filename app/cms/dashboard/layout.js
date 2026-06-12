'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

const navItems = [
  {
    label: 'Hero Section',
    children: [
      { label: 'Edit Hero section', href: '/cms/dashboard/hero' },
    ],
  },
  {
    label: 'About me',
    children: [
      { label: 'Edit About Me', href: '/cms/dashboard/about' },
    ],
  },
  {
    label: 'Experience',
    children: [
      { label: 'Edit experience', href: '/cms/dashboard/experience' },
    ],
  },
  {
    label: 'Articles',
    children: [
      { label: 'Edit articles', href: '/cms/dashboard/articles' },
      { label: 'View articles', href: '/cms/dashboard/articles/view' },
    ],
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
  const hasActiveChild = item.children.some((child) => pathname === child.href);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
      {isOpen && (
        <div className="ml-2 mt-1 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                pathname === child.href
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
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
    <div className="min-h-screen flex bg-neutral-bg dark:bg-neutral-bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-10">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/cms/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
            CMS Dashboard
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <SidebarItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {navItems
                .flatMap((item) => item.children)
                .find((child) => pathname === child.href)?.label || 'Dashboard'}
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log out
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
