// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/core/shared/hooks/useTranslation';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Building2,
  FileText,
  Calculator,
  Shield,
  Users,
  ChevronDown,
  Home,
  Package,
  DollarSign,
  Calendar,
  ShoppingCart,
  MapPin,
  Hammer,
  FileCheck,
  Truck,
  Award,
  Bot,
  Sparkles
} from 'lucide-react';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { NotificationService } from '@/core/shared/services/notifications';
import { getTempAuthUser, clearTempAuth } from '@/core/shared/auth/AuthProvider';

interface NavbarProps {
  user?: any | null;
  accountType?: string | null;
}

interface UserData {
  id: string;
  name: string | null;
  account_type: string;
  email: string;
}

export default function Navbar({ user, accountType }: NavbarProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const journeyRef = useRef<HTMLDivElement>(null);
  // Load user data from props (already passed from LayoutProvider)
  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        name: user.name || user.email || null,
        account_type: user.account_type || accountType || 'user',
        email: user.email || '',
      });
      console.log('✅ [Navbar] User data set:', user.email, user.account_type);
    } else {
      setUserData(null);
      console.log('❌ [Navbar] No user data, clearing state');
    }
  }, [user, accountType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (journeyRef.current && !journeyRef.current.contains(event.target as Node)) {
        setJourneyOpen(false);
      }
    }
    if (journeyOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [journeyOpen]);  // Fetch unread count and recent notifications
  useEffect(() => {
    if (!userData?.id) return;
    
    let unsub: (() => void) | undefined;
    
    const fetchNotifications = async () => {
      try {
        if (!userData?.id) {
          console.warn('fetchNotifications: No valid user ID');
          return;
        }
        
        // Use optional chaining and check if method exists
        if (NotificationService && typeof NotificationService.getUnreadCount === 'function') {
          const count = await NotificationService.getUnreadCount(userData.id);
          setUnreadCount(count);
        } else {
          console.log('NotificationService.getUnreadCount not available, setting count to 0');
          setUnreadCount(0);
        }
        
        // For now, we'll just set empty notifications
        setNotifications([]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Set defaults to prevent UI issues
        setUnreadCount(0);
        setNotifications([]);
      }
    };
    
    fetchNotifications();
    
    // Subscribe to real-time notifications if available
    try {
      if (userData?.id && NotificationService && NotificationService.getInstance) {
        const instance = NotificationService.getInstance();
        if (instance && typeof instance.subscribeToNotifications === 'function') {
          instance.subscribeToNotifications(userData.id, (notif) => {
            setUnreadCount((c) => c + 1);
            setNotifications((prev: any) => [notif, ...prev].slice(0, 10));
          });
          unsub = () => instance.unsubscribeFromNotifications(userData.id);
        }
      }
    } catch (error) {
      console.log('Notification service not available:', error);
    }
    
    return unsub;
  }, [userData?.id]);

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      if (NotificationService && typeof NotificationService.markAsRead === 'function') {
        await NotificationService.markAsRead(id);
      }
      setNotifications((prev: any) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getDashboardRoute = () => {
    if (!userData) return '/';
    
    switch (userData.account_type) {
      case 'store':
        return '/store/dashboard';
      case 'user':
      case 'client':
        return '/user/dashboard';
      case 'engineer':
      case 'consultant':
        return '/dashboard/construction-data';
      case 'concrete-supplier':
      case 'concrete_supplier':
        return '/dashboard/concrete-supplier';
      case 'equipment-rental':
      case 'equipment_rental':
        return '/dashboard/equipment-rental';
      case 'waste-management':
      case 'waste_management':
        return '/dashboard/waste-management';
      case 'contractor':
        return '/dashboard/contractor';
      default:
        return '/';
    }
  };

  const navigationItems = [
    {
      label: 'الرئيسية',
      href: '/',
      icon: Home,
      requiresAuth: false
    },
    {
      label: 'المشاريع',
      href: '/projects',
      icon: Building2,
      requiresAuth: false
    },
    {
      label: 'السوق',
      href: '#',
      icon: Package,
      requiresAuth: false,
      isDropdown: true,
      dropdownItems: [
        {
          label: 'تصفح المتاجر',
          href: '/stores-browse',
          icon: Package,
          description: 'تصفح متاجر مواد البناء'
        },
        {
          label: 'السوق العام',
          href: '/marketplace',
          icon: Building2,
          description: 'السوق العام لمواد البناء'
        },
        {
          label: 'أسعار المواد',
          href: '/material-prices',
          icon: DollarSign,
          description: 'أسعار مواد البناء المحدثة'
        },
        {
          label: 'المشاريع للبيع',
          href: '/marketplace',
          icon: Building2,
          description: 'مشاريع بناء للبيع'
        },
        {
          label: 'دليل المشرفين',
          href: '/supervisors',
          icon: Users,
          description: 'دليل مشرفي البناء'
        }
      ]
    },
    {
      label: 'رحلة البناء',
      href: '#',
      icon: MapPin,
      requiresAuth: false,
      isDropdown: true,
      dropdownItems: [
        {
          label: 'شراء الأرض',
          href: '/construction-journey/land-purchase',
          icon: MapPin,
          description: 'البحث عن الأراضي والشراء'
        },
        {
          label: 'اختيار المقاول',
          href: '/construction-journey/contractor-selection',
          icon: Users,
          description: 'اختيار المقاول والمخططات'
        },
        {
          label: 'التسوير',
          href: '/construction-journey/fencing',
          icon: Shield,
          description: 'تسوير الأرض وتأمينها'
        },
        {
          label: 'الحفر وتجهيز الأرض',
          href: '/construction-journey/excavation',
          icon: Hammer,
          description: 'أعمال الحفر والتجهيز'
        },
        {
          label: 'إصدار التأمين',
          href: '/construction-journey/insurance',
          icon: Shield,
          description: 'الحصول على التأمين'
        },
        {
          label: 'مخلفات البناء',
          href: '/construction-journey/waste-disposal',
          icon: Truck,
          description: 'إدارة مخلفات البناء'
        },
        {
          label: 'مراجعة المخططات',
          href: '/construction-journey/blueprint-approval',
          icon: FileCheck,
          description: 'مراجعة وموافقة المخططات'
        },
        {
          label: 'التنفيذ والمتابعة',
          href: '/construction-journey/execution',
          icon: Building2,
          description: 'تنفيذ ومتابعة البناء'
        },
        {
          label: 'إنهاء المشروع',
          href: '/construction-journey/completion',
          icon: Award,
          description: 'إنهاء وتسليم المشروع'
        },
        {
          label: 'مشروع بناء متكامل',
          href: '/user/projects/create/construction',
          icon: Building2,
          description: 'إنشاء مشروع بناء متكامل',
          isHighlighted: true
        }
      ]
    },
    {
      label: 'الأدوات',
      href: '#',
      icon: Calculator,
      requiresAuth: false,
      isDropdown: true,
      dropdownItems: [
        {
          label: 'حاسبة التكلفة',
          href: '/calculator',
          icon: Calculator,
          description: 'حساب تكلفة البناء'
        },
        {
          label: 'حاسبة البيت',
          href: '/calculator',
          icon: Home,
          description: 'حاسبة تكلفة بناء البيت'
        },
        {
          label: 'المساعد الذكي',
          href: '/ai-assistant',
          icon: Bot,
          description: 'مساعد ذكي للبناء'
        },
        {
          label: 'بيانات البناء',
          href: '/construction-data',
          icon: FileText,
          description: 'بيانات وإحصائيات البناء'
        },
        {
          label: 'دليل المنصة',
          href: '/platform-pages',
          icon: FileText,
          description: 'دليل شامل لصفحات المنصة'
        }
      ]
    },
    {
      label: 'المجتمع',
      href: '#',
      icon: Users,
      requiresAuth: false,
      isDropdown: true,
      dropdownItems: [
        {
          label: 'منتدى البناء',
          href: '/forum',
          icon: Users,
          description: 'منتدى مجتمع البناء'
        },
        {
          label: 'حجز الخدمات',
          href: '/dashboard/bookings',
          icon: Calendar,
          description: 'حجز خدمات البناء'
        },
        {
          label: 'الخدمات المالية',
          href: '#',
          icon: DollarSign,
          description: 'خدمات مالية للبناء',
          subItems: [
            { label: 'الخدمات المصرفية', href: '/banking', icon: DollarSign },
            { label: 'التأمين', href: '/insurance', icon: Shield },
            { label: 'القروض', href: '/loans', icon: FileText }
          ]
        }
      ]
    },
    {
      label: 'الميزات',
      href: '/features',
      icon: Sparkles,
      requiresAuth: false
    }
  ];

  const userMenuItems = [
    {
      label: 'لوحة التحكم',
      href: getDashboardRoute(),
      icon: Home
    },
    {
      label: 'الملف الشخصي',
      href: '/user/profile',
      icon: User
    },
    {
      label: 'المشاريع',
      href: '/user/projects',
      icon: Building2
    },
    {
      label: 'حجز الخدمات',
      href: '/dashboard/bookings',
      icon: Calendar
    },
    {
      label: 'المساعد الذكي',
      href: '/ai-assistant',
      icon: Bot
    },
    {
      label: 'الطلبات',
      href: '/user/orders',
      icon: Package
    },
    {
      label: 'الإعدادات',
      href: '/user/settings',
      icon: Settings
    }
  ];

  // Store-specific menu items
  const storeMenuItems = [
    {
      label: 'لوحة تحكم المتجر',
      href: '/store/dashboard',
      icon: Home
    },
    {
      label: 'المنتجات',
      href: '/store/products',
      icon: Package
    },
    {
      label: 'الطلبات',
      href: '/store/orders',
      icon: FileText
    },
    {
      label: 'العملاء',
      href: '/store/customers',
      icon: Users
    },
    {
      label: 'الإعدادات',
      href: '/store/settings',
      icon: Settings
    }
  ];
  // Helper for links to unimplemented/placeholder pages
  const handleComingSoon = (label: string) => {
    setShowComingSoon(label);
    setTimeout(() => setShowComingSoon(null), 2000);
  };

  // Custom logout function using our temp auth system
  const handleLogout = async () => {
    try {
      setLoading(true);
      console.log('🚪 [Navbar] Starting logout process...');
      
      // Call our logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ [Navbar] Logout API successful');
      } else {
        console.warn('⚠️ [Navbar] Logout API failed, continuing with client-side cleanup');
      }
      
      // Clear client-side auth state
      clearTempAuth();
      setUserData(null);
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
      
      // Redirect to login
      router.push('/auth/login');
      console.log('✅ [Navbar] Logout complete, redirecting to login');
    } catch (error) {
      console.error('❌ [Navbar] Logout error:', error);
      // Even if API fails, clear client state and redirect
      clearTempAuth();
      setUserData(null);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl sticky top-0 z-50" dir="rtl">
      {/* Toast for coming soon pages */}
      {showComingSoon && (
        <div className="fixed top-20 right-1/2 translate-x-1/2 z-50 bg-yellow-100 text-yellow-900 px-6 py-3 rounded-lg shadow-lg border border-yellow-300 animate-fade-in">
          <span className="font-bold">{showComingSoon}</span> - هذه الصفحة قيد التطوير وستتوفر قريبًا
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-between px-8 h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <EnhancedCard variant="elevated" className="p-2 px-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-md hover:scale-105 transition-transform">
            <Typography variant="heading" size="xl" weight="bold" className="text-blue-800">بِنَّا</Typography>
          </EnhancedCard>
        </Link>
        {/* Main Navigation Links */}
        <div className="flex gap-4">
          {navigationItems.map((item, idx) => (
            item.isDropdown ? (
              <div key={idx} className="relative" ref={journeyRef}>
                <button
                  onClick={() => setJourneyOpen(!journeyOpen)}
                  className="no-underline"
                >
                  <EnhancedCard variant="elevated" hover className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-blue-800 shadow-sm transition-all hover:scale-105">
                    <item.icon className="w-5 h-5 text-blue-600" />
                    <Typography variant="body" size="md" weight="medium">{item.label}</Typography>
                    <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${journeyOpen ? 'rotate-180' : ''}`} />
                  </EnhancedCard>
                </button>
                
                {journeyOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-2">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <Typography variant="heading" size="sm" weight="bold" className="text-gray-800">
                          مراحل البناء
                        </Typography>
                        <Typography variant="caption" size="xs" className="text-gray-600">
                          تتبع رحلة البناء خطوة بخطوة
                        </Typography>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {item.dropdownItems?.map((dropdownItem, dropdownIdx) => (
                          <Link
                            key={dropdownIdx}
                            href={dropdownItem.href}
                            className="block px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors no-underline"
                            onClick={() => setJourneyOpen(false)}
                          >
                            <div className={`flex items-start gap-3 ${dropdownItem.isHighlighted ? 'bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg' : ''}`}>
                              <dropdownItem.icon className={`w-5 h-5 mt-0.5 ${dropdownItem.isHighlighted ? 'text-blue-700' : 'text-blue-600'}`} />
                              <div className="flex-1">
                                <Typography variant="body" size="sm" weight="medium" className={dropdownItem.isHighlighted ? 'text-blue-800' : 'text-gray-800'}>
                                  {dropdownItem.label}
                                </Typography>
                                <Typography variant="caption" size="xs" className={dropdownItem.isHighlighted ? 'text-blue-600' : 'text-gray-600'}>
                                  {dropdownItem.description}
                                </Typography>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={idx} href={item.href} className="no-underline">
                <EnhancedCard variant="elevated" hover className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-blue-800 shadow-sm transition-all hover:scale-105">
                  <item.icon className="w-5 h-5 text-blue-600" />
                  <Typography variant="body" size="md" weight="medium">{item.label}</Typography>
                </EnhancedCard>
              </Link>
            )
          ))}
        </div>
        {/* User Panel */}
        <div className="flex items-center gap-4">
          {userData ? (
            <EnhancedCard variant="elevated" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 shadow-md">
              <User className="w-6 h-6 text-green-700" />
              <div className="text-right">
                <Typography variant="caption" size="sm" className="text-green-800 mb-0.5">{userData.name || 'المستخدم'}</Typography>
                <Typography variant="caption" size="xs" className="text-green-700">{userData.account_type === 'store' ? 'مدير متجر' : 'مستخدم'}</Typography>
              </div>
              <Button size="sm" variant="ghost" className="ml-2 text-red-600" onClick={handleLogout}>تسجيل الخروج</Button>
            </EnhancedCard>
          ) : (
            <Link href="/auth/login">
              <EnhancedCard variant="elevated" hover className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-blue-800 shadow-sm transition-all hover:scale-105">
                <User className="w-5 h-5 text-blue-600" />
                <Typography variant="body" size="md" weight="medium">تسجيل الدخول</Typography>
              </EnhancedCard>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold">بِنَّا</Link>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Cart Icon for stores */}
            {userData?.account_type === 'store' && (
              <ShoppingCart className="text-white w-5 h-5" />
            )}
            
            {/* Notifications */}
            {userData && (
              <button
                className="relative p-2"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Menu Button */}
            {userData && (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 rounded-md hover:bg-blue-700"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
        )}

        {/* Mobile Menu Sidebar */}
        <div className={`fixed right-0 top-0 h-full w-80 bg-white text-gray-900 transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
            <h2 className="text-lg font-semibold">القائمة الرئيسية</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-blue-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
            {/* User Info */}
            {userData && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-800">{userData.name || 'المستخدم'}</p>
                <p className="text-sm text-gray-600">{userData.account_type === 'store' ? 'متجر' : 'مستخدم'}</p>
              </div>
            )}

            {/* Navigation Links */}            {userData?.account_type === 'store' ? (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 mb-3">لوحة المتجر</h3>
                <Link href="/store/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Home className="w-5 h-5 text-blue-600" />
                  <span>لوحة التحكم</span>
                </Link>
                <Link href="/store/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>المنتجات</span>
                </Link>
                <Link href="/store/inventory" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>المخزون</span>
                </Link>
                <Link href="/store/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>الطلبات</span>
                </Link>
                <Link href="/store/suppliers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>الموردين</span>
                </Link>
                <Link href="/store/invoices" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>الفواتير</span>
                </Link>
                <Link href="/store/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span>التحليلات</span>
                </Link>
              </div>
            ) : userData?.account_type === 'user' || userData?.account_type === 'client' ? (
              // Removed user dashboard links from mobile sidebar to avoid duplication
              <></>
            ) : (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 mb-3">صفحات عامة</h3>
                <Link href="/projects" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>المشاريع</span>
                </Link>
                <Link href="/marketplace" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>السوق العام</span>
                </Link>
                <Link href="/stores-browse" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>تصفح المتاجر</span>
                </Link>
                <Link href="/calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span>حاسبة التكلفة</span>
                </Link>
                <Link href="/material-prices" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span>أسعار المواد</span>
                </Link>
                <Link href="/forum" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>منتدى البناء</span>
                </Link>
                <Link href="/platform-pages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>دليل المنصة</span>
                </Link>
                <Link href="/features" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>الميزات</span>
                </Link>
                <Link href="/auth/login" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <User className="w-5 h-5 text-blue-600" />
                  <span>تسجيل الدخول</span>
                </Link>
                <Link href="/auth/signup" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-100 bg-green-50" onClick={() => setIsMenuOpen(false)}>
                  <Building2 className="w-5 h-5 text-green-600" />
                  <span>إنشاء حساب</span>
                </Link>
              </div>
            )}

            {/* Construction Journey */}
            {userData?.account_type !== 'store' && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  رحلة البناء
                </h3>
                <div className="space-y-2 text-sm">
                  <Link href="/construction-journey/land-purchase" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>شراء الأرض</span>
                  </Link>
                  <Link href="/construction-journey/contractor-selection" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>اختيار المقاول</span>
                  </Link>
                  <Link href="/construction-journey/fencing" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>التسوير</span>
                  </Link>
                  <Link href="/construction-journey/excavation" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Hammer className="w-4 h-4 text-blue-600" />
                    <span>الحفر وتجهيز الأرض</span>
                  </Link>
                  <Link href="/construction-journey/insurance" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>إصدار التأمين</span>
                  </Link>
                  <Link href="/construction-journey/waste-disposal" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>مخلفات البناء</span>
                  </Link>
                  <Link href="/construction-journey/blueprint-approval" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <span>مراجعة المخططات</span>
                  </Link>
                  <Link href="/construction-journey/execution" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>التنفيذ والمتابعة</span>
                  </Link>
                  <Link href="/construction-journey/completion" className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>إنهاء المشروع</span>
                  </Link>
                  
                  {/* Highlighted Advanced Project Link */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Link href="/user/projects/create" className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-all" onClick={() => setIsMenuOpen(false)}>
                      <Building2 className="w-5 h-5 text-blue-700" />
                      <div>
                        <div className="font-semibold text-blue-800">مشروع بناء متكامل</div>
                        <div className="text-xs text-blue-600">إنشاء مشروع بناء متقدم</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Settings and Logout */}
            {userData && (
              <div className="border-t pt-4 space-y-2">
                <Link href="/user/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <User className="w-5 h-5 text-blue-600" />
                  <span>الملف الشخصي</span>
                </Link>
                <Link href="/user/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span>الإعدادات</span>
                </Link>                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full text-right disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}




