'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  Target,
  Activity,
  FileText,
  Download
} from 'lucide-react'

export default function DashboardPage() {
  const [dashboardData] = useState({
    orders: [],
    products: [],
    warrantyClaims: []
  })
  
  const [selectedTab, setSelectedTab] = useState('overview')

  const tabs = [
    { key: 'overview', label: 'نظرة عامة' },
    { key: 'products', label: 'المنتجات' },
    { key: 'orders', label: 'الطلبات' },
    { key: 'warranty', label: 'مطالبات الضمان' }
  ]

  // Mock data for demonstration
  const metrics = {
    totalRevenue: 45000,
    revenueGrowth: 12.5,
    totalOrders: 124,
    orderGrowth: 8.3,
    averageOrderValue: 850,
    grossMargin: 32.4,
    orderFulfillmentRate: 94.2,
    onTimeDeliveryRate: 88.7,
    customerRetentionRate: 76.3
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة تحكم المتجر</h1>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>طلب جديد</Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="إجمالي الإيرادات"
          value={formatCurrency(metrics.totalRevenue)}
          change={metrics.revenueGrowth}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="إجمالي الطلبات"
          value={metrics.totalOrders.toString()}
          change={metrics.orderGrowth}
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          title="متوسط قيمة الطلب"
          value={formatCurrency(metrics.averageOrderValue)}
          change={0}
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="هامش الربح الإجمالي"
          value={`${metrics.grossMargin}%`}
          change={0}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 ml-2" />
            مؤشرات الأداء
          </h3>
          <div className="space-y-4">
            <PerformanceIndicator
              label="معدل تنفيذ الطلبات"
              value={metrics.orderFulfillmentRate}
              target={95}
              color="green"
            />
            <PerformanceIndicator
              label="معدل التسليم في الوقت المحدد"
              value={metrics.onTimeDeliveryRate}
              target={90}
              color="blue"
            />
            <PerformanceIndicator
              label="معدل الاحتفاظ بالعملاء"
              value={metrics.customerRetentionRate}
              target={80}
              color="purple"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="w-5 h-5 ml-2" />
            حالة المخزون
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي المنتجات</span>
              <span className="font-semibold">{dashboardData.products?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">نفذت من المخزن</span>
              <span className="font-semibold text-red-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مخزون منخفض</span>
              <span className="font-semibold text-orange-600">7</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 ml-2" />
            إحصائيات العملاء
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي العملاء</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">عملاء جدد هذا الشهر</span>
              <span className="font-semibold text-green-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">عملاء نشطون</span>
              <span className="font-semibold text-blue-600">67</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>المنتجات الحديثة</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.products?.length === 0 ? (
                  <p className="text-gray-500">لا توجد منتجات متاحة</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.products?.map((product: any) => (
                      <div key={product?.id || Math.random()} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{product?.name || 'منتج غير مسمى'}</div>
                          <div className="text-sm text-gray-500">{product?.price || 0} ر.س</div>
                        </div>
                        <Badge variant={product?.inStock ? 'default' : 'destructive'}>
                          {product?.inStock ? 'متوفر' : 'نفد من المخزن'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الطلبات الأخيرة</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.orders?.length === 0 ? (
                  <p className="text-gray-500">لا توجد طلبات متاحة</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.orders?.map((order: any) => (
                      <div key={order?.id || Math.random()} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">طلب #{order?.id || 'غير متاح'}</div>
                          <div className="text-sm text-gray-500">{order?.totalAmount || 0} ر.س</div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          {order?.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              تأكيد
                            </Button>
                          )}
                          {order?.status === 'confirmed' && (
                            <Button size="sm" variant="outline">
                              معالجة
                            </Button>
                          )}
                          {order?.status === 'processing' && (
                            <Button size="sm" variant="outline">
                              شحن
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'warranty' && (
          <Card>
            <CardHeader>
              <CardTitle>Warranty Claims</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.warrantyClaims?.length === 0 ? (
                <p className="text-gray-500">No warranty claims available</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.warrantyClaims?.map((claim: any) => (
                    <div key={claim?.id || Math.random()} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Claim #{claim?.id || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{claim?.productName || 'Unknown Product'}</div>
                      </div>
                      <div className="flex space-x-2">
                        {claim?.status === 'submitted' && (
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Helper Components */}
      {/* <MetricCard /> and <PerformanceIndicator /> components here */}
    </div>
  )
}

// Helper Components
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change !== 0 && (
            <div className={`flex items-center mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
              <span className="text-sm">{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}

interface PerformanceIndicatorProps {
  label: string;
  value: number;
  target: number;
  color: 'green' | 'blue' | 'purple';
}

function PerformanceIndicator({ label, value, target, color }: PerformanceIndicatorProps) {
  const percentage = (value / target) * 100;
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
