// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Scan, Plus, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { Card } from '@/components/ui';

interface ConstructionStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  categoriesCount: number;
  totalValue: number;
  recentActivity: {
    id: string;
    type: 'add' | 'update' | 'sell';
    product_name: string;
    quantity?: number;
    timestamp: string;
  }[];
}

interface ConstructionDashboardWidgetProps {
  storeId: string;
}

export default function ConstructionDashboardWidget({ storeId }: ConstructionDashboardWidgetProps) {
  const [stats, setStats] = useState<ConstructionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [storeId]);

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/products/construction/stats?store_id=${storeId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to basic stats calculation
        const productsResponse = await fetch('/api/products/construction');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const products = productsData.products || [];
          
          const totalValue = products.reduce((sum: number, product: any) => 
            sum + (product.price * product.stock_quantity), 0);
          
          setStats({
            totalProducts: products.length,
            activeProducts: products.filter((p: any) => p.is_active).length,
            lowStockProducts: products.filter((p: any) => p.stock_quantity <= p.min_stock_level).length,
            categoriesCount: new Set(products.map((p: any) => p.category_id)).size,
            totalValue,
            recentActivity: []
          });
        }
      }
    } catch (error) {
      console.error('Error loading construction stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">مواد البناء والتشييد</h3>
          <Package className="w-6 h-6 text-orange-600" />
        </div>
        <div className="text-center py-6">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">لا توجد منتجات بناء مضافة</p>
          <Link
            href="/store/products/construction/new"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة منتج بناء
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">مواد البناء والتشييد</h3>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-600" />
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            {stats.totalProducts} منتج
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">{stats.totalProducts}</div>
          <div className="text-xs text-blue-600">إجمالي المنتجات</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">{stats.activeProducts}</div>
          <div className="text-xs text-green-600">نشط</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">{stats.lowStockProducts}</div>
          <div className="text-xs text-orange-600">مخزون منخفض</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">{stats.categoriesCount}</div>
          <div className="text-xs text-purple-600">فئة</div>
        </div>
      </div>

      {/* Total Value */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-700">إجمالي قيمة المخزون</p>
            <p className="text-2xl font-bold text-orange-800">
              {stats.totalValue.toLocaleString('en-US')} ر.س
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div>
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />
            <span className="text-red-700 text-sm">
              تحذير: {stats.lowStockProducts} منتج يحتاج إعادة تخزين
            </span>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Activity className="w-4 h-4 ml-2" />
            النشاط الأخير
          </h4>
          <div className="space-y-2">
            {stats.recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ml-2 ${
                    activity.type === 'add' ? 'bg-green-500' :
                    activity.type === 'update' ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-gray-700">{activity.product_name}</span>
                </div>
                <span className="text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString('en-US')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <Link
          href="/store/products/construction"
          className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Package className="w-4 h-4 ml-2" />
          إدارة مواد البناء
        </Link>
        
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/store/products/construction/new"
            className="flex items-center justify-center px-3 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة منتج
          </Link>
          
          <button
            onClick={() => {
              // Open barcode scanner
              window.dispatchEvent(new CustomEvent('openBarcodeScanner'));
            }}
            className="flex items-center justify-center px-3 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Scan className="w-4 h-4 ml-1" />
            مسح باركود
          </button>
        </div>
        
        <Link
          href="/store/categories/construction"
          className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          إدارة الفئات
        </Link>
      </div>
    </Card>
  );
}





