'use client';

import * as React from 'react';
import {
  User,
  BarChart3,
  Package,
  Settings,
  Home,
  Search,
  Heart,
  Menu,
  X,
  Calculator,
  CreditCard,
  Shield,
  FileText,
  MessageSquare,
  Building2,
  LogOut,
  Wrench,
  TrendingUp,
  Star,
  Receipt,
  Banknote,
  ChevronDown,
  ChevronRight,
  Bell,
  HelpCircle,
  Palette,
  Archive,
  Camera,
  ShoppingCart,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService } from '../../../auth/services/authService';

// User navigation sections with similar structure to store
const navSections = [
  // Core Navigation
  {
    title: 'لوحة التحكم الرئيسية',
    items: [
      { href: '/user/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
      { href: '/user/chat', label: 'المحادثات', icon: MessageSquare },
    ]
  },
  // Projects & Building
  {
    title: 'المشاريع والبناء',
    isDropdown: true,
    key: 'projects',
    icon: Building,
    items: [
      { href: '/user/projects', label: 'مشاريعي', icon: Package },
  { href: '/user/projects/create', label: 'مشروع جديد', icon: Building },
      { href: '/user/projects/list', label: 'قائمة المشاريع', icon: Archive },
      { href: '/user/comprehensive-construction-calculator', label: 'حاسبة التكلفة', icon: Calculator },
      { href: '/user/building-advice', label: 'نصائح البناء', icon: FileText },
      { href: '/user/smart-construction-advisor', label: 'المستشار الذكي', icon: Wrench },
    ]
  },
  // Marketplace & Shopping
  {
    title: 'التسوق والمتاجر',
    items: [
      { href: '/user/stores-browse', label: 'تصفح المتاجر', icon: Building2 },
      { href: '/user/cart', label: 'سلة التسوق', icon: ShoppingCart },
      { href: '/user/orders', label: 'طلباتي', icon: Receipt },
      { href: '/user/favorites', label: 'المفضلة', icon: Heart },
      { href: '/user/projects-marketplace', label: 'سوق المشاريع', icon: Star },
    ]
  },
  // Finance & Payments
  {
    title: 'المالية والمدفوعات',
    isDropdown: true,
    key: 'finance',
    icon: CreditCard,
    items: [
      { href: '/user/balance', label: 'الرصيد', icon: Banknote },
      { href: '/user/invoices', label: 'الفواتير', icon: Receipt },
      { href: '/user/expenses', label: 'المصروفات', icon: TrendingUp },
      { href: '/user/subscriptions', label: 'الاشتراكات', icon: Star },
      { href: '/user/warranties', label: 'الضمانات', icon: Shield },
      { href: '/user/warranty-expense-tracking', label: 'تتبع مصاريف الضمان', icon: FileText },
    ]
  },
  // AI & Smart Features
  {
    title: 'الذكاء الاصطناعي',
    items: [
      { href: '/user/ai-assistant', label: 'المساعد الذكي', icon: MessageSquare },
      { href: '/user/ai-hub', label: 'مركز الذكاء الاصطناعي', icon: Wrench },
      { href: '/user/smart-insights', label: 'الرؤى الذكية', icon: TrendingUp },
      { href: '/user/company-bulk-optimizer', label: 'محسن الجملة للشركات', icon: Building2 },
    ]
  },
  // Community & Support
  {
    title: 'المجتمع والدعم',
    items: [
      { href: '/user/social-community', label: 'المجتمع الاجتماعي', icon: MessageSquare },
      { href: '/user/gamification', label: 'التحديات والجوائز', icon: Star },
      { href: '/user/documents', label: 'المستندات', icon: FileText },
      { href: '/user/settings', label: 'الإعدادات', icon: Settings },
    ]
  }
];

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState<{[key: string]: boolean}>({
    projects: false,
    finance: false
  });

  const handleLogout = async () => {
    await authService.signOut();
    window.location.href = '/auth/login';
  };

  // Toggle dropdown sections
  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Auto-expand sections based on current path
  React.useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith('/user/projects/') || pathname.startsWith('/user/building-') || pathname.startsWith('/user/smart-') || pathname.startsWith('/user/comprehensive-')) {
      setExpandedSections(prev => ({ ...prev, projects: true }));
    } else if (pathname.startsWith('/user/balance') || pathname.startsWith('/user/invoices') || pathname.startsWith('/user/expenses') || pathname.startsWith('/user/subscriptions') || pathname.startsWith('/user/warranties')) {
      setExpandedSections(prev => ({ ...prev, finance: true }));
    }
  }, [pathname]);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col" dir="rtl">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg">
            <User className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-white">
            <h1 className="text-base font-bold">بناء - المستخدم</h1>
            <p className="text-xs text-green-100">
              منصة البناء الذكي
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-3 overflow-y-auto min-h-0" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#CBD5E0 #F7FAFC'
      }}>
        <div className="space-y-6 pb-4">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              {/* Section Header */}
              <div className="flex items-center justify-between px-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </p>
                {section.items && (
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {section.items.length}
                  </div>
                )}
              </div>
              {/* Dropdown Section */}
              {section.isDropdown ? (
                <div className="space-y-1">
                  {/* Dropdown Header */}
                  <button
                    onClick={() => toggleSection(section.key!)}
                    className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      expandedSections[section.key!] || section.items?.some(item =>
                        pathname && (pathname === item.href || (item.href !== '/user' && pathname.startsWith(item.href)))
                      )
                        ? 'bg-green-50 text-green-700 font-bold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                    }`}
                  >
                    <section.icon className={`h-4 w-4 transition-all flex-shrink-0 ${
                      expandedSections[section.key!] || section.items?.some(item =>
                        pathname && (pathname === item.href || (item.href !== '/user' && pathname.startsWith(item.href)))
                      )
                        ? 'text-green-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span className="flex-1 truncate text-right">{section.title}</span>
                    {expandedSections[section.key!] ? (
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform" />
                    )}
                  </button>
                  {/* Dropdown Items */}
                  {expandedSections[section.key!] && section.items && (
                    <div className="mr-6 space-y-1 border-r-2 border-green-100">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname && (pathname === item.href || (item.href !== '/user' && pathname.startsWith(item.href)));

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-green-100 text-green-800 border-r-4 border-green-600 font-bold shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                            }`}
                          >
                            <Icon className={`h-4 w-4 transition-all flex-shrink-0 ${
                              isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'
                            }`} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {isActive && (
                              <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Regular Section Items */
                section.items && (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname && (pathname === item.href || (item.href !== '/user' && pathname.startsWith(item.href)));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-green-50 text-green-700 border-r-4 border-green-600 font-bold shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                          }`}
                        >
                          <Icon className={`h-4 w-4 transition-all flex-shrink-0 ${
                            isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                          }`} />
                          <span className="flex-1 truncate">{item.label}</span>
                          {isActive && (
                            <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                المستخدم
              </p>
              <p className="text-xs text-gray-500 truncate">
                user@binna.com
              </p>
            </div>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors w-full text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </nav>
    </div>
  );
}


