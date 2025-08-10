// @ts-nocheck
"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/core/shared/utils";
import { supabaseDataService } from "@/services/supabase-data-service";
import Link from 'next/link';
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
  ExternalLink,
  Filter,
  Building2,
  Clock,
  TrendingDown,
  Plus,
  Home
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface PriceData {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  storeName: string;
  city: string;
  lastUpdated: string;
}

const statsData = [
  {
    title: "إجمالي المستخدمين",
    value: "15,847",
    change: "+12.5%",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    changeColor: "text-green-600"
  },
  {
    title: "المتاجر النشطة", 
    value: "2,431",
    change: "+8.2%",
    icon: Store,
    color: "from-purple-500 to-purple-600",
    changeColor: "text-green-600"
  },
  {
    title: "المعاملات اليومية",
    value: "8,924",
    change: "+15.3%",
    icon: TrendingUp,
    color: "from-green-500 to-green-600", 
    changeColor: "text-green-600"
  },
  {
    title: "حجم المبيعات",
    value: "2.4M ريال",
    change: "+22.1%",
    icon: DollarSign,
    color: "from-orange-500 to-orange-600",
    changeColor: "text-green-600"
  }
];

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<'users' | 'stores'>('users');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'updated' | 'name'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allCities, setAllCities] = useState<string[]>(['all']);
  const [allStores, setAllStores] = useState<string[]>(['all']);
  const [allCategories, setAllCategories] = useState<string[]>(['all']);

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load filter options once on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch('/api/products?limit=200');
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
          const cities = ['all', ...Array.from(new Set(data.products.map((p: any) => p.city).filter((city: string) => city && city !== 'غير محدد')))];
          const stores = ['all', ...Array.from(new Set(data.products.map((p: any) => p.storeName).filter((store: string) => store && store !== 'متجر غير محدد')))];
          const categories = ['all', ...Array.from(new Set(data.products.map((p: any) => p.category).filter((cat: string) => cat && cat !== 'غير محدد')))];
          
          console.log('Filter options loaded:', { cities, stores, categories });
          
          setAllCities(cities);
          setAllStores(stores);
          setAllCategories(categories);
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Load price data from API
  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setIsLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (selectedCity !== 'all') params.set('city', selectedCity);
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (debouncedSearchTerm) params.set('q', debouncedSearchTerm);
        params.set('sortBy', sortBy);
        params.set('order', sortOrder);
        params.set('limit', '50');
        
        const apiUrl = `/api/products?${params.toString()}`;
        console.log('Fetching from:', apiUrl); // Debug log
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log('API Response:', data); // Debug log
        
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          const mappedData = data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            category: product.category || 'غير محدد',
            price: product.price,
            stock: product.stock || 0,
            storeName: product.storeName || 'متجر غير محدد',
            city: product.city || 'غير محدد',
            lastUpdated: product.lastUpdated || new Date().toISOString()
          }));
          setPriceData(mappedData);
        } else {
          console.warn('No real data available from API');
          setPriceData([]);
        }
      } catch (error) {
        console.error('Error loading price data:', error);
        setPriceData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPriceData();
  }, [selectedCity, selectedStore, selectedCategory, debouncedSearchTerm, sortBy, sortOrder]);

  // Since filters are applied server-side via API, we just display the data
  const sortedData = priceData;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                منصة بنّا التجارية
              </span>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في المواد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
              </div>
              
              <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              منصة <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">بنّا</span> التجارية
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              أول منصة رقمية متكاملة لتجارة مواد البناء في المملكة العربية السعودية
            </p>
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse pt-6">
              <Link href="/auth" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-lg">
                ابدأ الآن
              </Link>
              <Link href="#features" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-medium text-lg">
                اعرف المزيد
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Store className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              السوق الإلكتروني لمواد البناء
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              تسوق من أكبر تشكيلة من مواد البناء عالية الجودة من أفضل الموردين في المملكة
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <ShoppingCart className="h-8 w-8 text-white mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">تسوق آمن</h3>
                <p className="text-blue-100 text-sm">عمليات شراء آمنة مع ضمان الجودة</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Truck className="h-8 w-8 text-white mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">توصيل سريع</h3>
                <p className="text-blue-100 text-sm">خدمة توصيل لجميع أنحاء المملكة</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Award className="h-8 w-8 text-white mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">جودة مضمونة</h3>
                <p className="text-blue-100 text-sm">منتجات معتمدة من أفضل الموردين</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <Link 
                href="/marketplace" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-lg"
              >
                تصفح السوق الإلكتروني
              </Link>
              <Link 
                href="/marketplace?category=cement" 
                className="border-2 border-white/50 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium text-lg"
              >
                عرض الأسمنت
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Tracking Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              تتبع أسعار مواد البناء في الوقت الفعلي
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              احصل على أحدث أسعار مواد البناء من جميع أنحاء المملكة مع إمكانية المقارنة والتتبع
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">تصفية النتائج</h3>
              <button
                onClick={() => {
                  console.log('Reset button clicked');
                  setSelectedCity('all');
                  setSelectedStore('all');
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setSortBy('updated');
                  setSortOrder('desc');
                }}
                className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                إعادة تعيين
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <select 
                  value={selectedCity}
                  onChange={(e) => {
                    console.log('City changed to:', e.target.value);
                    setSelectedCity(e.target.value);
                  }}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ pointerEvents: 'auto', zIndex: 100 }}
                >
                  <option value="all">جميع المدن</option>
                  {allCities.filter(city => city !== 'all').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <small className="text-xs text-gray-500">Options: {allCities.length}</small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المتجر</label>
                <select 
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المتاجر</option>
                  {allStores.filter(store => store !== 'all').map(store => (
                    <option key={store} value={store}>{store}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    console.log('Category changed to:', e.target.value);
                    setSelectedCategory(e.target.value);
                  }}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ pointerEvents: 'auto', zIndex: 100 }}
                >
                  <option value="all">جميع الفئات</option>
                  {allCategories.filter(category => category !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <small className="text-xs text-gray-500">Options: {allCategories.length}</small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    console.log('Sort by changed to:', e.target.value);
                    setSortBy(e.target.value as 'price' | 'updated' | 'name');
                  }}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ pointerEvents: 'auto', zIndex: 100 }}
                >
                  <option value="price">السعر</option>
                  <option value="name">الاسم</option>
                  <option value="updated">آخر تحديث</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب</label>
                <select 
                  value={sortOrder}
                  onChange={(e) => {
                    console.log('Sort order changed to:', e.target.value);
                    setSortOrder(e.target.value as 'asc' | 'desc');
                  }}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ pointerEvents: 'auto', zIndex: 100 }}
                >
                  <option value="desc">تنازلي</option>
                  <option value="asc">تصاعدي</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Data Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المنتج</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الفئة</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">السعر</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المخزون</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المتجر</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المدينة</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">آخر تحديث</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span>جاري تحميل البيانات...</span>
                        </div>
                      </td>
                    </tr>
                  ) : sortedData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="text-center">
                          <p className="text-lg font-medium text-gray-600 mb-2">لا توجد نتائج</p>
                          <p className="text-sm text-gray-500">جرب تغيير معايير البحث أو المرشحات</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((item, index) => (
                      <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPrice(item.price)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className={`font-medium ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.stock > 0 ? `${item.stock} متوفر` : 'نفذ المخزون'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.storeName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.city}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.lastUpdated)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا تختار منصة بنّا؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نوفر لك جميع الأدوات والخدمات التي تحتاجها لإدارة مشاريع البناء بكفاءة وفعالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "تتبع الأسعار في الوقت الفعلي",
                description: "احصل على أحدث أسعار مواد البناء من جميع الموردين مع إمكانية المقارنة والتحليل"
              },
              {
                icon: Store,
                title: "شبكة موردين موثوقين",
                description: "اكتشف آلاف الموردين المعتمدين واحصل على أفضل الأسعار والعروض الحصرية"
              },
              {
                icon: Shield,
                title: "أمان ومصداقية",
                description: "جميع المعاملات محمية ومضمونة مع نظام تقييم شامل للموردين والمنتجات"
              },
              {
                icon: Truck,
                title: "توصيل سريع",
                description: "خدمة توصيل سريعة وموثوقة لجميع أنحاء المملكة مع تتبع الشحنات في الوقت الفعلي"
              },
              {
                icon: CreditCard,
                title: "طرق دفع متنوعة",
                description: "ادفع بالطريقة التي تناسبك - نقداً عند التسليم، تحويل بنكي، أو بطاقات الائتمان"
              },
              {
                icon: MessageSquare,
                title: "دعم فني متميز",
                description: "فريق دعم فني متخصص متاح على مدار الساعة لمساعدتك في جميع استفساراتك"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              ابدأ رحلتك مع منصة بنّا اليوم
            </h2>
            <p className="text-lg mb-8 opacity-90">
              انضم إلى آلاف المقاولين والموردين واستفد من أكبر منصة لتجارة مواد البناء في المملكة
            </p>
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <Link href="/auth" className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg">
                انشئ حسابك الآن
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-lg">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">منصة بنّا</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                أول منصة رقمية متكاملة لتجارة مواد البناء في المملكة العربية السعودية
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">خدماتنا</Link></li>
                <li><Link href="/suppliers" className="hover:text-white transition-colors">الموردين</Link></li>
                <li><Link href="/projects" className="hover:text-white transition-colors">المشاريع</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">الدعم</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">مركز المساعدة</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">تابعنا</h3>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Share2 className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 منصة بنّا. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}




