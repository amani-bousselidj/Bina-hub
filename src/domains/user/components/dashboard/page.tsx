"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { formatNumber, formatCurrency } from '@/core/shared/utils/formatting';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { supabaseDataService } from '@/services/supabase-data-service';
import { 
  Calendar, 
  Wallet, 
  FolderOpen, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Lightbulb,
  Star, 
  Trophy, 
  Users, 
  Brain, 
  Shield, 
  Box, 
  Bot, 
  Calculator, 
  Gift,
  Crown,
  Settings,
  User as UserIcon,
  Building2,
  File,
  Trash2,
  BarChart3
} from 'lucide-react';

export const dynamic = 'force-dynamic'

interface DashboardStats {
  activeWarranties: number;
  activeProjects: number;
  completedProjects: number;
  totalOrders: number;
  totalInvoices: number;
  loyaltyPoints: number;
  currentLevel: number;
  communityPosts: number;
  monthlySpent: number;
  balanceAmount: number;
  aiInsights: number;
  recentOrders?: any[];
  recentProjects?: any[];
  recentWarranties?: any[];
}

interface QuickInsight {
  id: string;
  title: string;
  description: string;
  type: 'saving' | 'trend' | 'alert' | 'opportunity';
  impact: number;
  confidence: number;
}

interface CommunityHighlight {
  id: string;
  author: string;
  content: string;
  likes: number;
  type: 'showcase' | 'tip' | 'question';
  timeAgo: string;
}

