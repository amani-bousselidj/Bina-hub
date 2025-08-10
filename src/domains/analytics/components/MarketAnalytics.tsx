// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, MapPin, DollarSign, Users, Zap, Download, Share2 } from 'lucide-react';
import { supabase } from '@/core/shared/services/supabase/client';

interface MarketData {
  region: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  priceChanges: Array<{
    product: string;
    oldPrice: number;
    newPrice: number;
    change: number;
  }>;
}

interface MarketAnalyticsProps {
  className?: string;
}

export default function MarketAnalytics({ className = '' }: MarketAnalyticsProps) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('الرياض');
  const [timeRange, setTimeRange] = useState<string>('7d');

  // Saudi regions for market analysis
  const saudiRegions = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 
    'أبها', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل'
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // In production, this would fetch from actual analytics API
        // For now, we'll use simulated data
        const mockData: MarketData[] = saudiRegions.map(region => ({
          region,
          totalOrders: Math.floor(Math.random() * 1000) + 100,
          totalRevenue: Math.floor(Math.random() * 500000) + 50000,
          averageOrderValue: Math.floor(Math.random() * 2000) + 300,
          topProducts: [
            { name: 'طوب أحمر', sales: Math.floor(Math.random() * 100) + 50, trend: 'up' as const },
            { name: 'أسمنت بورتلاند', sales: Math.floor(Math.random() * 80) + 40, trend: 'stable' as const },
            { name: 'حديد تسليح', sales: Math.floor(Math.random() * 90) + 45, trend: 'down' as const },
          ],
          priceChanges: [
            { product: 'طوب أحمر', oldPrice: 0.5, newPrice: 0.52, change: 4 },
            { product: 'أسمنت (كيس)', oldPrice: 25, newPrice: 24, change: -4 },
            { product: 'حديد 12 مم', oldPrice: 2800, newPrice: 2850, change: 1.8 },
          ]
        }));

        setMarketData(mockData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [timeRange]);

  const selectedData = marketData.find(data => data.region === selectedRegion);

  const handleExport = () => {
    const dataToExport = {
      region: selectedRegion,
      timeRange,
      data: selectedData,
      generatedBy: 'BinnaHub Analytics',
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-analytics-${selectedRegion}-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `تحليل السوق - ${selectedRegion}`,
          text: `تحليل السوق للمنطقة ${selectedRegion} من منصة بنا`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط إلى الحافظة');
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header with BinnaHub Watermark */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">تحليل السوق</h2>
              <p className="text-green-100">بيانات السوق السعودي للمواد الإنشائية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              تصدير
            </button>
            <button
              onClick={handleShare}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>
        </div>

        {/* BinnaHub Watermark */}
        <div className="absolute bottom-2 right-4 text-white/40 text-sm font-medium">
          Powered by BinnaHub Analytics
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {saudiRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700">الفترة الزمنية:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوم</option>
              <option value="90d">آخر 3 أشهر</option>
              <option value="1y">آخر سنة</option>
            </select>
          </div>
        </div>
      </div>

      {selectedData && (
        <div className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي الطلبات</p>
                  <p className="text-3xl font-bold text-blue-900">{selectedData.totalOrders.toLocaleString('en-US')}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold text-green-900">{selectedData.totalRevenue.toLocaleString('en-US')} ريال</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">متوسط قيمة الطلب</p>
                  <p className="text-3xl font-bold text-purple-900">{selectedData.averageOrderValue.toLocaleString('en-US')} ريال</p>
                </div>
                <Zap className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">أفضل المنتجات مبيعاً</h3>
              <div className="space-y-3">
                {selectedData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{product.sales} قطعة</span>
                      {product.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                      {product.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                      {product.trend === 'stable' && <div className="w-5 h-5 bg-gray-400 rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Changes */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">تغيرات الأسعار</h3>
              <div className="space-y-3">
                {selectedData.priceChanges.map((priceChange, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{priceChange.product}</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        priceChange.change > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {priceChange.change > 0 ? '+' : ''}{priceChange.change}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>السعر السابق: {priceChange.oldPrice} ريال</span>
                      <span>السعر الحالي: {priceChange.newPrice} ريال</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Watermark Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              تم إنشاء هذا التقرير بواسطة <span className="font-semibold text-green-600">BinnaHub Analytics</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              جميع البيانات محمية بحقوق الطبع والنشر لمنصة بنا © 2025
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Named export for compatibility
export { MarketAnalytics };





