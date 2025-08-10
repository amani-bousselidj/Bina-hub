'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Badge } from '@/components/ui';
import { ClientIcon, type IconKey } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '@/core/shared/auth/AuthProvider';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


// Placeholder for construction dashboard stats type
interface ConstructionDashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalInvestment: number;
  monthlySpent: number;
  totalExpenses: number;
  monthlySpending: number;
  recentProjects: Array<{ id: number; name: string; status: string }>;
  recentExpenses: Array<{ id: number; category: string; amount: number }>;
}

export default function ConstructionDataDashboard() {
  const { user, session, isLoading, error } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<ConstructionDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [cookieInfo, setCookieInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setLocalError(null);
        const cookies = document.cookie.split(';').map((c) => c.trim());
        setCookieInfo(cookies);
        
        // Try to get user from sessionStorage (our temporary auth)
        const userData = sessionStorage.getItem('temp_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('✅ [Construction Data] Found temp user:', parsedUser);
          setUserData(parsedUser);
        } else {
          // Try cookie auth as fallback
          const tempAuthCookie = document.cookie
            .split(';')
            .find(row => row.startsWith('temp_auth_user='));
          
          if (tempAuthCookie) {
            const cookieValue = tempAuthCookie.split('=')[1];
            const cookieUser = JSON.parse(decodeURIComponent(cookieValue));
            console.log('✅ [Construction Data] Found cookie user:', cookieUser);
            setUserData(cookieUser);
          } else {
            setLocalError('Authentication session not found');
            setTimeout(() => router.push('/auth/login'), 2000);
            return;
          }
        }
        
        // TODO: Replace with real API call for construction dashboard stats
        setStats({
          totalProjects: 3,
          activeProjects: 2,
          completedProjects: 1,
          totalInvestment: 120000,
          totalExpenses: 120000,
          monthlySpent: 15000,
          monthlySpending: 15000,
          recentProjects: [
            { id: 1, name: 'مشروع فيلا سكنية', status: 'active' },
            { id: 2, name: 'مشروع تجاري', status: 'completed' }
          ],
          recentExpenses: [
            { id: 1, category: 'خرسانة', amount: 5000 },
            { id: 2, category: 'كهرباء', amount: 2000 }
          ]
        });
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : 'Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [isHydrated, router]);

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'إجمالي المشاريع',
      value: (stats?.activeProjects || 0) + (stats?.completedProjects || 0),
      icon: 'dashboard' as IconKey,
      color: 'bg-blue-500',
    },
    {
      title: 'المشاريع النشطة',
      value: stats?.activeProjects || 0,
      icon: 'settings' as IconKey,
      color: 'bg-green-500',
    },
    {
      title: 'المشاريع المكتملة',
      value: stats?.completedProjects || 0,
      icon: 'shield' as IconKey,
      color: 'bg-purple-500',
    },
    {
      title: 'إجمالي المصروفات',
      value: `${(stats?.monthlySpent || 0).toLocaleString('en-US')} ريال`,
      icon: 'money' as IconKey,
      color: 'bg-orange-500',
    },
    {
      title: 'الإنفاق الشهري',
      value: `${(stats?.monthlySpent || 0).toLocaleString('en-US')} ريال`,
      icon: 'chart' as IconKey,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        <EnhancedCard variant="elevated" className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ClientIcon type="dashboard" size={20} className="text-green-600" />
            </div>
            <div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800 mb-1">
                تم تسجيل الدخول بنجاح!
              </Typography>
              <Typography variant="body" size="sm" className="text-green-700">
                أنت الآن في صفحة بيانات المشاريع والإنشاءات
              </Typography>
            </div>
          </div>
        </EnhancedCard>

        <div className="mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-3">
            مرحباً، {user?.name || user?.email?.split('@')[0] || 'المستخدم'}! 🏗️
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            إليك نظرة عامة على مشاريعك ومصروفاتك
          </Typography>
        </div>

        <div className="mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? 'إخفاء معلومات التصحيح' : 'عرض معلومات التصحيح'}
          </Button>

          {showDebug && (
            <EnhancedCard variant="outlined" className="mt-4">
              <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">
                معلومات الكوكيز والجلسة:
              </Typography>
              <div className="mb-4">
                <Typography variant="label" size="sm" className="mb-2">
                  الكوكيز المتوفرة في المتصفح:
                </Typography>
                <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono max-h-40 overflow-y-auto">
                  {cookieInfo.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {cookieInfo.map((cookie, idx) => (
                        <li key={idx}>{cookie}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body" size="sm" className="text-red-500">
                      لا توجد كوكيز
                    </Typography>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Typography variant="label" size="sm" className="mb-2">
                  معلومات HTTP Header:
                </Typography>
                <div className="text-xs font-mono overflow-x-auto max-h-40">
                  <pre>{headerInfo ? JSON.stringify(headerInfo, null, 2) : 'جاري التحميل...'}</pre>
                </div>
              </div>
            </EnhancedCard>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div key={index} className="block">
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
                    <ClientIcon type={card.icon} size={24} className="text-white" />
                  </div>
                </div>
              </EnhancedCard>
            </div>
          ))}
        </div>

        <EnhancedCard variant="elevated" className="p-8 mb-8">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            المشاريع الأخيرة
          </Typography>
          <div className="space-y-4">
            {(!stats?.recentProjects || stats.recentProjects.length === 0) ? (
              <div className="text-gray-500">لا توجد مشاريع حديثة</div>
            ) : (
              stats.recentProjects.map((project) => (
                <div key={project.id} className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center ml-4">
                    <ClientIcon type="design" size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="body" size="md" weight="medium" className="text-gray-800">
                      {project.name}
                    </Typography>
                    <Badge variant={project.status === 'active' ? 'success' : 'neutral'} size="sm">
                      {project.status === 'active' ? 'نشط' : 'مكتمل'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" className="p-8">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            المصروفات الأخيرة
          </Typography>
          <div className="space-y-4">
            {(!stats?.recentExpenses || stats.recentExpenses.length === 0) ? (
              <div className="text-gray-500">لا توجد مصروفات حديثة</div>
            ) : (
              stats.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center ml-4">
                    <ClientIcon type="money" size={20} className="text-green-600" />
                  </div>
                  <div>
                    <Typography variant="body" size="md" weight="medium" className="text-gray-800">
                      {expense.category}
                    </Typography>
                    <Typography variant="caption" size="sm" className="text-gray-600">
                      {expense.amount.toLocaleString('en-US')} ريال
                    </Typography>
                  </div>
                </div>
              ))
            )}
          </div>
        </EnhancedCard>
      </div>
    </main>
  );
}