export default function UserDashboardPage() {
  console.log('🚀 UserDashboard component is rendering!');
  
  // Use the unified user data context
  const { user, isLoading, error } = useAuth();
  const [userData, setUserData] = useState<{
    profile: any;
    orders: any[];
    warranties: any[];
    projects: any[];
    invoices: any[];
    stats: any;
  }>({
    profile: null,
    orders: [],
    warranties: [],
    projects: [],
    invoices: [],
    stats: {
      activeProjects: 0,
      totalOrders: 0,
      completedProjects: 0,
      activeWarranties: 0,
      balanceAmount: 0,
      loyaltyPoints: 0,
      monthlySpent: 0,
      aiInsights: 0,
      communityPosts: 0
    }
  });
  const [dataLoading, setDataLoading] = useState(false);

  // Calculate AI insights based on user data
  const calculateAIInsights = (profile: any, orders: any[], projects: any[], warranties: any[]) => {
    let insights = 0;
    
    // Add insights based on user activity
    if (profile?.loyalty_points > 0) insights += 1; // Has loyalty points
    if (orders?.length > 0) insights += Math.min(orders.length, 3); // Max 3 from orders
    if (projects?.length > 0) insights += Math.min(projects.length, 3); // Max 3 from projects
    if (warranties?.length > 0) insights += Math.min(warranties.length, 2); // Max 2 from warranties
    
    // Add insights based on data completeness
    if (profile?.phone) insights += 1; // Has phone
    if (profile?.city) insights += 1; // Has location
    
    return insights;
  };

  // Load user data when user is available
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      
      setDataLoading(true);
      try {
        const [profileData, ordersData, warrantiesData, projectsData, invoicesData] = await Promise.all([
          supabaseDataService.getUserProfile(user.id),
          supabaseDataService.getUserOrders(user.id),
          supabaseDataService.getUserWarranties(user.id),
          supabaseDataService.getUserProjects(user.id),
          supabaseDataService.getUserInvoices(user.id)
        ]);

        const stats = {
          activeProjects: projectsData?.filter((p: any) => p.status === 'in_progress')?.length || 0,
          totalOrders: ordersData?.length || 0,
          completedProjects: projectsData?.filter((p: any) => p.status === 'completed')?.length || 0,
          activeWarranties: warrantiesData?.filter((w: any) => w.status === 'active')?.length || 0,
          balanceAmount: profileData?.account_balance || 0,
          loyaltyPoints: profileData?.loyalty_points || 0,
          monthlySpent: ordersData?.filter((o: any) => {
            const orderDate = new Date(o.created_at);
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          }).reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0,
          communityPosts: 0, // This would come from a community_posts table
          aiInsights: calculateAIInsights(profileData, ordersData, projectsData, warrantiesData)
        };

        setUserData({
          profile: profileData,
          orders: ordersData || [],
          warranties: warrantiesData || [],
          projects: projectsData || [],
          invoices: invoicesData || [],
          stats
        });
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  const handleRefresh = () => {
    // Trigger reload by updating user dependency
    if (user?.id) {
      const loadUserData = async () => {
        setDataLoading(true);
        try {
          const [profileData, ordersData, warrantiesData, projectsData, invoicesData] = await Promise.all([
            supabaseDataService.getUserProfile(user.id),
            supabaseDataService.getUserOrders(user.id),
            supabaseDataService.getUserWarranties(user.id),
            supabaseDataService.getUserProjects(user.id),
            supabaseDataService.getUserInvoices(user.id)
          ]);

          const stats = {
            activeProjects: projectsData?.filter((p: any) => p.status === 'in_progress')?.length || 0,
            totalOrders: ordersData?.length || 0,
            completedProjects: projectsData?.filter((p: any) => p.status === 'completed')?.length || 0,
            activeWarranties: warrantiesData?.filter((w: any) => w.status === 'active')?.length || 0,
            balanceAmount: profileData?.account_balance || 0,
            aiInsights: calculateAIInsights(profileData, ordersData, projectsData, warrantiesData)
          };

          setUserData({
            profile: profileData,
            orders: ordersData || [],
            warranties: warrantiesData || [],
            projects: projectsData || [],
            invoices: invoicesData || [],
            stats
          });
        } catch (err) {
          console.error('Error loading user data:', err);
        } finally {
          setDataLoading(false);
        }
      };
      loadUserData();
    }
  };

  const { profile, orders, warranties, projects, invoices, stats } = userData;
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [showAddCost, setShowAddCost] = useState(false);
  const [costForm, setCostForm] = useState({
    project: '',
    amount: '',
    store: '',
    note: ''
  });
  const [costs, setCosts] = useState<any[]>([]);
  const [quickInsights, setQuickInsights] = useState<QuickInsight[]>([]);
  const [communityHighlights, setCommunityHighlights] = useState<CommunityHighlight[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Generate insights based on user data
  useEffect(() => {
    if (!profile || !stats) return;

    const insights: QuickInsight[] = [];
    
    if (stats.activeProjects > 0) {
      insights.push({
        id: 'INS001',
        title: 'توفير في تكاليف المشروع',
        description: `يمكنك توفير حتى 15% من تكاليف مشاريعك الـ ${stats.activeProjects} النشطة`,
        type: 'saving',
        impact: stats.activeProjects * (stats.monthlySpent / stats.activeProjects || 1000),
        confidence: 85
      });
    }
    
    if (stats.totalOrders > 5) {
      insights.push({
        id: 'INS002',
        title: 'خصم ولاء متاح',
        description: `مع ${stats.totalOrders} طلب، أصبحت مؤهلاً لخصم 10% على الطلب القادم`,
        type: 'opportunity',
        impact: 0,
        confidence: 95
      });
    }
    
    if (insights.length === 0) {
      insights.push({
        id: 'INS001',
        title: 'ابدأ مشروعك الأول',
        description: 'استخدم حاسبة البناء الذكية لتقدير تكاليف مشروعك',
        type: 'opportunity',
        impact: 0,
        confidence: 100
      });
    }
    
    setQuickInsights(insights);

    // Generate community highlights
    const highlights: CommunityHighlight[] = [];
    
    if (stats.completedProjects > 0) {
      highlights.push({
        id: 'COM001',
        author: profile.name || 'مستخدم',
        content: `تم إكمال ${stats.completedProjects} مشروع بنجاح باستخدام منصة بِنّا`,
        likes: Math.max(stats.completedProjects * 8, 5),
        type: 'showcase',
        timeAgo: 'منذ يوم'
      });
    }
    
    if (stats.activeWarranties > 0) {
      highlights.push({
        id: 'COM002',
        author: 'نصائح بِنّا',
        content: `لديك ${stats.activeWarranties} ضمان نشط - تأكد من متابعة صلاحيتها`,
        likes: 25,
        type: 'tip',
        timeAgo: 'منذ 3 ساعات'
      });
    }
    
    if (highlights.length === 0) {
      highlights.push({
        id: 'COM001',
        author: 'مجتمع بِنّا',
        content: 'مرحباً بك في منصة بِنّا للبناء الذكي! ابدأ رحلتك معنا',
        likes: 50,
        type: 'tip',
        timeAgo: 'منذ يوم'
      });
    }
    
    setCommunityHighlights(highlights);
  }, [profile, stats]);

  const handleAddCost = () => {
    setCosts([
      ...costs,
      { ...costForm, date: new Date().toLocaleDateString() }
    ]);
    setCostForm({ project: '', amount: '', store: '', note: '' });
    setShowAddCost(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'نقاط الولاء',
      value: formatNumber(userData.profile?.loyalty_points || 0),
      subtitle: `مستوى ${Math.floor((userData.profile?.loyalty_points || 0) / 1000) + 1}`,
      icon: <Trophy className="w-6 h-6" />,
      href: '/user/gamification',
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600'
    },
    {
      title: 'الرصيد المتاح',
      value: formatCurrency(userData.stats.balanceAmount),
      subtitle: 'جاهز للاستخدام',
      icon: <Wallet className="w-6 h-6" />,
      href: '/user/balance',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'الرؤى الذكية',
      value: formatNumber(userData.stats.aiInsights),
      subtitle: 'توصية جديدة',
      icon: <Brain className="w-6 h-6" />,
      href: '/user/smart-insights',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'المجتمع',
      value: formatNumber(userData.stats.communityPosts),
      subtitle: 'منشورات هذا الشهر',
      icon: <Users className="w-6 h-6" />,
      href: '/user/social-community',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'المشاريع النشطة',
      value: formatNumber(userData.stats.activeProjects),
      subtitle: 'قيد التنفيذ',
      icon: <Calendar className="w-6 h-6" />,
      href: '/user/projects/list',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600'
    },
    {
      title: 'الضمانات النشطة',
      value: formatNumber(userData.stats.activeWarranties),
      subtitle: 'سارية المفعول',
      icon: <Shield className="w-6 h-6" />,
      href: '/user/warranties',
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      textColor: 'text-teal-600'
    },
    {
      title: 'إجمالي الطلبات',
      value: formatNumber(userData.stats.totalOrders),
      subtitle: 'طلب مكتمل',
      icon: <Box className="w-6 h-6" />,
      href: '/user/orders',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-orange-600'
    },
    {
      title: 'الإنفاق الشهري',
      value: formatCurrency(userData.stats.monthlySpent),
      subtitle: 'هذا الشهر',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/user/expenses',
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-red-600'
    }
  ];

  const quickActions = [
    { title: 'حجز الخدمات', href: '/dashboard/bookings', icon: <Calendar className="w-6 h-6" />, color: 'from-blue-50 to-blue-100', textColor: 'text-blue-700' },
    { title: 'مركز الذكاء الاصطناعي', href: '/user/ai-hub', icon: <Brain className="w-6 h-6" />, color: 'from-purple-50 to-purple-100', textColor: 'text-purple-700' },
    { title: 'حاسبة البناء الشاملة', href: '/user/comprehensive-construction-calculator', icon: <Calculator className="w-6 h-6" />, color: 'from-blue-50 to-blue-100', textColor: 'text-blue-700' },
    { title: 'مركز المكافآت', href: '/user/gamification', icon: <Gift className="w-6 h-6" />, color: 'from-yellow-50 to-yellow-100', textColor: 'text-yellow-700' },
    { title: 'إدارة الرصيد', href: '/user/balance', icon: <Wallet className="w-6 h-6" />, color: 'from-green-50 to-green-100', textColor: 'text-green-700' },
    { title: 'مجتمع البناء', href: '/user/social-community', icon: <Users className="w-6 h-6" />, color: 'from-indigo-50 to-indigo-100', textColor: 'text-indigo-700' },
    { title: 'إدارة المشاريع', href: '/user/projects/list', icon: <Building2 className="w-6 h-6" />, color: 'from-emerald-50 to-emerald-100', textColor: 'text-emerald-700' },
    { title: 'إدارة الضمانات', href: '/user/warranties', icon: <Shield className="w-6 h-6" />, color: 'from-teal-50 to-teal-100', textColor: 'text-teal-700' },
    { title: 'خطط الاشتراك', href: '/user/subscriptions', icon: <Crown className="w-6 h-6" />, color: 'from-rose-50 to-rose-100', textColor: 'text-rose-700' },
    { title: 'إعدادات الحساب', href: '/user/settings', icon: <Settings className="w-6 h-6" />, color: 'from-gray-50 to-gray-100', textColor: 'text-gray-700' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal" dir="rtl" style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', sans-serif" }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-3">
            مرحباً، {user?.name || user?.email?.split('@')[0] || 'المستخدم'}! 👋
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            إليك نظرة عامة على حسابك ومشاريعك
          </Typography>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href}>
              <EnhancedCard
                variant="elevated"
                hover
                className="group cursor-pointer transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body" size="sm" className="text-gray-600 mb-1">
                      {card.title}
                    </Typography>
                    <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
                      {card.value}
                    </Typography>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                </div>
              </EnhancedCard>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <EnhancedCard variant="elevated" className="mb-8 bg-white/80 backdrop-blur-sm">
          <div className="mb-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
              الإجراءات السريعة ⚡
            </Typography>
            <Typography variant="body" size="sm" className="text-gray-600">
              الوصول السريع لأهم الأدوات والميزات
            </Typography>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="group flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 border border-blue-100">
                  <div className="mb-3 p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                    {action.icon}
                  </div>
                  <Typography variant="caption" size="sm" className="text-blue-800 group-hover:text-blue-900">
                    {action.title}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>
        </EnhancedCard>

        {/* Community Highlights & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Community Highlights */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                أبرز المجتمع 👥
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                احدث الأنشطة والإحصائيات
              </Typography>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الأعضاء النشطون</span>
                <span className="text-lg font-bold text-indigo-600">{formatNumber(stats.communityPosts)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">مشاريع مشتركة</span>
                <span className="text-lg font-bold text-blue-600">{formatNumber(stats.activeProjects + stats.completedProjects)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">نصائح هذا الأسبوع</span>
                <span className="text-lg font-bold text-green-600">{formatNumber(quickInsights.length)}</span>
              </div>
              <div className="border-t pt-4">
                <Link href="/user/social-community" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  انضم للمحادثة ←
                </Link>
              </div>
            </div>
          </EnhancedCard>

          {/* AI Features Hub */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                مركز الذكاء الاصطناعي �
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                أدوات ذكية لمساعدتك في مشاريعك
              </Typography>
            </div>
            
            {/* Quick AI Tools */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link href="/user/comprehensive-construction-calculator">
                <div className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <Typography variant="caption" size="sm" weight="medium" className="text-blue-800">حاسبة شاملة</Typography>
                  </div>
                  <Typography variant="caption" size="xs" className="text-blue-600">حساب تكاليف دقيقة</Typography>
                </div>
              </Link>
              
              <Link href="/ai-assistant">
                <div className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-green-600" />
                    <Typography variant="caption" size="sm" weight="medium" className="text-green-800">مساعد ذكي متقدم</Typography>
                  </div>
                  <Typography variant="caption" size="xs" className="text-green-600">إجابات ذكية ونصائح مخصصة</Typography>
                </div>
              </Link>
              
              <Link href="/user/smart-construction-advisor">
                <div className="bg-orange-50 rounded-lg p-3 hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <Typography variant="caption" size="sm" weight="medium" className="text-orange-800">مستشار ذكي</Typography>
                  </div>
                  <Typography variant="caption" size="xs" className="text-orange-600">نصائح مخصصة</Typography>
                </div>
              </Link>
              
              <Link href="/user/smart-insights">
                <div className="bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <Typography variant="caption" size="sm" weight="medium" className="text-purple-800">رؤى ذكية</Typography>
                  </div>
                  <Typography variant="caption" size="xs" className="text-purple-600">تحليلات متقدمة</Typography>
                </div>
              </Link>
            </div>
            
            {/* AI Insights */}
            <div className="space-y-3 mb-4">
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">⚠️ تحسين الميزات الذكية</p>
                    <p className="text-xs text-yellow-700">نعمل على تحسين دقة وفعالية الأدوات الذكية</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">توفير محتمل</p>
                    <p className="text-xs text-blue-600">استخدم الحاسبة الشاملة لتوفير 15% من التكاليف</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-3 border-t">
              <Link href="/user/ai-hub" className="flex-1">
                <Button variant="outline" className="w-full text-purple-600 border-purple-300 hover:bg-purple-50 text-sm py-2" onClick={() => alert('Button clicked')}>
                  مركز الذكاء الاصطناعي
                </Button>
              </Link>
              <Link href="/user/ai-smart-features-test" className="flex-1">
                <Button variant="outline" className="w-full text-orange-600 border-orange-300 hover:bg-orange-50 text-sm py-2" onClick={() => alert('Button clicked')}>
                  اختبار الميزات
                </Button>
              </Link>
            </div>
          </EnhancedCard>

          {/* Gamification Progress */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                مركز المكافآت 🏆
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                تقدمك ومكافآتك
              </Typography>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <Typography variant="body" weight="bold" className="text-gray-800">
                  {userData.profile?.loyalty_points >= 5000 ? 'المستوى الماسي' : 
                   userData.profile?.loyalty_points >= 2500 ? 'المستوى الذهبي' : 
                   userData.profile?.loyalty_points >= 1000 ? 'المستوى الفضي' : 'المستوى البرونزي'}
                </Typography>
                <Typography variant="caption" size="sm" className="text-gray-600">
                  {formatNumber(userData.profile?.loyalty_points || 0)} نقطة
                </Typography>
              </div>
              {/* Progress bar to next level */}
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, ((userData.profile?.loyalty_points || 0) % 1000) / 10)}%` 
                  }}
                ></div>
              </div>
              <div className="text-center">
                <Typography variant="caption" size="xs" className="text-gray-600">
                  {1000 - ((userData.profile?.loyalty_points || 0) % 1000)} نقطة للمستوى التالي
                </Typography>
              </div>
              <div className="border-t pt-4">
                <Link href="/user/gamification" className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  عرض المكافآت ←
                </Link>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Cost Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Add Cost Form */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
                إدارة التكاليف 💰
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                أضف وتتبع تكاليف مشاريعك
              </Typography>
            </div>
            
            {!showAddCost ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowAddCost(true)}
                className="w-full"
              >
                <Box className="w-5 h-5 ml-2" />
                إضافة تكلفة جديدة
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المشروع</label>
                  <input
                    type="text"
                    value={costForm.project}
                    onChange={(e) => setCostForm(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المشروع"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ريال)</label>
                  <input
                    type="number"
                    value={costForm.amount}
                    onChange={(e) => setCostForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المتجر</label>
                  <input
                    type="text"
                    value={costForm.store}
                    onChange={(e) => setCostForm(prev => ({ ...prev, store: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المتجر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة</label>
                  <textarea
                    value={costForm.note}
                    onChange={(e) => setCostForm(prev => ({ ...prev, note: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="ملاحظات إضافية..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handleAddCost}
                    className="flex-1"
                  >
                    حفظ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCost(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </EnhancedCard>

          {/* Recent Costs */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
                التكاليف الأخيرة 📊
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                نظرة على آخر التكاليف المضافة
              </Typography>
            </div>
            
            {costs.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Typography variant="body" size="sm" className="text-gray-500">
                  لا توجد تكاليف مضافة بعد
                </Typography>
              </div>
            ) : (
              <div className="space-y-3">
                {costs.map((cost, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <Typography variant="body" weight="medium" className="text-gray-800">
                          {cost.project}
                        </Typography>
                        <Typography variant="caption" size="sm" className="text-gray-600">
                          {cost.store} • {cost.date}
                        </Typography>
                      </div>
                      <Typography variant="body" weight="semibold" className="text-green-600">
                        {cost.amount} ريال
                      </Typography>
                    </div>
                    {cost.note && (
                      <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                        {cost.note}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            )}
          </EnhancedCard>
        </div>

        {/* Recent Activity */}
        <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
          <div className="mb-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
              النشاط الأخير 🕐
            </Typography>
            <Typography variant="body" size="sm" className="text-gray-600">
              تتبع آخر الأنشطة والتحديثات
            </Typography>
          </div>
          
          <div className="space-y-4">
            {[
              { action: 'تم إنشاء مشروع جديد', time: 'قبل ساعتين', icon: <Calendar className="w-4 h-4" /> },
              { action: 'تم تحديث الملف الشخصي', time: 'قبل 3 ساعات', icon: <UserIcon className="w-4 h-4" /> },
              { action: 'تم استلام فاتورة جديدة', time: 'قبل يوم واحد', icon: <File className="w-4 h-4" /> },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <Typography variant="body" size="sm" className="text-gray-800">
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" size="xs" className="text-gray-500">
                    {activity.time}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
    </main>
  );
}
