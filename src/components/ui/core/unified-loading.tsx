// @ts-nocheck
"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/core/shared/utils";
import { 
  Store, 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  BarChart3, 
  CreditCard,
  Package,
  MessageSquare,
  Settings,
  Globe,
  MapPin,
  Share2,
  Bell,
  Search,
  Heart,
  Star,
  Shield,
  Truck,
  Award,
  Zap,
  Target,
  Wallet,
  DollarSign,
  LineChart,
  Activity,
  Download,
  ExternalLink
} from "lucide-react";

interface PriceData {
  product: string;
  category: string;
  price: number;
  change: number;
  store: string;
  city: string;
  lastUpdated: string;
}

interface UnifiedLoadingProps {
  // Mode selection
  mode?: "simple" | "showcase" | "auto";
  
  // Simple loading props
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  logoSrc?: string;
  
  // Showcase props
  showPriceTracker?: boolean;
  showFeaturesTabs?: boolean;
  showStats?: boolean;
  showCallToAction?: boolean;
}

const mockPriceData: PriceData[] = [
  { product: "Iron Ton", category: "Metal", price: 450, change: +12.5, store: "Gulf Steel Co.", city: "Riyadh", lastUpdated: "2 hours ago" },
  { product: "Copper Kg", category: "Metal", price: 8.75, change: -3.2, store: "Metal World", city: "Dubai", lastUpdated: "1 hour ago" },
  { product: "Aluminum Ton", category: "Metal", price: 2100, change: +5.8, store: "Al-Manara Metals", city: "Kuwait", lastUpdated: "30 min ago" },
  { product: "Gold Gram", category: "Precious", price: 235, change: +1.2, store: "Gold Palace", city: "Doha", lastUpdated: "15 min ago" },
  { product: "Silver Ounce", category: "Precious", price: 24.50, change: -0.8, store: "Silver Star", city: "Manama", lastUpdated: "45 min ago" },
];

const userFeatures = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "البحث الذكي",
    description: "ابحث عن المنتجات والمتاجر بسهولة",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "سلة التسوق",
    description: "إدارة مشترياتك بكل سهولة",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "قائمة الأمنيات",
    description: "احفظ منتجاتك المفضلة",
    color: "from-red-500 to-red-600"
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "التقييمات والمراجعات",
    description: "شارك تجربتك مع المنتجات",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "التنبيهات الذكية",
    description: "تنبيهات الأسعار والعروض",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "الدفع الآمن",
    description: "طرق دفع متعددة وآمنة",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "تتبع الشحنات",
    description: "تابع طلباتك لحظة بلحظة",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "الدعم الفوري",
    description: "دعم عملاء على مدار الساعة",
    color: "from-teal-500 to-teal-600"
  }
];

const storeFeatures = [
  {
    icon: <Store className="w-6 h-6" />,
    title: "إدارة المتجر",
    description: "لوحة تحكم شاملة لمتجرك",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "إدارة المخزون",
    description: "تتبع المنتجات والكميات",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "تحليلات المبيعات",
    description: "تقارير مفصلة ورؤى تجارية",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "إدارة العملاء",
    description: "قاعدة عملاء متقدمة",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "تحسين الأداء",
    description: "نصائح لزيادة المبيعات",
    color: "from-red-500 to-red-600"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "التسويق الرقمي",
    description: "أدوات ترويج متقدمة",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "الإدارة المالية",
    description: "تتبع الأرباح والمصروفات",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "الأمان والحماية",
    description: "حماية بياناتك ومعاملاتك",
    color: "from-teal-500 to-teal-600"
  }
];

