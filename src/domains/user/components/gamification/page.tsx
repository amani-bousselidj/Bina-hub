"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { 
  Trophy, Star, Award, Crown, Gift, Target, Zap, Flame, 
  Medal, ShoppingBag, TrendingUp, Calendar, Users, Sparkles,
  CheckCircle, Lock, ArrowRight, Timer, Coins
} from 'lucide-react';

export const dynamic = 'force-dynamic'

interface Achievement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'purchases' | 'engagement' | 'referrals' | 'loyalty' | 'special';
}

interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  totalSpent: number;
  projectsCompleted: number;
  referrals: number;
  daysActive: number;
  rank: string;
  rankAr: string;
}

interface Reward {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  pointsCost: number;
  originalPrice?: number;
  discountPercent?: number;
  category: 'discounts' | 'services' | 'products' | 'exclusive';
  available: boolean;
  limited?: boolean;
  timeLeft?: string;
}

export default function GamificationPage() {
  const { user, session, isLoading, error } = useAuth();
  const [userStats] = useState<UserStats>({
    totalPoints: 12450,
    level: 8,
    nextLevelPoints: 15000,
    totalSpent: 45000,
    projectsCompleted: 12,
    referrals: 5,
    daysActive: 120,
    rank: 'Gold Constructor',
    rankAr: 'مقاول ذهبي'
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: 'ACH001',
      title: 'First Purchase',
      titleAr: 'أول عملية شراء',
      description: 'Complete your first order',
      descriptionAr: 'أكمل أول طلبية لك',
      icon: <ShoppingBag className="w-6 h-6" />,
      points: 100,
      unlocked: true,
      category: 'purchases'
    },
    {
      id: 'ACH002',
      title: 'Big Spender',
      titleAr: 'المشتري الكبير',
      description: 'Spend over 50,000 SAR',
      descriptionAr: 'اشتري بقيمة تزيد عن 50,000 ريال',
      icon: <Crown className="w-6 h-6" />,
      points: 1000,
      unlocked: false,
      progress: 45000,
      maxProgress: 50000,
      category: 'purchases'
    },
    {
      id: 'ACH003',
      title: 'Project Master',
      titleAr: 'خبير المشاريع',
      description: 'Complete 10 construction projects',
      descriptionAr: 'أكمل 10 مشاريع بناء',
      icon: <Award className="w-6 h-6" />,
      points: 500,
      unlocked: true,
      category: 'engagement'
    },
    {
      id: 'ACH004',
      title: 'Social Builder',
      titleAr: 'البناء الاجتماعي',
      description: 'Refer 10 friends to the platform',
      descriptionAr: 'ادع 10 أصدقاء إلى المنصة',
      icon: <Users className="w-6 h-6" />,
      points: 750,
      unlocked: false,
      progress: 5,
      maxProgress: 10,
      category: 'referrals'
    },
    {
      id: 'ACH005',
      title: 'Daily Warrior',
      titleAr: 'المحارب اليومي',
      description: 'Login for 100 consecutive days',
      descriptionAr: 'سجل دخول لمدة 100 يوم متتالي',
      icon: <Flame className="w-6 h-6" />,
      points: 800,
      unlocked: true,
      category: 'loyalty'
    },
    {
      id: 'ACH006',
      title: 'VIP Constructor',
      titleAr: 'مقاول كبار الشخصيات',
      description: 'Reach Gold level status',
      descriptionAr: 'وصل إلى مستوى الذهبي',
      icon: <Medal className="w-6 h-6" />,
      points: 2000,
      unlocked: true,
      category: 'special'
    }
  ]);

  const [rewards] = useState<Reward[]>([
    {
      id: 'REW001',
      title: '10% Discount on Next Order',
      titleAr: 'خصم 10% على الطلبية القادمة',
      description: 'Save 10% on your next purchase',
      descriptionAr: 'وفر 10% على مشترياتك القادمة',
      pointsCost: 500,
      discountPercent: 10,
      category: 'discounts',
      available: true
    },
    {
      id: 'REW002',
      title: 'Free Delivery Service',
      titleAr: 'خدمة توصيل مجانية',
      description: 'Free delivery for orders up to 5000 SAR',
      descriptionAr: 'توصيل مجاني للطلبات حتى 5000 ريال',
      pointsCost: 300,
      category: 'services',
      available: true
    },
    {
      id: 'REW003',
      title: 'Premium Consultation',
      titleAr: 'استشارة مميزة',
      description: '1-hour free consultation with our experts',
      descriptionAr: 'استشارة مجانية لمدة ساعة مع خبرائنا',
      pointsCost: 1200,
      originalPrice: 300,
      category: 'services',
      available: true
    },
    {
      id: 'REW004',
      title: 'Exclusive Tool Set',
      titleAr: 'طقم أدوات حصري',
      description: 'Limited edition professional tool set',
      descriptionAr: 'طقم أدوات احترافي إصدار محدود',
      pointsCost: 3000,
      originalPrice: 800,
      category: 'products',
      available: true,
      limited: true
    },
    {
      id: 'REW005',
      title: 'VIP Member Access',
      titleAr: 'عضوية كبار الشخصيات',
      description: 'Access to exclusive VIP features',
      descriptionAr: 'وصول إلى مميزات كبار الشخصيات الحصرية',
      pointsCost: 5000,
      category: 'exclusive',
      available: false
    },
    {
      id: 'REW006',
      title: 'Flash Sale Access',
      titleAr: 'وصول للتخفيضات السريعة',
      description: '24-hour early access to flash sales',
      descriptionAr: 'وصول مبكر للتخفيضات السريعة لمدة 24 ساعة',
      pointsCost: 800,
      category: 'exclusive',
      available: true,
      timeLeft: '2d 14h'
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  const calculateLevelProgress = () => {
    const currentLevelMin = (userStats.level - 1) * 2000;
    const currentProgress = userStats.totalPoints - currentLevelMin;
    const levelRequirement = userStats.nextLevelPoints - currentLevelMin;
    
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

return (currentProgress / levelRequirement) * 100;
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'purchases': return <ShoppingBag className="w-5 h-5" />;
      case 'engagement': return <Target className="w-5 h-5" />;
      case 'referrals': return <Users className="w-5 h-5" />;
      case 'loyalty': return <Flame className="w-5 h-5" />;
      case 'special': return <Crown className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'purchases': return 'المشتريات';
      case 'engagement': return 'التفاعل';
      case 'referrals': return 'الإحالات';
      case 'loyalty': return 'الولاء';
      case 'special': return 'خاص';
      default: return 'عام';
    }
  };

  const getRewardCategoryName = (category: string) => {
    switch(category) {
      case 'discounts': return 'خصومات';
      case 'services': return 'خدمات';
      case 'products': return 'منتجات';
      case 'exclusive': return 'حصرية';
      default: return 'عام';
    }
  };

  const canAffordReward = (pointsCost: number) => {
    return userStats.totalPoints >= pointsCost;
  };

  const handleClaimReward = (rewardId: string) => {
    console.log('Claiming reward:', rewardId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-600" />
          مركز المكافآت والإنجازات
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          اربح نقاط، افتح إنجازات، واستبدل مكافآت حصرية
        </Typography>
      </div>

      {/* User Level Card */}
      <EnhancedCard className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-yellow-800">
                المستوى {userStats.level}
              </Typography>
              <Typography variant="body" size="lg" className="text-yellow-700">
                {userStats.rankAr}
              </Typography>
            </div>
          </div>
          
          <div className="text-left">
            <Typography variant="subheading" size="3xl" weight="bold" className="text-yellow-800">
              {userStats.totalPoints.toLocaleString('en-US')}
            </Typography>
            <Typography variant="caption" size="sm" className="text-yellow-600">
              نقطة إجمالية
            </Typography>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm text-yellow-700 mb-1">
            <span>التقدم للمستوى التالي</span>
            <span>{userStats.nextLevelPoints - userStats.totalPoints} نقطة متبقية</span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-3">
            <div 
              className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${calculateLevelProgress()}%` }}
            ></div>
          </div>
        </div>
      </EnhancedCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600 mb-1">
            {userStats.totalSpent.toLocaleString('en-US')}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">إجمالي الإنفاق (ر.س)</Typography>
        </EnhancedCard>
        
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600 mb-1">
            {userStats.projectsCompleted}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">مشاريع مكتملة</Typography>
        </EnhancedCard>
        
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-purple-600 mb-1">
            {userStats.referrals}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">إحالات ناجحة</Typography>
        </EnhancedCard>
        
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600 mb-1">
            {userStats.daysActive}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">يوم نشط</Typography>
        </EnhancedCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: <Trophy className="w-5 h-5" /> },
          { id: 'achievements', label: 'الإنجازات', icon: <Award className="w-5 h-5" /> },
          { id: 'rewards', label: 'المكافآت', icon: <Gift className="w-5 h-5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Recent Achievements */}
          <div>
            <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">الإنجازات الأخيرة</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
                <EnhancedCard key={achievement.id} className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                      {achievement.icon}
                    </div>
                    <div>
                      <Typography variant="subheading" weight="semibold">{achievement.titleAr}</Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">{achievement.descriptionAr}</Typography>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      مكتمل
                    </span>
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Coins className="w-4 h-4" />
                      +{achievement.points}
                    </span>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Available Rewards */}
          <div>
            <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">مكافآت متاحة</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.filter(r => r.available && canAffordReward(r.pointsCost)).slice(0, 4).map((reward) => (
                <EnhancedCard key={reward.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Typography variant="subheading" weight="semibold" className="mb-1">{reward.titleAr}</Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600 mb-2">{reward.descriptionAr}</Typography>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {getRewardCategoryName(reward.category)}
                      </span>
                    </div>
                    {reward.limited && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        محدود
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-blue-600">
                      {reward.pointsCost.toLocaleString('en-US')} نقطة
                    </span>
                    <Button
                      onClick={() => handleClaimReward(reward.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                    >
                      استبدل
                    </Button>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {Object.entries(
            achievements.reduce((acc, achievement) => {
              if (!acc[achievement.category]) acc[achievement.category] = [];
              acc[achievement.category].push(achievement);
              return acc;
            }, {} as Record<string, Achievement[]>)
          ).map(([category, categoryAchievements]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(category)}
                <Typography variant="subheading" size="xl" weight="semibold">
                  {getCategoryName(category)}
                </Typography>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map((achievement) => (
                  <EnhancedCard 
                    key={achievement.id} 
                    className={`p-4 ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                      </div>
                      
                      <div className="flex-1">
                        <Typography variant="subheading" weight="semibold" className={`mb-1 ${
                          achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {achievement.titleAr}
                        </Typography>
                        <Typography variant="caption" size="sm" className="text-gray-600 mb-2">
                          {achievement.descriptionAr}
                        </Typography>
                        
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="mb-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>التقدم</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        achievement.unlocked 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {achievement.unlocked ? 'مكتمل' : 'مقفل'}
                      </span>
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Coins className="w-4 h-4" />
                        {achievement.points}
                      </span>
                    </div>
                  </EnhancedCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          {Object.entries(
            rewards.reduce((acc, reward) => {
              if (!acc[reward.category]) acc[reward.category] = [];
              acc[reward.category].push(reward);
              return acc;
            }, {} as Record<string, Reward[]>)
          ).map(([category, categoryRewards]) => (
            <div key={category}>
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">
                {getRewardCategoryName(category)}
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryRewards.map((reward) => {
                  const affordable = canAffordReward(reward.pointsCost);
                  
                  return (
                    <EnhancedCard 
                      key={reward.id} 
                      className={`p-4 ${!reward.available ? 'opacity-50' : ''}`}
                    >
                      <div className="mb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Typography variant="subheading" weight="semibold">{reward.titleAr}</Typography>
                          <div className="flex gap-1">
                            {reward.limited && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                محدود
                              </span>
                            )}
                            {reward.timeLeft && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                {reward.timeLeft}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Typography variant="caption" size="sm" className="text-gray-600 mb-3">
                          {reward.descriptionAr}
                        </Typography>
                        
                        {reward.originalPrice && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-500 line-through">
                              {reward.originalPrice} ر.س
                            </span>
                            <span className="text-sm text-green-600 mr-2">
                              وفر {reward.originalPrice - (reward.originalPrice * 0.7)} ر.س
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-lg ${affordable ? 'text-blue-600' : 'text-gray-400'}`}>
                          {reward.pointsCost.toLocaleString('en-US')} نقطة
                        </span>
                        
                        <Button
                          onClick={() => handleClaimReward(reward.id)}
                          disabled={!reward.available || !affordable}
                          className={`px-4 py-2 ${
                            reward.available && affordable
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {!reward.available ? 'غير متاح' : !affordable ? 'نقاط غير كافية' : 'استبدل'}
                        </Button>
                      </div>
                    </EnhancedCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-yellow-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-yellow-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}

