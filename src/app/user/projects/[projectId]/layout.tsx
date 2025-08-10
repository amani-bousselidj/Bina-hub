"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ShoppingCart, TrendingUp, Shield, Camera, Users, FileText, Settings, Home, ChevronLeft } from 'lucide-react';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params?.projectId as string;

  const items = [
    { href: `/user/projects/${projectId}`, label: 'نظرة عامة', icon: Home },
    { href: `/user/projects/${projectId}/marketplace`, label: 'السوق', icon: ShoppingCart },
    { href: `/user/expenses?projectId=${projectId}`, label: 'المصروفات', icon: TrendingUp },
    { href: `/user/warranties?projectId=${projectId}`, label: 'الضمانات', icon: Shield },
    { href: `/user/projects/${projectId}/photos`, label: 'صور المراحل', icon: Camera },
    { href: `/user/projects/${projectId}/team`, label: 'فريق المشروع', icon: Users },
    { href: `/user/projects/${projectId}/report`, label: 'تقرير شامل', icon: FileText },
    { href: `/user/projects/${projectId}/settings`, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6" dir="rtl">
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-4 bg-white border rounded-xl p-4">
          <div className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> أقسام المشروع
          </div>
          <nav className="space-y-1">
            {items.map((it) => {
              const Icon = it.icon;
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition border ${
                    active
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'text-gray-700 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{it.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <section className="flex-1 min-w-0">{children}</section>
    </div>
  );
}
