'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Shield, 
  ShoppingCart, 
  FileText, 
  CreditCard,
  Calendar,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  activeProjects: number;
  activeWarranties: number;
  totalOrders: number;
  totalInvoices: number;
  pendingPayments: number;
  upcomingAppointments: number;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  href, 
  color = 'bg-blue-500',
  description 
}: {
  title: string;
  value: number;
  icon: any;
  href: string;
  color?: string;
  description?: string;
}) => (
  <Link href={href} className="block">
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </Link>
);

const QuickAction = ({ 
  title, 
  href, 
  icon: Icon, 
  color = 'bg-gray-100' 
}: {
  title: string;
  href: string;
  icon: any;
  color?: string;
}) => (
  <Link href={href} className="block">
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <span className="text-sm font-medium text-gray-900">{title}</span>
      </div>
    </div>
  </Link>
);

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 3,
    activeWarranties: 8,
    totalOrders: 24,
    totalInvoices: 6,
    pendingPayments: 2,
    upcomingAppointments: 4
  });

  const [recentActivity] = useState([
    {
      id: 1,
      title: 'تم إنشاء مشروع جديد',
      description: 'مشروع تطوير المطبخ',
      time: 'منذ ساعتين',
      type: 'project',
      status: 'success'
    },
    {
      id: 2,
      title: 'فاتورة جديدة',
      description: 'فاتورة #INV-001',
      time: 'منذ 3 ساعات',
      type: 'invoice',
      status: 'warning'
    },
    {
      id: 3,
      title: 'موعد قادم',
      description: 'استشارة مع المهندس أحمد',
      time: 'غداً الساعة 10:00 ص',
      type: 'appointment',
      status: 'info'
    }
  ]);

  const dashboardCards = [
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      icon: FolderOpen,
      href: '/user/projects/active',
      color: 'bg-blue-500',
      description: '2 قيد التنفيذ'
    },
    {
      title: 'الضمانات النشطة',
      value: stats.activeWarranties,
      icon: Shield,
      href: '/user/warranties/active',
      color: 'bg-green-500',
      description: '3 تنتهي قريباً'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: ShoppingCart,
      href: '/user/orders',
      color: 'bg-purple-500',
      description: '5 قيد التسليم'
    },
    {
      title: 'الفواتير',
      value: stats.totalInvoices,
      icon: FileText,
      href: '/user/invoices',
      color: 'bg-orange-500',
      description: '1 مستحقة الدفع'
    },
    {
      title: 'المدفوعات المعلقة',
      value: stats.pendingPayments,
      icon: CreditCard,
      href: '/user/payments',
      color: 'bg-red-500',
      description: 'تحتاج متابعة'
    },
    {
      title: 'المواعيد القادمة',
      value: stats.upcomingAppointments,
      icon: Calendar,
      href: '/user/appointments',
      color: 'bg-teal-500',
      description: 'هذا الأسبوع'
    }
  ];

  const quickActions = [
    { title: 'مشروع جديد', href: '/user/projects/create', icon: FolderOpen, color: 'bg-blue-100' },
    { title: 'طلب منتج', href: '/user/products', icon: Package, color: 'bg-green-100' },
    { title: 'حجز موعد', href: '/user/appointments/new', icon: Calendar, color: 'bg-purple-100' },
    { title: 'دعم فني', href: '/user/support', icon: AlertCircle, color: 'bg-orange-100' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم! 👋</h1>
        <p className="text-blue-100">إدارة مشاريعك وطلباتك بسهولة من مكان واحد</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            href={card.href}
            color={card.color}
            description={card.description}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              href={action.href}
              icon={action.icon}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 rtl:space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                activity.status === 'success' ? 'bg-green-100' :
                activity.status === 'warning' ? 'bg-orange-100' :
                'bg-blue-100'
              }`}>
                {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {activity.status === 'warning' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                {activity.status === 'info' && <Clock className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الأداء هذا الشهر</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">المشاريع المكتملة</span>
              <span className="text-sm font-medium text-gray-900">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">رضا العملاء</h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">4.8</span>
            <span className="text-sm text-gray-500">من 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
