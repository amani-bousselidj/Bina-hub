// @ts-nocheck
// src/components/layouts/ProfileLayout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen font-[Tajawal]">
      {/* Sidebar */}
      <div
        className={`
        fixed z-40 top-0 right-0 h-full w-64 bg-white shadow-lg p-6 transition-transform
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:static md:block
      `}
      >
        <h2 className="text-xl font-bold mb-6">لوحة التحكم</h2>
        <ul className="space-y-4 text-right">
          <li>
            <Link href="/profile" className="text-blue-600 hover:underline">
              الملف الشخصي
            </Link>
          </li>
          <li>
            <Link href="/user/projects" className="text-blue-600 hover:underline">
              مشاريعي
            </Link>
          </li>
          <li>
            <Link href="/user/orders" className="text-blue-600 hover:underline">
              الطلبات
            </Link>
          </li>
          <li>
            <Link href="/user/settings" className="text-blue-600 hover:underline">
              الإعدادات
            </Link>
          </li>
        </ul>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-full"
      >
        {sidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64 w-full">{children}</main>
    </div>
  );
}




