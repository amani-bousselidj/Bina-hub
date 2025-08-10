"use client"

import { useAuth } from '@/core/shared/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
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

export const dynamic = 'force-dynamic';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Auth from root provider (RootLayout wraps with AuthProvider)
  const { user, isLoading, signOut } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    projects: false
  });
  
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      console.log('🚪 [User Layout] Starting logout process...');
      
      // Call our logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ [User Layout] Logout API successful');
      } else {
        console.warn('⚠️ [User Layout] Logout API failed, continuing with client-side cleanup');
      }
      
      // Clear client-side auth state if signOut function available
      if (signOut) {
        await signOut();
      }
      
      // Redirect to login
      router.push('/auth/login');
      console.log('✅ [User Layout] Logout complete, redirecting to login');
    } catch (error) {
      console.error('❌ [User Layout] Logout error:', error);
      // Even if API fails, clear client state and redirect
      if (signOut) {
        await signOut();
      }
      router.push('/auth/login');
    } finally {
      setLogoutLoading(false);
    }
  };

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
        { href: '/user/comprehensive-construction-calculator', label: 'حاسبة البناء', icon: Calculator },
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
      ]
    },

    // Finance & Payments (moved to project scope when applicable)
    {
      title: 'المالية والمدفوعات',
      items: [
        { href: '/user/balance', label: 'الرصيد', icon: Banknote },
        { href: '/user/invoices', label: 'الفواتير', icon: Receipt },
        { href: '/user/subscriptions', label: 'الاشتراكات', icon: Star },
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
  },
  // Marketplace & Shopping
    {
      title: 'التسوق والمتاجر',
      items: [
        { href: '/user/stores-browse', label: 'تصفح المتاجر', icon: Building2 },
        { href: '/user/cart', label: 'سلة التسوق', icon: ShoppingCart },
        { href: '/user/orders', label: 'طلباتي', icon: Receipt },
        { href: '/user/favorites', label: 'المفضلة', icon: Heart },
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

  // Get current page name
  const getCurrentPageName = () => {
    if (!pathname) return 'لوحة التحكم';
    
    for (const section of navSections) {
      if (section.items) {
        const currentItem = section.items.find(item => {
          if (item.href === '/user' && pathname === '/user') return true;
          if (item.href !== '/user' && pathname.startsWith(item.href)) return true;
          return pathname === item.href;
        });
        if (currentItem) return currentItem.label;
      }
    }
    return 'لوحة التحكم';
  };

  // Toggle dropdown sections
  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Auto-expand sections based on current path
  useEffect(() => {
    if (!pathname) return;
    
    if (pathname.startsWith('/user/projects/') || pathname.startsWith('/user/building-') || pathname.startsWith('/user/smart-') || pathname.startsWith('/user/comprehensive-') || pathname.startsWith('/user/individual-')) {
      setExpandedSections(prev => ({ ...prev, projects: true }));
    }
  }, [pathname]);

  if (!isClientSide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 flex" dir="rtl">
          {/* Mobile sidebar backdrop */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="h-4 w-4" />
          </Button>
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
                              onClick={() => setSidebarOpen(false)}
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
                            onClick={() => setSidebarOpen(false)}
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
                  {user?.name || 'المستخدم'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@binna.com'}
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:mr-72 min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {getCurrentPageName()}
                </h1>
                <p className="text-sm text-gray-500">
                  منصة البناء الذكي
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                {logoutLoading && <span className="ml-1">...</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
