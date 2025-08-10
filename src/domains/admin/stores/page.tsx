'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { 
  Store, 
  Users, 
  DollarSign,
  TrendingUp,
  MapPin,
  Star,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface StoreData {
  id: string
  name: string
  owner: string
  category: string
  location: string
  revenue: number
  products: number
  orders: number
  rating: number
  status: 'active' | 'pending' | 'suspended'
  joinDate: string
  commission: number
}

interface StoreStats {
  totalStores: number
  activeStores: number
  pendingApproval: number
  totalRevenue: number
  averageRating: number
}

export default function StoresPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stores, setStores] = useState<StoreData[]>([])
  const [stats, setStats] = useState<StoreStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    // Simulate loading store data
    const timer = setTimeout(() => {
      setStats({
        totalStores: 1247,
        activeStores: 1156,
        pendingApproval: 43,
        totalRevenue: 12450000,
        averageRating: 4.6
      })

      setStores([
        {
          id: '1',
          name: 'متجر مواد البناء الحديث',
          owner: 'أحمد المحمد',
          category: 'مواد البناء',
          location: 'الرياض',
          revenue: 245000,
          products: 156,
          orders: 89,
          rating: 4.8,
          status: 'active',
          joinDate: '2023-06-15',
          commission: 24500
        },
        {
          id: '2',
          name: 'أدوات المقاولين المتخصصة',
          owner: 'فاطمة العلي',
          category: 'أدوات ومعدات',
          location: 'جدة',
          revenue: 189000,
          products: 203,
          orders: 67,
          rating: 4.6,
          status: 'active',
          joinDate: '2023-08-20',
          commission: 18900
        },
        {
          id: '3',
          name: 'متجر التصميم الداخلي',
          owner: 'محمد السعد',
          category: 'تصميم داخلي',
          location: 'الدمام',
          revenue: 98000,
          products: 87,
          orders: 34,
          rating: 4.3,
          status: 'pending',
          joinDate: '2024-01-10',
          commission: 9800
        },
        {
          id: '4',
          name: 'معرض الخزف والسيراميك',
          owner: 'سارة الزهراني',
          category: 'تشطيبات',
          location: 'الرياض',
          revenue: 156000,
          products: 134,
          orders: 56,
          rating: 4.9,
          status: 'active',
          joinDate: '2023-11-05',
          commission: 15600
        },
        {
          id: '5',
          name: 'مركز الأنظمة الذكية',
          owner: 'خالد البراك',
          category: 'أنظمة ذكية',
          location: 'الخبر',
          revenue: 78000,
          products: 45,
          orders: 23,
          rating: 4.1,
          status: 'suspended',
          joinDate: '2023-09-12',
          commission: 7800
        }
      ])

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || store.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط'
      case 'pending':
        return 'بانتظار الموافقة'
      case 'suspended':
        return 'معلق'
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default' as const
      case 'pending':
        return 'secondary' as const
      case 'suspended':
        return 'destructive' as const
      default:
        return 'secondary' as const
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">جارٍ تحميل بيانات المتاجر...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المتاجر</h1>
          <p className="text-muted-foreground">إدارة ومتابعة جميع المتاجر المسجلة في منصة بنّا</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('إضافة متجر جديد')}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة متجر
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المتاجر</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStores.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">متجر مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتاجر النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.activeStores.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">متجر نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بانتظار الموافقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">متجر جديد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRevenue.toLocaleString('ar-SA')} ريال</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">تقييم المتاجر</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            أداء ممتاز للمتاجر
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p>تحقق المتاجر على المنصة أداءً متميزاً بمتوسط تقييم {stats?.averageRating}/5 ونمو مستمر في المبيعات والإيرادات.</p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="stores">قائمة المتاجر</TabsTrigger>
          <TabsTrigger value="categories">التصنيفات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أفضل المتاجر أداءً</CardTitle>
                <CardDescription>المتاجر الأعلى مبيعاً وتقييماً</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stores.filter(store => store.status === 'active').slice(0, 4).map((store, index) => (
                  <div key={store.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-muted-foreground">{store.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{store.revenue.toLocaleString('ar-SA')} ريال</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{store.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التوزيع الجغرافي</CardTitle>
                <CardDescription>توزيع المتاجر حسب المدن</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { city: 'الرياض', stores: 456, percentage: 37 },
                  { city: 'جدة', stores: 342, percentage: 27 },
                  { city: 'الدمام', stores: 198, percentage: 16 },
                  { city: 'مكة المكرمة', stores: 134, percentage: 11 },
                  { city: 'المدينة المنورة', stores: 117, percentage: 9 }
                ].map((city, index) => (
                  <div key={city.city} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{city.city}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${city.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{city.stores} متجر</span>
                      <span className="text-sm font-medium">{city.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المتاجر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="pending">بانتظار الموافقة</option>
              <option value="suspended">معلق</option>
            </select>
            <Button variant="outline" onClick={() => alert('Button clicked')}>
              <Filter className="h-4 w-4 ml-2" />
              تصفية متقدمة
            </Button>
          </div>

          {/* Stores List */}
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <Card key={store.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        {getStatusIcon(store.status)}
                      </div>
                      <p className="text-muted-foreground mb-2">المالك: {store.owner}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {store.location}
                        </span>
                        <span>{store.category}</span>
                        <span>انضم في {store.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <Badge variant={getStatusVariant(store.status)}>
                      {getStatusText(store.status)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{store.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">الإيرادات</p>
                    <p className="font-semibold">{store.revenue.toLocaleString('ar-SA')} ريال</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المنتجات</p>
                    <p className="font-semibold">{store.products}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الطلبات</p>
                    <p className="font-semibold">{store.orders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">العمولة</p>
                    <p className="font-semibold">{store.commission.toLocaleString('ar-SA')} ريال</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => alert(`عرض تفاصيل ${store.name}`)}>
                    <Eye className="h-3 w-3 ml-1" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => alert(`تعديل ${store.name}`)}>
                    <Edit className="h-3 w-3 ml-1" />
                    تعديل
                  </Button>
                  {store.status === 'pending' && (
                    <Button size="sm" onClick={() => alert(`الموافقة على ${store.name}`)}>
                      <CheckCircle className="h-3 w-3 ml-1" />
                      موافقة
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تصنيفات المتاجر</CardTitle>
              <CardDescription>توزيع المتاجر حسب التصنيفات المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { category: 'مواد البناء', stores: 456, revenue: 4500000, growth: 12 },
                  { category: 'أدوات ومعدات', stores: 298, revenue: 2800000, growth: 8 },
                  { category: 'تشطيبات', stores: 187, revenue: 2200000, growth: 15 },
                  { category: 'تصميم داخلي', stores: 156, revenue: 1800000, growth: 18 },
                  { category: 'أنظمة ذكية', stores: 89, revenue: 1200000, growth: 22 },
                  { category: 'خدمات مقاولين', stores: 61, revenue: 950000, growth: 10 }
                ].map((cat, index) => (
                  <div key={cat.category} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{cat.category}</h3>
                      <Badge variant={cat.growth > 15 ? "default" : "secondary"}>
                        +{cat.growth}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">عدد المتاجر:</span>
                        <span className="font-medium">{cat.stores}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">الإيرادات:</span>
                        <span className="font-medium">{cat.revenue.toLocaleString('ar-SA')} ريال</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تحليلات المتاجر</CardTitle>
              <CardDescription>رؤى وإحصائيات تفصيلية حول أداء المتاجر</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">تحليلات متقدمة للمتاجر قريباً</p>
                <Button onClick={() => alert('طلب تحليل مخصص')}>
                  طلب تحليل مخصص
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}




