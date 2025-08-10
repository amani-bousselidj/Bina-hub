'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Shield, Calendar, Box, Tag, Clock, CreditCard, File, Settings, BarChart3, MessageCircle, Store, User as UserIcon, LogOut, Home, Folder, Mail, BookOpen, Bot } from 'lucide-react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { quickLogout } from '@/core/shared/services/logout';

interface DashboardStats {
  activeWarranties: number;
  activeProjects: number;
  totalOrders: number;
  totalInvoices: number;
}

export default function UserDashboard() {
  console.log('🚀 UserDashboard component is rendering!');
  
  const [stats, setStats] = useState<DashboardStats>({
    activeWarranties: 8,
    activeProjects: 3,
    totalOrders: 24,
    totalInvoices: 6
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    const loadUserData = async () => {
      try {
        const { user: authUser } = useAuth();
        if (authUser) {
          setUser(authUser);
        }
        
        // Simulate loading delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [isHydrated]);

  // Move all useState/useEffect hooks to the top of the UserDashboard function
  const [showAddCost, setShowAddCost] = useState(false);
  const [costForm, setCostForm] = useState({
    project: '',
    amount: '',
    store: '',
    note: ''
  });
  const [costs, setCosts] = useState<any[]>([]);
  const router = useRouter();

  const handleAddCost = () => {
    setCosts([
      ...costs,
      { ...costForm, date: new Date().toLocaleDateString() }
    ]);
    setCostForm({ project: '', amount: '', store: '', note: '' });
    setShowAddCost(false);
  };

  const handleLogout = async () => {
    await quickLogout();
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      icon: <Calendar className="w-6 h-6" />,
      href: '/user/projects/list',
      color: 'bg-blue-500',
    },
    {
      title: 'الضمانات النشطة',
      value: stats.activeWarranties,
      icon: <Shield className="w-6 h-6" />,
      href: '/user/warranties',
      color: 'bg-green-500',
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: <Box className="w-6 h-6" />,
      href: '/user/orders',
      color: 'bg-purple-500',
    },
    {
      title: 'الفواتير المستلمة',
      value: stats.totalInvoices,
      icon: <File className="w-6 h-6" />,
      href: '/user/invoices',
      color: 'bg-orange-500',
    },
  ];

  const quickActions = [
    { title: 'مركز البناء الرئيسي', href: '/user/projects/create', icon: <Calendar className="w-6 h-6" /> },
    { title: 'مشاريعي', href: '/user/projects/list', icon: <Box className="w-6 h-6" /> },
    { title: 'حاسبة التكاليف', href: '/user/projects/calculator', icon: <BarChart3 className="w-6 h-6" /> },
    { title: 'الحاسبة المتقدمة', href: '/user/calculator', icon: <BarChart3 className="w-6 h-6" /> },
    { title: 'المساعد الذكي', href: '/user/ai-assistant', icon: <Bot className="w-6 h-6" /> },
    { title: 'دليل الموردين', href: '/user/projects/suppliers', icon: <CreditCard className="w-6 h-6" /> },
    { title: 'المذكرة', href: '/user/projects/notebook', icon: <Shield className="w-6 h-6" /> },
    { title: 'الإعدادات', href: '/user/projects/settings', icon: <Settings className="w-6 h-6" /> },
  ];

  const userPanelLinks = [
    { label: 'لوحة التحكم', href: '/user/dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'مشاريعي', href: '/user/projects/list', icon: <Folder className="w-5 h-5" /> },
    { label: 'الملف الشخصي', href: '/user/profile', icon: <UserIcon className="w-5 h-5" /> },
    { label: 'الرسائل', href: '/user/messages', icon: <Mail className="w-5 h-5" /> },
    { label: 'تصفح المتاجر', href: '/stores', icon: <Store className="w-5 h-5" /> },
    { label: 'رحلة البناء', href: '/user/building-advice', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'المدفوعات', href: '/user/payments', icon: <CreditCard className="w-5 h-5" /> },
    { label: 'الإعدادات', href: '/user/settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'تسجيل الخروج', action: 'logout', icon: <LogOut className="w-5 h-5 text-red-600" />, danger: true },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Modern User Panel */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {userPanelLinks.map((item, idx) => (
              item.action === 'logout' ? (
                <button key={idx} onClick={handleLogout} className="block">
                  <EnhancedCard
                    variant="elevated"
                    hover
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105 border border-red-200 bg-red-50 hover:bg-red-100"
                  >
                    <div className="rounded-full p-2 bg-red-100">{item.icon}</div>
                    <Typography variant="caption" size="sm" className="text-center text-red-700">{item.label}</Typography>
                  </EnhancedCard>
                </button>
              ) : (
                <Link key={idx} href={item.href || '#'} className="block">
                  <EnhancedCard
                    variant="elevated"
                    hover
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${item.danger ? 'border border-red-200 bg-red-50 hover:bg-red-100' : 'bg-white/80'}`}
                  >
                    <div className={`rounded-full p-2 ${item.danger ? 'bg-red-100' : 'bg-blue-100'}`}>{item.icon}</div>
                    <Typography variant="caption" size="sm" className={`text-center ${item.danger ? 'text-red-700' : 'text-blue-800'}`}>{item.label}</Typography>
                  </EnhancedCard>
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Success Message */}
        <EnhancedCard variant="elevated" className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800 mb-1">
                تم تسجيل الدخول بنجاح!
              </Typography>
              <Typography variant="body" size="sm" className="text-green-700">
                أنت الآن في صفحة لوحة التحكم المحمية
              </Typography>
            </div>
          </div>
        </EnhancedCard>

        {/* Header */}
        <div className="mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-3">
            مرحباً، {user?.name || user?.email?.split('@')[0] || 'المستخدم'}! 👋
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            إليك نظرة عامة على حسابك ومشاريعك
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} className="block">
              <EnhancedCard variant="elevated" hover className="p-6 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">
                      {card.title}
                    </Typography>
                    <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
                      {card.value}
                    </Typography>
                  </div>
                  <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                    <div className="text-white">{card.icon}</div>
                  </div>
                </div>
              </EnhancedCard>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            إجراءات سريعة
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href} className="block">
                <EnhancedCard
                  variant="elevated"
                  hover
                  className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-blue-600">{action.icon}</div>
                  </div>
                  <Typography variant="body" size="md" weight="medium" className="text-gray-800">
                    {action.title}
                  </Typography>
                </EnhancedCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders & Invoices */}
          <EnhancedCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="subheading" size="lg" weight="semibold">الطلبات والفواتير الأخيرة</Typography>
              <Link href="/user/orders" className="text-blue-600 hover:text-blue-700 text-sm">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { id: '1', store_name: 'متجر الإلكترونيات', amount: 1500, status: 'delivered', type: 'order', invoice_number: null },
                { id: '2', store_name: 'متجر الأثاث', amount: 3200, status: 'paid', type: 'invoice', invoice_number: 'INV-001', payment_status: 'paid' },
                { id: '3', store_name: 'متجر الملابس', amount: 850, status: 'pending', type: 'order', invoice_number: null }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`p-2 rounded-full ${
                      item.type === 'invoice' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.type === 'invoice' ? (
                        <File className="w-4 h-4" />
                      ) : (
                        <Box className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">{item.store_name}</p>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.type === 'invoice' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type === 'invoice' ? 'فاتورة' : 'طلب'}
                        </span>
                        <p className="text-sm text-gray-500">
                          {item.type === 'invoice' && item.invoice_number 
                            ? `#${item.invoice_number}` 
                            : `#${item.id}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">{item.amount} ر.س</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      item.status === 'delivered' || item.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status === 'delivered' ? 'تم التسليم' : 
                       item.status === 'paid' ? 'مدفوع' : 
                       item.status === 'pending' ? 'معلق' : 'قيد المعالجة'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>

          {/* Active Projects */}
          <EnhancedCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="subheading" size="lg" weight="semibold">المشاريع النشطة</Typography>
              <Link href="/user/projects/list" className="text-blue-600 hover:text-blue-700 text-sm">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { id: '1', name: 'فيلا سكنية - حي النرجس', status: 'in_progress', progress: 65 },
                { id: '2', name: 'مكتب تجاري - الملقا', status: 'review', progress: 90 },
                { id: '3', name: 'استراحة عائلية', status: 'planning', progress: 25 }
              ].map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">
                      {project.status === 'in_progress' ? 'قيد التنفيذ' :
                       project.status === 'review' ? 'قيد المراجعة' : 'في التخطيط'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{project.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>

        {/* Recent Activity Summary */}
        <EnhancedCard variant="elevated" className="p-8">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            النشاط الأخير
          </Typography>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center ml-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <Typography variant="body" size="md" weight="medium" className="text-gray-800">
                  مرحباً بك في منصة بناء
                </Typography>
                <Typography variant="caption" size="sm" className="text-gray-600">
                  ابدأ رحلتك في إدارة مشاريع البناء
                </Typography>
              </div>
            </div>
          </div>
        </EnhancedCard>

        {/* Construction Project Costs Section */}
        <EnhancedCard variant="elevated" className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-800 mb-1">
                إدارة تكاليف المشاريع
              </Typography>
              <Typography variant="body" size="sm" className="text-blue-700">
                أضف تكاليف الشراء من المتاجر مباشرة إلى مشاريعك وتابع الإنفاق بدقة. 
                <Link href="/user/projects/list" className="underline hover:text-blue-800 ml-1">
                  أو انتقل لإدارة تكاليف المشاريع التفصيلية
                </Link>
              </Typography>
            </div>
          </div>
          <div className="mb-4">
            <Button onClick={() => setShowAddCost(true)} className="bg-blue-600 text-white rounded px-4 py-2">إضافة تكلفة جديدة</Button>
          </div>
          {showAddCost && (
            <div className="mb-4 bg-white p-4 rounded-xl border border-blue-100">
              <div className="mb-2">
                <label className="block mb-1 text-sm">المشروع</label>
                <input type="text" className="w-full border rounded px-2 py-1" value={costForm.project} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCostForm({ ...costForm, project: e.target.value })} placeholder="اسم المشروع" />
              </div>
              <div className="mb-2">
                <label className="block mb-1 text-sm">المبلغ (ر.س)</label>
                <input type="number" className="w-full border rounded px-2 py-1" value={costForm.amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCostForm({ ...costForm, amount: e.target.value })} placeholder="المبلغ" />
              </div>
              <div className="mb-2">
                <label className="block mb-1 text-sm">المتجر</label>
                <input type="text" className="w-full border rounded px-2 py-1" value={costForm.store} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCostForm({ ...costForm, store: e.target.value })} placeholder="اسم المتجر أو رابط المتجر" />
              </div>
              <div className="mb-2">
                <label className="block mb-1 text-sm">ملاحظة</label>
                <input type="text" className="w-full border rounded px-2 py-1" value={costForm.note} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCostForm({ ...costForm, note: e.target.value })} placeholder="ملاحظات إضافية (اختياري)" />
              </div>
              <Button onClick={handleAddCost} className="bg-green-600 text-white rounded px-4 py-2 mt-2">إضافة</Button>
              <Button onClick={() => setShowAddCost(false)} className="ml-2 bg-gray-200 text-gray-700 rounded px-4 py-2 mt-2">إلغاء</Button>
            </div>
          )}
          <div>
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2">المشروع</th>
                  <th className="p-2">المبلغ (ر.س)</th>
                  <th className="p-2">المتجر</th>
                  <th className="p-2">ملاحظة</th>
                  <th className="p-2">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {costs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-4 text-gray-400">لا توجد تكاليف مسجلة بعد</td></tr>
                ) : (
                  costs.map((cost, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{cost.project}</td>
                      <td className="p-2">{cost.amount}</td>
                      <td className="p-2">{cost.store}</td>
                      <td className="p-2">{cost.note}</td>
                      <td className="p-2">{cost.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </EnhancedCard>
      </div>
    </main>
  );
}



