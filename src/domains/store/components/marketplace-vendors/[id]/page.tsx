'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { 
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  MessageSquare,
  Building,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

export default function MarketplaceVendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params?.id as string;

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock vendor data - in real app, fetch from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockVendor = {
        id: vendorId,
        name: 'شركة البناء المتقدم',
        businessName: 'شركة البناء المتقدم للمقاولات',
        email: 'info@advanced-construction.com',
        phone: '+966 50 123 4567',
        whatsapp: '+966 50 123 4567',
        address: 'شارع الملك فهد، حي العليا، الرياض 12345',
        city: 'الرياض',
        region: 'منطقة الرياض',
        establishedYear: 2018,
        businessType: 'مقاولات عامة',
        specialization: ['بناء المباني السكنية', 'المشاريع التجارية', 'التشطيبات'],
        rating: 4.8,
        reviewsCount: 156,
        totalProjects: 89,
        activeProjects: 12,
        completedProjects: 77,
        totalRevenue: 2450000,
        joinDate: '2023-03-15',
        status: 'active',
        verified: true,
        documents: {
          commercialLicense: 'verified',
          taxCertificate: 'verified',
          insurance: 'verified',
          qualityManagement: 'verified'
        },
        portfolio: [
          {
            id: 1,
            title: 'فيلا العائلة الكريمة',
            image: '/images/portfolio1.jpg',
            type: 'مشروع سكني',
            completionDate: '2024-05-20',
            value: 850000
          },
          {
            id: 2,
            title: 'مجمع الأعمال التجاري',
            image: '/images/portfolio2.jpg',
            type: 'مشروع تجاري',
            completionDate: '2024-03-10',
            value: 1200000
          }
        ],
        services: [
          'تصميم وتخطيط المباني',
          'أعمال الحفر والأساسات',
          'البناء والهيكل الخرساني',
          'أعمال التشطيبات الداخلية',
          'أعمال التشطيبات الخارجية',
          'تركيب الأنظمة الكهربائية',
          'تركيب الأنظمة الصحية'
        ],
        recentOrders: [
          {
            id: 'ORD-2024-001',
            customerName: 'أحمد محمد السالم',
            projectType: 'فيلا سكنية',
            value: 450000,
            date: '2024-07-15',
            status: 'in_progress'
          },
          {
            id: 'ORD-2024-002',
            customerName: 'شركة التطوير الحديث',
            projectType: 'مبنى إداري',
            value: 780000,
            date: '2024-07-10',
            status: 'completed'
          }
        ],
        performance: {
          onTimeDelivery: 96,
          customerSatisfaction: 94,
          qualityScore: 98,
          responseTime: '2 ساعات'
        }
      };
      
      setVendor(mockVendor);
      setLoading(false);
    }, 1000);
  }, [vendorId]);

  const handleEdit = () => {
    router.push(`/store/marketplace-vendors/${vendorId}/edit`);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      toast.success('تم حذف المورد بنجاح');
      router.push('/store/marketplace-vendors');
    }
  };

  const handleContact = () => {
    toast.info('سيتم فتح تطبيق WhatsApp');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'موقوف';
      default: return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'pending': return 'في الانتظار';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6" dir="rtl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center" dir="rtl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">المورد غير موجود</h1>
        <Button onClick={() => router.push('/store/marketplace-vendors')}>
          <ArrowRight className="h-4 w-4 mr-2" />
          العودة للموردين
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/store/marketplace-vendors')}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
            <p className="text-gray-600">{vendor.businessName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleContact}>
            <MessageSquare className="h-4 w-4 mr-2" />
            تواصل واتساب
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            حذف
          </Button>
        </div>
      </div>

      {/* Vendor Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              معلومات المورد
            </span>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(vendor.status)}>
                {getStatusText(vendor.status)}
              </Badge>
              {vendor.verified && (
                <Badge className="bg-blue-100 text-blue-800">
                  موثق
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">معلومات الاتصال</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{vendor.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">منذ {vendor.establishedYear}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">التخصصات</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specialization.map((spec: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">التقييمات</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{vendor.rating}/5</span>
                  <span className="text-sm text-gray-500">({vendor.reviewsCount} تقييم)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{vendor.totalProjects} مشروع إجمالي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">انضم في {new Date(vendor.joinDate).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">المشاريع النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{vendor.activeProjects}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مشروع قيد التنفيذ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">المشاريع المكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{vendor.completedProjects}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مشروع مكتمل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{vendor.totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">التسليم في الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{vendor.performance.onTimeDelivery}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">معدل الالتزام بالمواعيد</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>الخدمات المقدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vendor.services.map((service: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendor.recentOrders.map((order: any) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{order.id}</h4>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <Badge className={getOrderStatusColor(order.status)}>
                      {getOrderStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{order.projectType}</span>
                    <span className="font-medium text-green-600">
                      {order.value.toLocaleString()} ر.س
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(order.date).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>أعمال سابقة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendor.portfolio.map((project: any) => (
              <div key={project.id} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-2">{project.title}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{project.type}</p>
                    <p>اكتمل في: {new Date(project.completionDate).toLocaleDateString('ar-SA')}</p>
                    <p className="font-medium text-green-600">
                      {project.value.toLocaleString()} ر.س
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents Status */}
      <Card>
        <CardHeader>
          <CardTitle>حالة الوثائق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(vendor.documents).map(([doc, status]) => (
              <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">
                  {doc === 'commercialLicense' && 'السجل التجاري'}
                  {doc === 'taxCertificate' && 'شهادة ضريبية'}
                  {doc === 'insurance' && 'التأمين'}
                  {doc === 'qualityManagement' && 'شهادة جودة'}
                </span>
                <Badge className={status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {status === 'verified' ? 'موثق' : 'قيد المراجعة'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

