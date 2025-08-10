'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  Store, 
  User, 
  Wrench, 
  Shield, 
  Home,
  ChevronDown,
  Settings,
  BarChart3
} from 'lucide-react';

interface CrossSectionNavigationProps {
  currentSection: 'user' | 'store' | 'service-provider' | 'admin';
  userRole?: string;
}

export default function CrossSectionNavigation({ currentSection, userRole }: CrossSectionNavigationProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sections = [
    {
      key: 'user',
      label: 'المستخدم',
      href: '/user/dashboard',
      icon: User,
      description: 'إدارة الحساب والملف الشخصي',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      key: 'store',
      label: 'المتجر',
      href: '/store/dashboard',
      icon: Store,
      description: 'إدارة المتجر والمبيعات',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      key: 'service-provider',
      label: 'مقدم الخدمة',
      href: '/service-provider/dashboard',
      icon: Wrench,
      description: 'إدارة الخدمات والمشاريع',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      key: 'admin',
      label: 'الإدارة',
      href: '/admin/dashboard',
      icon: Shield,
      description: 'إدارة النظام العامة',
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

  const currentSectionData = sections.find(s => s.key === currentSection);
  const otherSections = sections.filter(s => s.key !== currentSection);

  const quickLinks = [
    {
      label: 'الصفحة الرئيسية',
      href: '/',
      icon: Home
    },
    {
      label: 'التقارير العامة',
      href: `/${currentSection}/reports`,
      icon: BarChart3
    },
    {
      label: 'الإعدادات',
      href: `/${currentSection}/settings`,
      icon: Settings
    }
  ];

  return (
    <div className="relative">
      {/* Section Switcher */}
      <div className="flex items-center gap-4 p-4 bg-white border-b">
        {/* Current Section Indicator */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg text-white ${currentSectionData?.color}`}>
            {currentSectionData?.icon && <currentSectionData.icon className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{currentSectionData?.label}</h2>
            <p className="text-sm text-gray-600">{currentSectionData?.description}</p>
          </div>
        </div>

        {/* Section Switcher Dropdown */}
        <div className="relative mr-auto">
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2"
          >
            التبديل بين الأقسام
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="text-sm font-medium text-gray-700 px-3 py-2 border-b">
                  الانتقال إلى قسم آخر
                </div>
                
                {/* Other Sections */}
                <div className="space-y-1 mt-2">
                  {otherSections.map((section) => (
                    <Link
                      key={section.key}
                      href={section.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className={`p-2 rounded text-white ${section.color}`}>
                        <section.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{section.label}</div>
                        <div className="text-sm text-gray-600">{section.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Quick Links */}
                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm font-medium text-gray-700 px-3 py-1">
                    روابط سريعة
                  </div>
                  <div className="space-y-1 mt-1">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <link.icon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background overlay when dropdown is open */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}


