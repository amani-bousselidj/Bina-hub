"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Crown, Star, Gift, Zap, Shield, TrendingUp, CheckCircle, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  duration: string;
  durationAr: string;
  features: string[];
  featuresAr: string[];
  popular?: boolean;
  current?: boolean;
  color: string;
  icon: React.ReactNode;
}

interface SubscriptionHistory {
  id: string;
  plan: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'active' | 'expired' | 'cancelled';
}

export default function SubscriptionsPage() {
  const { user, session, isLoading, error } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      nameAr: 'مجاني',
      price: 0,
      duration: 'Forever',
      durationAr: 'مدى الحياة',
      features: [
        'Browse products',
        'Basic calculator',
        'Email support'
      ],
      featuresAr: [
        'تصفح المنتجات',
        'حاسبة أساسية',
        'دعم بريد إلكتروني'
      ],
      color: 'gray',
      icon: <Shield className="w-6 h-6" />,
      current: currentPlan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      nameAr: 'احترافي',
      price: billingCycle === 'monthly' ? 99 : 990,
      duration: billingCycle === 'monthly' ? 'per month' : 'per year',
      durationAr: billingCycle === 'monthly' ? 'شهرياً' : 'سنوياً',
      features: [
        'Everything in Free',
        'Advanced calculator',
        'Priority support',
        'Project management',
        'Export reports'
      ],
      featuresAr: [
        'جميع مميزات المجاني',
        'حاسبة متقدمة',
        'دعم أولوية',
        'إدارة المشاريع',
        'تصدير التقارير'
      ],
      popular: true,
      color: 'blue',
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'premium',
      name: 'Premium',
      nameAr: 'مميز',
      price: billingCycle === 'monthly' ? 199 : 1990,
      duration: billingCycle === 'monthly' ? 'per month' : 'per year',
      durationAr: billingCycle === 'monthly' ? 'شهرياً' : 'سنوياً',
      features: [
        'Everything in Pro',
        'AI Assistant',
        'Bulk discounts',
        'Custom integrations',
        'Dedicated manager',
        'White-label options'
      ],
      featuresAr: [
        'جميع مميزات الاحترافي',
        'مساعد ذكي',
        'خصومات كمية',
        'تكاملات مخصصة',
        'مدير مخصص',
        'خيارات العلامة البيضاء'
      ],
      color: 'purple',
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const [subscriptionHistory] = useState<SubscriptionHistory[]>([
    {
      id: 'SUB001',
      plan: 'Pro Monthly',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      amount: 297,
      status: 'expired'
    },
    {
      id: 'SUB002',
      plan: 'Free Plan',
      startDate: '2024-04-16',
      endDate: '2024-12-31',
      amount: 0,
      status: 'active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'نشط';
      case 'expired': return 'منتهي';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  const getPlanColor = (color: string) => {
    switch(color) {
      case 'blue': return 'border-blue-300 bg-blue-50';
      case 'purple': return 'border-purple-300 bg-purple-50';
      case 'gray': return 'border-gray-300 bg-gray-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPlanButtonColor = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-700';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      case 'gray': return 'bg-gray-600 hover:bg-gray-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const handleSubscribe = (planId: string) => {
    // Handle subscription logic
    console.log(`Subscribing to plan: ${planId}`);
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

return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Crown className="w-8 h-8 text-purple-600" />
          خطط الاشتراك
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          اختر الخطة المناسبة لاحتياجاتك واستفد من مميزات حصرية
        </Typography>
      </div>

      {/* Current Plan Status */}
      <EnhancedCard className="p-6 mb-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="subheading" size="xl" weight="semibold" className="text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              خطتك الحالية: مجاني
            </Typography>
            <Typography variant="body" size="lg" className="text-green-700">
              استمتع بالمميزات الأساسية مجاناً أو قم بالترقية للحصول على مميزات أكثر
            </Typography>
          </div>
          <div className="text-left">
            <Typography variant="subheading" size="2xl" weight="bold" className="text-green-800">
              0 ر.س
            </Typography>
            <Typography variant="caption" size="sm" className="text-green-600">
              مدى الحياة
            </Typography>
          </div>
        </div>
      </EnhancedCard>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <Button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            شهري
          </Button>
          <Button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            سنوي
            <span className="mr-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              وفر 20%
            </span>
          </Button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {subscriptionPlans.map((plan) => (
          <EnhancedCard
            key={plan.id}
            className={`p-6 relative ${getPlanColor(plan.color)} ${
              plan.popular ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  الأكثر شعبية
                </span>
              </div>
            )}

            {plan.current && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  الحالية
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {plan.icon}
              </div>
              
              <Typography variant="subheading" size="2xl" weight="bold" className="text-gray-900 mb-2">
                {plan.nameAr}
              </Typography>
              
              <div className="mb-4">
                <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900">
                  {plan.price.toLocaleString('en-US')}
                  <span className="text-sm font-normal text-gray-600 mr-1">ر.س</span>
                </Typography>
                <Typography variant="caption" size="sm" className="text-gray-600">
                  {plan.durationAr}
                </Typography>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.featuresAr.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <Typography variant="caption" size="sm" className="text-gray-700">
                    {feature}
                  </Typography>
                </div>
              ))}
            </div>

            <Button
              onClick={() => handleSubscribe(plan.id)}
              disabled={plan.current}
              className={`w-full text-white ${
                plan.current
                  ? 'bg-gray-400 cursor-not-allowed'
                  : getPlanButtonColor(plan.color)
              }`}
            >
              {plan.current ? 'الخطة الحالية' : 'اختر هذه الخطة'}
            </Button>
          </EnhancedCard>
        ))}
      </div>

      {/* Features Comparison */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">مقارنة المميزات</Typography>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4">المميزة</th>
                <th className="text-center py-3 px-4">مجاني</th>
                <th className="text-center py-3 px-4">احترافي</th>
                <th className="text-center py-3 px-4">مميز</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">تصفح المنتجات</td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">حاسبة التكاليف</td>
                <td className="text-center py-3 px-4 text-gray-400">أساسية</td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">المساعد الذكي</td>
                <td className="text-center py-3 px-4 text-gray-400">-</td>
                <td className="text-center py-3 px-4 text-gray-400">محدود</td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">إدارة المشاريع</td>
                <td className="text-center py-3 px-4 text-gray-400">-</td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">الدعم الفني</td>
                <td className="text-center py-3 px-4 text-gray-400">بريد إلكتروني</td>
                <td className="text-center py-3 px-4 text-gray-400">أولوية</td>
                <td className="text-center py-3 px-4 text-gray-400">مدير مخصص</td>
              </tr>
            </tbody>
          </table>
        </div>
      </EnhancedCard>

      {/* Subscription History */}
      <div className="mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">تاريخ الاشتراكات</Typography>
        
        {subscriptionHistory.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
              لا يوجد تاريخ اشتراكات
            </Typography>
            <Typography variant="body" size="lg" className="text-gray-500">
              ستظهر جميع اشتراكاتك السابقة والحالية هنا
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptionHistory.map((subscription) => (
              <EnhancedCard key={subscription.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Crown className="w-5 h-5 text-purple-600" />
                    </div>
                    
                    <div>
                      <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-1">
                        {subscription.plan}
                      </Typography>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>من {new Date(subscription.startDate).toLocaleDateString('en-US')}</span>
                        <span>إلى {new Date(subscription.endDate).toLocaleDateString('en-US')}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(subscription.status)}`}>
                          {getStatusText(subscription.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <Typography variant="subheading" size="lg" weight="bold" className="text-gray-900">
                      {subscription.amount.toLocaleString('en-US')} ر.س
                    </Typography>
                  </div>
                </div>
              </EnhancedCard>
            ))}
          </div>
        )}
      </div>

      {/* Special Offers */}
      <EnhancedCard className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-purple-800">
            عروض خاصة
          </Typography>
        </div>
        
        <Typography variant="body" size="lg" className="text-purple-700 mb-4">
          احصل على خصم 30% على الاشتراك السنوي لفترة محدودة!
        </Typography>
        
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => alert('Button clicked')}>
          استفد من العرض
        </Button>
      </EnhancedCard>

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-purple-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-purple-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}

