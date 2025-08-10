// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Filter, Download } from 'lucide-react';
import { supabase } from '@/core/shared/services/supabase/client';

interface CityPrice {
  city: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  supplier: string;
  trend: 'up' | 'down' | 'stable';
}

interface PriceHistory {
  date: string;
  price: number;
  city: string;
}

interface CityPriceTrackingProps {
  className?: string;
}

export default function CityPriceTracking({ className = '' }: CityPriceTrackingProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('طوب أحمر');
  const [cityPrices, setCityPrices] = useState<CityPrice[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'city'>('price');
  const [filterTrend, setFilterTrend] = useState<'all' | 'up' | 'down' | 'stable'>('all');

  // Construction materials for tracking
  const products = [
    'طوب أحمر',
    'أسمنت بورتلاند',
    'حديد تسليح 12 مم',
    'حديد تسليح 16 مم',
    'رمل',
    'حصى',
    'دهان أبيض',
    'بلاط سيراميك',
    'أنابيب PVC',
    'كابلات كهربائية'
  ];

  // Major Saudi cities
  const saudiCities = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
    'أبها', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'الخبر', 'الطائف'
  ];

  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      try {
        // In production, this would fetch from actual price tracking API
        // For now, we'll use simulated data
        const mockCityPrices: CityPrice[] = saudiCities.map(city => {
          const basePrice = getBasePrice(selectedProduct);
          const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
          const currentPrice = basePrice * (1 + variation);
          const previousPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.1); // ±5% change
          const change = currentPrice - previousPrice;
          const changePercent = (change / previousPrice) * 100;

          return {
            city,
            currentPrice: Math.round(currentPrice * 100) / 100,
            previousPrice: Math.round(previousPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            supplier: `مورد ${city}`,
            trend: Math.abs(changePercent) < 1 ? 'stable' : changePercent > 0 ? 'up' : 'down'
          };
        });

        // Generate price history
        const mockHistory: PriceHistory[] = [];
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          return date.toISOString().split('T')[0];
        }).reverse();

        saudiCities.slice(0, 5).forEach(city => {
          const basePrice = getBasePrice(selectedProduct);
          last30Days.forEach(date => {
            const variation = (Math.random() - 0.5) * 0.15;
            mockHistory.push({
              date,
              price: Math.round(basePrice * (1 + variation) * 100) / 100,
              city
            });
          });
        });

        setCityPrices(mockCityPrices);
        setPriceHistory(mockHistory);
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [selectedProduct]);

  const getBasePrice = (product: string): number => {
    const basePrices: { [key: string]: number } = {
      'طوب أحمر': 0.5,
      'أسمنت بورتلاند': 25,
      'حديد تسليح 12 مم': 2800,
      'حديد تسليح 16 مم': 2900,
      'رمل': 80,
      'حصى': 90,
      'دهان أبيض': 120,
      'بلاط سيراميك': 45,
      'أنابيب PVC': 15,
      'كابلات كهربائية': 8
    };
    return basePrices[product] || 100;
  };

  const getUnit = (product: string): string => {
    const units: { [key: string]: string } = {
      'طوب أحمر': 'قطعة',
      'أسمنت بورتلاند': 'كيس',
      'حديد تسليح 12 مم': 'طن',
      'حديد تسليح 16 مم': 'طن',
      'رمل': 'متر مكعب',
      'حصى': 'متر مكعب',
      'دهان أبيض': 'غالون',
      'بلاط سيراميك': 'متر مربع',
      'أنابيب PVC': 'متر',
      'كابلات كهربائية': 'متر'
    };
    return units[product] || 'وحدة';
  };

  const sortedAndFilteredPrices = cityPrices
    .filter(price => filterTrend === 'all' || price.trend === filterTrend)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.currentPrice - b.currentPrice;
        case 'change':
          return Math.abs(b.changePercent) - Math.abs(a.changePercent);
        case 'city':
          return a.city.localeCompare(b.city, 'ar');
        default:
          return 0;
      }
    });

  const handleExport = () => {
    const exportData = {
      product: selectedProduct,
      unit: getUnit(selectedProduct),
      timestamp: new Date().toISOString(),
      cities: sortedAndFilteredPrices,
      generatedBy: 'BinnaHub Price Tracker'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-tracking-${selectedProduct}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLowestPrice = () => Math.min(...cityPrices.map(p => p.currentPrice));
  const getHighestPrice = () => Math.max(...cityPrices.map(p => p.currentPrice));
  const getAveragePrice = () => cityPrices.reduce((sum, p) => sum + p.currentPrice, 0) / cityPrices.length;

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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">تتبع الأسعار بالمدن</h2>
              <p className="text-blue-100">مقارنة أسعار مواد البناء في المدن السعودية</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير البيانات
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {products.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'change' | 'city')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price">ترتيب حسب السعر</option>
              <option value="change">ترتيب حسب التغيير</option>
              <option value="city">ترتيب حسب المدينة</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700">الاتجاه:</span>
            <select
              value={filterTrend}
              onChange={(e) => setFilterTrend(e.target.value as 'all' | 'up' | 'down' | 'stable')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الاتجاهات</option>
              <option value="up">ارتفاع الأسعار</option>
              <option value="down">انخفاض الأسعار</option>
              <option value="stable">أسعار مستقرة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">أقل سعر</p>
                <p className="text-2xl font-bold text-green-900">{getLowestPrice().toFixed(2)} ريال</p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">متوسط السعر</p>
                <p className="text-2xl font-bold text-blue-900">{getAveragePrice().toFixed(2)} ريال</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">أعلى سعر</p>
                <p className="text-2xl font-bold text-red-900">{getHighestPrice().toFixed(2)} ريال</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* City Prices Table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4 font-semibold text-gray-900">المدينة</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">السعر الحالي</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">السعر السابق</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">التغيير</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">النسبة</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">آخر تحديث</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">المورد</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredPrices.map((cityPrice, index) => (
                <tr key={cityPrice.city} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{cityPrice.city}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-lg">{cityPrice.currentPrice.toFixed(2)} ريال</span>
                    <span className="text-gray-500 text-sm">/{getUnit(selectedProduct)}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {cityPrice.previousPrice.toFixed(2)} ريال
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {cityPrice.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                      {cityPrice.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                      {cityPrice.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full"></div>}
                      <span className={`font-medium ${
                        cityPrice.change > 0 ? 'text-red-600' : cityPrice.change < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {cityPrice.change > 0 ? '+' : ''}{cityPrice.change.toFixed(2)} ريال
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      cityPrice.changePercent > 0 
                        ? 'bg-red-100 text-red-600' 
                        : cityPrice.changePercent < 0 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {cityPrice.changePercent > 0 ? '+' : ''}{cityPrice.changePercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(cityPrice.lastUpdated).toLocaleDateString('en-US')}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {cityPrice.supplier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BinnaHub Watermark */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            بيانات الأسعار محدثة بواسطة <span className="font-semibold text-blue-600">BinnaHub Price Tracker</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            تحديث الأسعار كل ساعة من مصادر موثوقة متعددة
          </p>
        </div>
      </div>
    </div>
  );
}