export function UnifiedLoading({
  mode = "auto",
  title = "جارٍ تحميل البيانات...",
  subtitle = "يرجى الانتظار قليلاً",
  showLogo = true,
  fullScreen = true,
  size = "md",
  className,
  logoSrc = "/logo.png",
  showPriceTracker = true,
  showFeaturesTabs = true,
  showStats = true,
  showCallToAction = true,
  ...props
}: UnifiedLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState<"loading" | "showcase">("loading");
  const [selectedTab, setSelectedTab] = useState<'users' | 'stores'>('users');

  const steps = [
    "جارٍ تحميل منصة بنّا التجارية...",
    "تحضير ميزات المستخدمين...",
    "إعداد أدوات المتاجر...",
    "تحديث أسعار المنتجات...",
    "تجهيز لوحة التحكم..."
  ];

  // Determine which mode to use
  const effectiveMode = mode === "auto" 
    ? (typeof window !== "undefined" && window.location?.pathname === "/" ? "showcase" : "simple")
    : mode;

  useEffect(() => {
    if (effectiveMode === "showcase") {
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setLoadingPhase("showcase");
          return prev;
        });
      }, 1500);

      return () => clearInterval(timer);
    } else {
      // For simple mode, show loading for 2 seconds then complete
      const timer = setTimeout(() => {
        setLoadingPhase("showcase");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [effectiveMode]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
  };

  const shareData = () => {
    const text = "تابع أسعار المنتجات لحظة بلحظة على منصة بنّا التجارية";
    const url = typeof window !== "undefined" ? window.location.origin : "";
    
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "منصة بنّا - متابعة الأسعار",
        text: text,
        url: url,
      });
    } else if (typeof window !== "undefined") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  // Simple Loading Mode
  if (effectiveMode === "simple" || loadingPhase === "loading") {
    const containerClasses = fullScreen 
      ? "fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 z-50 flex items-center justify-center"
      : "flex items-center justify-center p-8";

    return (
      <div className={cn(containerClasses, className)} {...props}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
          {showLogo && (
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-3xl">بـ</span>
              </div>
            </div>
          )}
          
          {/* Enhanced Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={cn(
                "animate-spin rounded-full border-4 border-blue-200 border-t-blue-600",
                sizeClasses[size]
              )}></div>
              <div className={cn(
                "absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20",
                sizeClasses[size]
              )}></div>
            </div>
          </div>

          {/* Loading Steps for Showcase Mode */}
          {effectiveMode === "showcase" && (
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-lg transition-all duration-300",
                    index <= currentStep 
                      ? "text-blue-600 font-semibold" 
                      : "text-gray-400"
                  )}
                >
                  {index <= currentStep && "✓ "}{step}
                </div>
              ))}
              
              {/* Progress Bar */}
              <div className="w-80 h-2 bg-gray-200 rounded-full mx-auto mt-4">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Simple Mode Title/Subtitle */}
          {effectiveMode === "simple" && (
            <>
              {title && (
                <h2 className="text-2xl font-bold text-gray-800">
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className="text-gray-600">
                  {subtitle}
                </p>
              )}

              {/* Progress Dots */}
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Showcase Mode (Full Platform Features)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">بـ</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">منصة بنّا التجارية</h1>
          <p className="text-lg text-gray-600">منصتك الشاملة للتجارة الإلكترونية في الخليج العربي</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 space-y-8">
        {/* Price Tracker Dashboard */}
        {showPriceTracker && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  متابع الأسعار المباشر
                </h2>
                <p className="text-gray-600">تابع أسعار المنتجات لحظة بلحظة من جميع المتاجر</p>
              </div>
              <button
                onClick={shareData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
            </div>

            {/* Price Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {mockPriceData.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{item.product}</h3>
                    <span className={cn(
                      "text-sm font-medium px-2 py-1 rounded-full",
                      item.change > 0 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    )}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">السعر:</span>
                      <span className="font-semibold text-gray-800">{item.price} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">المتجر:</span>
                      <span className="text-gray-700">{item.store}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">المدينة:</span>
                      <span className="text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.city}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      آخر تحديث: {item.lastUpdated}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Activity className="w-4 h-4" />
                يتم تحديث الأسعار كل 15 دقيقة • مقدم من منصة بنّا
              </div>
            </div>
          </div>
        )}

        {/* Feature Showcase Tabs */}
        {showFeaturesTabs && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Tab Headers */}
            <div className="flex bg-gray-50 border-b border-gray-200">
              <button
                onClick={() => setSelectedTab('users')}
                className={cn(
                  "flex-1 px-6 py-4 text-lg font-semibold transition-colors flex items-center justify-center gap-2",
                  selectedTab === 'users'
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                <Users className="w-5 h-5" />
                ميزات المستخدمين
              </button>
              <button
                onClick={() => setSelectedTab('stores')}
                className={cn(
                  "flex-1 px-6 py-4 text-lg font-semibold transition-colors flex items-center justify-center gap-2",
                  selectedTab === 'stores'
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                <Store className="w-5 h-5" />
                ميزات المتاجر
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(selectedTab === 'users' ? userFeatures : storeFeatures).map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-r mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300",
                      feature.color
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Platform Stats */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-8 h-8" />
                <span className="text-2xl font-bold">2,500+</span>
              </div>
              <p className="text-blue-100">متجر مسجل</p>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8" />
                <span className="text-2xl font-bold">50,000+</span>
              </div>
              <p className="text-green-100">مستخدم نشط</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-8 h-8" />
                <span className="text-2xl font-bold">100,000+</span>
              </div>
              <p className="text-purple-100">منتج متاح</p>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8" />
                <span className="text-2xl font-bold">99.9%</span>
              </div>
              <p className="text-orange-100">نسبة الرضا</p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {showCallToAction && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-semibold">ابدأ رحلتك التجارية الآن</span>
              <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6 text-gray-500 text-sm">
        <p>© 2024 منصة بنّا التجارية - جميع الحقوق محفوظة</p>
        <p className="mt-1">مقدم لك بواسطة فريق بنّا للتطوير</p>
      </div>
    </div>
  );
}

// Legacy compatibility exports
export function EnhancedLoading(props: any) {
  return <UnifiedLoading {...props} mode="simple" />;
}

export function PlatformShowcaseLoading(props: any) {
  return <UnifiedLoading {...props} mode="showcase" />;
}

// LoadingSpinner component for individual loading states
interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  size = "md",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-gray-300 border-t-current loading-spinner",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Also export as default for convenience
export default UnifiedLoading;


