'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard, 
  PieChart, 
  Download,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Wallet
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface FinancialSummary {
  totalRevenue: number
  monthlyGrowth: number
  commission: number
  pendingPayouts: number
  totalTransactions: number
}

interface TransactionData {
  id: string
  store: string
  amount: number
  commission: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  type: 'sale' | 'subscription' | 'commission'
}

export default function FinancePage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [financials, setFinancials] = useState<FinancialSummary | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    // Simulate loading financial data
    const timer = setTimeout(() => {
      setFinancials({
        totalRevenue: 2847500,
        monthlyGrowth: 15.3,
        commission: 284750,
        pendingPayouts: 45000,
        totalTransactions: 12450
      })

      setTransactions([
        {
          id: '1',
          store: 'متجر مواد البناء الحديث',
          amount: 12500,
          commission: 1250,
          status: 'completed',
          date: '2024-01-15',
          type: 'sale'
        },
        {
          id: '2',
          store: 'متجر الأدوات المتخصص',
          amount: 8900,
          commission: 890,
          status: 'pending',
          date: '2024-01-14',
          type: 'sale'
        },
        {
          id: '3',
          store: 'شركة المقاولات العامة',
          amount: 25000,
          commission: 2500,
          status: 'completed',
          date: '2024-01-13',
          type: 'subscription'
        },
        {
          id: '4',
          store: 'متجر التصميم الداخلي',
          amount: 6700,
          commission: 670,
          status: 'failed',
          date: '2024-01-12',
          type: 'sale'
        }
      ])

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredTransactions = transactions.filter(transaction => 
    filterStatus === 'all' || transaction.status === filterStatus
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'pending':
        return 'قيد الانتظار'
      case 'failed':
        return 'فشل'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">جارٍ تحميل البيانات المالية...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">المالية والعمولات</h1>
          <p className="text-muted-foreground">إدارة شاملة للمالية والعمولات عبر منصة بنّا</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('تصدير التقرير المالي')}>
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financials?.totalRevenue.toLocaleString('ar-SA')} ريال</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النمو الشهري</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{financials?.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">مقارنة بالشهر السابق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العمولات</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financials?.commission.toLocaleString('ar-SA')} ريال</div>
            <p className="text-xs text-muted-foreground">10% من إجمالي المبيعات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدفوعات المعلقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{financials?.pendingPayouts.toLocaleString('ar-SA')} ريال</div>
            <p className="text-xs text-muted-foreground">بانتظار المعالجة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المعاملات</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financials?.totalTransactions.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">معاملة هذا الشهر</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Growth Alert */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            نمو إيجابي في الإيرادات
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <p>تحقق المنصة نمواً مستداماً بمعدل {financials?.monthlyGrowth}% شهرياً، مع زيادة ملحوظة في عمولات المتاجر وإيرادات الاشتراكات.</p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          <TabsTrigger value="commissions">العمولات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الإيرادات</CardTitle>
                <CardDescription>تفصيل مصادر الإيرادات للمنصة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { source: 'عمولات المبيعات', amount: 1800000, percentage: 63 },
                  { source: 'رسوم الاشتراكات', amount: 600000, percentage: 21 },
                  { source: 'خدمات إضافية', amount: 300000, percentage: 11 },
                  { source: 'رسوم الإعلانات', amount: 147500, percentage: 5 }
                ].map((item, index) => (
                  <div key={item.source} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.source}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentage} className="w-32 h-2" />
                      <span className="text-sm">{item.amount.toLocaleString('ar-SA')} ريال</span>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الاتجاهات المالية</CardTitle>
                <CardDescription>تطور الإيرادات خلال الأشهر الماضية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { month: 'يناير', revenue: 2100000, growth: 8.5 },
                  { month: 'فبراير', revenue: 2250000, growth: 7.1 },
                  { month: 'مارس', revenue: 2400000, growth: 6.7 },
                  { month: 'أبريل', revenue: 2580000, growth: 7.5 },
                  { month: 'مايو', revenue: 2720000, growth: 5.4 },
                  { month: 'يونيو', revenue: 2847500, growth: 4.7 }
                ].map((data, index) => (
                  <div key={data.month} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{data.month}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={data.revenue / 30000} className="w-24 h-2" />
                      <span className="text-sm">{(data.revenue / 1000000).toFixed(1)}م ريال</span>
                      <Badge variant={data.growth > 7 ? "default" : "secondary"}>
                        +{data.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="البحث في المعاملات..."
                className="pr-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">جميع الحالات</option>
              <option value="completed">مكتمل</option>
              <option value="pending">قيد الانتظار</option>
              <option value="failed">فشل</option>
            </select>
            <Button variant="outline" onClick={() => alert('Button clicked')}>
              <Filter className="h-4 w-4 ml-2" />
              تصفية
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>سجل المعاملات</CardTitle>
              <CardDescription>جميع المعاملات المالية الأخيرة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <p className="font-medium">{transaction.store}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === 'sale' ? 'مبيعات' : 
                           transaction.type === 'subscription' ? 'اشتراك' : 'عمولة'} • 
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{transaction.amount.toLocaleString('ar-SA')} ريال</p>
                      <p className="text-sm text-muted-foreground">
                        عمولة: {transaction.commission.toLocaleString('ar-SA')} ريال
                      </p>
                      <Badge variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>هيكل العمولات</CardTitle>
              <CardDescription>معدلات العمولات المطبقة على المتاجر</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { tier: 'المتاجر الجديدة', rate: 8, description: 'للمتاجر في أول 6 أشهر' },
                  { tier: 'المتاجر القياسية', rate: 10, description: 'المعدل الأساسي للمتاجر' },
                  { tier: 'المتاجر المميزة', rate: 12, description: 'للمتاجر عالية الأداء' },
                  { tier: 'متاجر المشاريع الكبيرة', rate: 15, description: 'للمشاريع فوق 100 ألف ريال' }
                ].map((tier, index) => (
                  <div key={tier.tier} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{tier.tier}</p>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{tier.rate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التقارير المالية</CardTitle>
              <CardDescription>تقارير مالية تفصيلية وتحليلات الأداء</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    title: 'تقرير الإيرادات الشهرية', 
                    description: 'تفصيل شامل للإيرادات والعمولات',
                    format: 'PDF + Excel'
                  },
                  { 
                    title: 'تحليل أداء المتاجر', 
                    description: 'ترتيب المتاجر حسب المبيعات والعمولات',
                    format: 'Excel'
                  },
                  { 
                    title: 'تقرير المعاملات المعلقة', 
                    description: 'جميع المدفوعات التي تحتاج متابعة',
                    format: 'PDF'
                  },
                  { 
                    title: 'تحليل الاتجاهات المالية', 
                    description: 'توقعات ورؤى للأشهر القادمة',
                    format: 'PDF + Charts'
                  }
                ].map((report, index) => (
                  <div key={report.title} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button size="sm" onClick={() => alert(`تحميل ${report.title}`)}>
                        <Download className="h-3 w-3 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}




