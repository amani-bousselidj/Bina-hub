// @ts-nocheck
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui';
import { ClientIcon } from '@/components/icons';
import {
  getStoreStats,
  getStoreAnalytics,
  getRevenueByProduct,
  getCustomerSegments,
  getMarketingCampaigns,
} from '@/core/shared/services/api/store-analytics';
import type {
  StoreStats,
  StoreAnalytics,
  RevenueByProduct,
  CustomerSegment,
  MarketingCampaign,
  AnalyticsDataPoint,
} from '@/core/shared/types/store-analytics';
import { formatCurrency } from '@/core/shared/utils';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color: string;
}

function StatCard({ title, value, description, icon, color }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {icon}
      </div>
    </div>
  );
}

interface AnalyticsProps {
  storeId: string;
}

export default function StoreAnalyticsDashboard({ storeId }: AnalyticsProps) {
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [analytics, setAnalytics] = useState<StoreAnalytics | null>(null);
  const [revenueByProduct, setRevenueByProduct] = useState<RevenueByProduct[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, analyticsData, revenueData, segmentsData, campaignsData] =
          await Promise.all([
            getStoreStats(storeId),
            getStoreAnalytics(storeId, timeframe),
            getRevenueByProduct(storeId),
            getCustomerSegments(storeId),
            getMarketingCampaigns(storeId),
          ]);

        setStats(statsData);
        setAnalytics(analyticsData);
        setRevenueByProduct(revenueData);
        setCustomerSegments(segmentsData);
        setCampaigns(campaignsData);
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('حدث خطأ في تحميل البيانات التحليلية');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [storeId, timeframe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات التحليلية...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-tajawal">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحليلات</h1>
          <p className="text-gray-600">تحليلات المتجر ومؤشرات الأداء الرئيسية</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي المبيعات"
            value={formatCurrency(stats?.totalRevenue || 0)}
            description="الإجمالي التراكمي"
            color="border-blue-500"
            icon={<ClientIcon type="money" size={24} className="text-blue-500" />}
          />
          <StatCard
            title="الطلبات النشطة"
            value={stats?.activeOrders || 0}
            description={`من أصل ${stats?.totalOrders} طلب`}
            color="border-green-500"
            icon={<ClientIcon type="cart" size={24} className="text-green-500" />}
          />
          <StatCard
            title="متوسط قيمة الطلب"
            value={formatCurrency(stats?.averageOrderValue || 0)}
            description="لكل طلب"
            color="border-purple-500"
            icon={<ClientIcon type="chart" size={24} className="text-purple-500" />}
          />
          <StatCard
            title="معدل التحويل"
            value={`${(stats?.conversionRate || 0).toFixed(1)}%`}
            description="من الزيارات إلى مبيعات"
            color="border-yellow-500"
            icon={<ClientIcon type="conversion" size={24} className="text-yellow-500" />}
          />
        </div>

        {/* Revenue Chart */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">تحليل المبيعات</h2>
            <div className="flex items-center gap-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
                <option value="monthly">شهري</option>
              </select>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.[timeframe] || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US')}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  name="المبيعات"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#00C49F"
                  name="الطلبات"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Products and Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">أفضل المنتجات مبيعاً</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByProduct.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product_name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#0088FE" name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Customer Segments */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">تقسيم العملاء</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegments}
                    dataKey="total_revenue"
                    nameKey="segment_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {customerSegments.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Marketing Campaigns */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">الحملات التسويقية</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الحملة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التكلفة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإيرادات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العائد على الاستثمار
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التحويلات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.campaign_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(campaign.spend)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(campaign.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campaign.roi > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {campaign.roi.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.conversions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}






