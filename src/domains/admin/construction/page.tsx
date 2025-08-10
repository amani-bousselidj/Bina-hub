'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/Progress'
import { Input } from '@/components/ui/Input'
import { 

  Hammer, 
  Building, 
  Thermometer, 
  Cloud, 
  Users, 
  Package,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Star,
  Search,
  Filter
} from 'lucide-react'

// Force dynamic rendering to avoid SSG auth context issues
import { ConstructionEcosystemManager } from '@/core/shared/services/construction/construction-ecosystem-manager'


export const dynamic = 'force-dynamic'
interface MaterialData {
  id: string
  name: string
  category: string
  specifications: string[]
  suppliers: number
  avgPrice: number
  climateRating: number
  availability: 'high' | 'medium' | 'low'
  seasonal: boolean
}

interface ContractorData {
  id: string
  name: string
  specialization: string[]
  rating: number
  projectsCompleted: number
  location: string
  verified: boolean
  priceRange: string
}

interface WeatherData {
  temperature: number
  humidity: number
  sandstormRisk: 'low' | 'medium' | 'high'
  constructionSuitability: number
  recommendations: string[]
}

export default function ConstructionEcosystemPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [materials, setMaterials] = useState<MaterialData[]>([])
  const [contractors, setContractors] = useState<ContractorData[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeConstructionData = async () => {
      try {
        const ecosystemManager = new ConstructionEcosystemManager()
        
        // Mock data - in real implementation, this would come from the manager
        const mockMaterials: MaterialData[] = [
          {
            id: '1',
            name: 'كتل العزل الحراري',
            category: 'العزل',
            specifications: ['مقاومة درجات الحرارة العالية', 'مقاوم للرطوبة', 'مقاوم للحريق'],
            suppliers: 12,
            avgPrice: 45,
            climateRating: 95,
            availability: 'high',
            seasonal: false
          },
          {
            id: '2',
            name: 'خرسانة مقاومة للرمال',
            category: 'الأساسات',
            specifications: ['متانة محسّنة', 'مقاومة تسرب الرمال', 'ضغط عالي'],
            suppliers: 8,
            avgPrice: 320,
            climateRating: 90,
            availability: 'medium',
            seasonal: true
          },
          {
            id: '3',
            name: 'أسقف محمية من الأشعة فوق البنفسجية',
            category: 'الأسقف',
            specifications: ['حماية من الأشعة فوق البنفسجية', 'عكس الحرارة', 'مقاوم للماء'],
            suppliers: 15,
            avgPrice: 89,
            climateRating: 88,
            availability: 'high',
            seasonal: false
          }
        ]

        const mockContractors: ContractorData[] = [
          {
            id: '1',
            name: 'أساتذة البناء الخليجي',
            specialization: ['سكني', 'تجاري', 'بنية تحتية'],
            rating: 4.8,
            projectsCompleted: 156,
            location: 'الرياض',
            verified: true,
            priceRange: '$$-$$$'
          },
          {
            id: '2',
            name: 'خبراء البناء الصحراوي',
            specialization: ['الأساسات', 'التحسين المناخي'],
            rating: 4.6,
            projectsCompleted: 89,
            location: 'جدة',
            verified: true,
            priceRange: '$-$$'
          },
          {
            id: '3',
            name: 'تحالف البناء السعودي',
            specialization: ['مشاريع كبيرة', 'مشاريع حكومية'],
            rating: 4.9,
            projectsCompleted: 203,
            location: 'الدمام',
            verified: true,
            priceRange: '$$$-$$$$'
          }
        ]

        const mockWeather: WeatherData = {
          temperature: 42,
          humidity: 35,
          sandstormRisk: 'low',
          constructionSuitability: 75,
          recommendations: [
            'Morning hours (6-10 AM) optimal for concrete work',
            'Avoid exterior painting during high humidity',
            'Use thermal protection for workers',
            'Schedule foundation work for current conditions'
          ]
        }

        setMaterials(mockMaterials)
        setContractors(mockContractors)
        setWeatherData(mockWeather)
        setLoading(false)
      } catch (error) {
        console.error('Failed to initialize construction data:', error)
        setLoading(false)
      }
    }

    initializeConstructionData()
  }, [])

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building className="h-8 w-8 animate-pulse mx-auto mb-4" />
            <p>جارٍ تحميل نظام البناء المتطور...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">نظام البناء المتطور</h1>
          <p className="text-muted-foreground">إدارة وتوجيه البناء المحسّن لدول الخليج</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <Calendar className="h-4 w-4 ml-2" />
            تخطيط المشروع
          </Button>
          <Button onClick={() => alert('Button clicked')}>
            <Hammer className="h-4 w-4 ml-2" />
            مشروع جديد
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المواد المتاحة</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50,000+</div>
            <p className="text-xs text-muted-foreground">مواصفات محسّنة لدول الخليج</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المقاولون المعتمدون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,000+</div>
            <p className="text-xs text-muted-foreground">عبر منطقة دول الخليج</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">درجة الحرارة الحالية</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData?.temperature}°م</div>
            <p className="text-xs text-muted-foreground">ملاءمة البناء: {weatherData?.constructionSuitability}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع النشطة</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">عبر المملكة العربية السعودية</p>
          </CardContent>
        </Card>
      </div>

      {/* Climate Alert */}
      {weatherData && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Cloud className="h-5 w-5" />
              الظروف المناخية الحالية
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">درجة الحرارة</p>
                <p className="text-lg">{weatherData.temperature}°م</p>
              </div>
              <div>
                <p className="text-sm font-medium">الرطوبة</p>
                <p className="text-lg">{weatherData.humidity}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">خطر العواصف الرملية</p>
                <Badge variant={weatherData.sandstormRisk === 'low' ? 'default' : 'destructive'}>
                  {weatherData.sandstormRisk === 'low' ? 'منخفض' : weatherData.sandstormRisk === 'medium' ? 'متوسط' : 'عالي'}
                </Badge>
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">توصيات البناء لليوم:</p>
              <ul className="space-y-1">
                {weatherData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="materials">المواد</TabsTrigger>
          <TabsTrigger value="contractors">المقاولون</TabsTrigger>
          <TabsTrigger value="guidance">دليل البناء</TabsTrigger>
          <TabsTrigger value="projects">المشاريع</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>فئات المواد</CardTitle>
                <CardDescription>أكثر مواد البناء شيوعاً حسب التقييم المناخي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['العزل', 'الأساسات', 'الأسقف', 'الأرضيات', 'الواجهات الخارجية'].map((category, index) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={95 - index * 5} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">{95 - index * 5}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أفضل المقاولين</CardTitle>
                <CardDescription>شركاء البناء الأعلى تقييماً</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contractors.slice(0, 3).map((contractor) => (
                  <div key={contractor.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{contractor.name}</p>
                      <p className="text-sm text-muted-foreground">{contractor.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{contractor.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{contractor.projectsCompleted} مشروع</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المواد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" onClick={() => alert('Button clicked')}>
              <Filter className="h-4 w-4 ml-2" />
              تصفية
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <CardDescription>{material.category}</CardDescription>
                    </div>
                    <Badge variant={material.availability === 'high' ? 'default' : 'secondary'}>
                      {material.availability === 'high' ? 'عالي' : material.availability === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>التقييم المناخي</span>
                      <span>{material.climateRating}%</span>
                    </div>
                    <Progress value={material.climateRating} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">المواصفات:</p>
                    {material.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {spec}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">{material.suppliers} مورد</p>
                      <p className="font-medium">{material.avgPrice} ريال/وحدة</p>
                    </div>
                    <Button size="sm" onClick={() => alert('Button clicked')}>عرض التفاصيل</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المقاولين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" onClick={() => alert('Button clicked')}>
              <Filter className="h-4 w-4 ml-2" />
              تصفية حسب الموقع
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContractors.map((contractor) => (
              <Card key={contractor.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {contractor.name}
                        {contractor.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {contractor.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{contractor.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{contractor.priceRange}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">التخصصات:</p>
                    <div className="flex flex-wrap gap-1">
                      {contractor.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {contractor.projectsCompleted} مشروع مكتمل
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>عرض المشاريع</Button>
                      <Button size="sm" onClick={() => alert('Button clicked')}>طلب عرض سعر</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>نظام إرشادات البناء للمملكة العربية السعودية</CardTitle>
              <CardDescription>توصيات البناء المحسّنة مناخياً لمنطقة الخليج</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  phase: 'تخطيط الأساسات',
                  recommendations: [
                    'استخدام خليط الخرسانة المقاوم للرمال لمتانة محسّنة',
                    'تطبيق حواجز الرطوبة المناسبة للحماية من الرطوبة العالية',
                    'اعتبار تمدد التربة الموسمي في حسابات عمق الأساسات'
                  ],
                  climateFactors: ['تركيب التربة', 'الرطوبة الموسمية', 'تسلل الرمال']
                },
                {
                  phase: 'الهيكل الإنشائي',
                  recommendations: [
                    'اختيار الفولاذ بطلاء مقاوم للتآكل للمناطق الساحلية',
                    'تطبيق مفاصل التمدد الحراري لتغيرات درجة الحرارة الشديدة',
                    'استخدام وصلات معززة لمقاومة العواصف الرملية'
                  ],
                  climateFactors: ['درجات الحرارة القصوى', 'تآكل الرطوبة', 'أحمال الرياح']
                },
                {
                  phase: 'العزل والحماية',
                  recommendations: [
                    'تركيب عزل حراري عالي الأداء (الحد الأدنى R-30)',
                    'استخدام مواد أسقف عاكسة لتقليل امتصاص الحرارة',
                    'تطبيق أنظمة تهوية مناسبة للتحكم في الرطوبة'
                  ],
                  climateFactors: ['الحرارة الشديدة', 'التحكم في الرطوبة', 'كفاءة الطاقة']
                }
              ].map((guidance, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">{guidance.phase}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">التوصيات:</p>
                      <ul className="space-y-1">
                        {guidance.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">العوامل المناخية:</p>
                      <div className="flex flex-wrap gap-1">
                        {guidance.climateFactors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مشاريع البناء النشطة</CardTitle>
              <CardDescription>مراقبة المشاريع الجارية عبر المنطقة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">واجهة إدارة المشاريع قريباً</p>
                <Button onClick={() => alert('Button clicked')}>
                  <Calendar className="h-4 w-4 ml-2" />
                  جدولة جلسة تخطيط المشروع
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}









