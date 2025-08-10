'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui';
import { 
  ArrowRight,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Edit,
  Upload,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function EditMarketplaceVendorPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendorData, setVendorData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    region: '',
    establishedYear: '',
    businessType: '',
    specialization: [] as string[],
    description: '',
    website: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    services: [] as string[],
    workingHours: '',
    licenseNumber: '',
    taxNumber: '',
    bankAccount: '',
    status: 'active'
  });

  const businessTypes = [
    'مقاولات عامة',
    'مقاولات متخصصة',
    'استشارات هندسية',
    'تصميم معماري',
    'مورد مواد بناء',
    'معدات وآلات',
    'خدمات صيانة',
    'أخرى'
  ];

  const specializationOptions = [
    'بناء المباني السكنية',
    'المشاريع التجارية',
    'المشاريع الصناعية',
    'التشطيبات الداخلية',
    'التشطيبات الخارجية',
    'أعمال الكهرباء',
    'أعمال السباكة',
    'أعمال التكييف',
    'أعمال الحدائق',
    'أعمال الأسفلت'
  ];

  const serviceOptions = [
    'تصميم وتخطيط المباني',
    'أعمال الحفر والأساسات',
    'البناء والهيكل الخرساني',
    'أعمال التشطيبات',
    'تركيب الأنظمة الكهربائية',
    'تركيب الأنظمة الصحية',
    'أعمال العزل',
    'أعمال الدهان',
    'تركيب النوافذ والأبواب',
    'أعمال البلاط والأرضيات'
  ];

  useEffect(() => {
    // Simulate loading vendor data
    setTimeout(() => {
      setVendorData({
        name: 'شركة البناء المتقدم',
        businessName: 'شركة البناء المتقدم للمقاولات',
        email: 'info@advanced-construction.com',
        phone: '+966 50 123 4567',
        whatsapp: '+966 50 123 4567',
        address: 'شارع الملك فهد، حي العليا، الرياض 12345',
        city: 'الرياض',
        region: 'منطقة الرياض',
        establishedYear: '2018',
        businessType: 'مقاولات عامة',
        specialization: ['بناء المباني السكنية', 'المشاريع التجارية'],
        description: 'شركة متخصصة في أعمال البناء والمقاولات العامة مع خبرة تزيد عن 15 عاماً',
        website: 'www.advanced-construction.com',
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        },
        services: ['تصميم وتخطيط المباني', 'أعمال الحفر والأساسات', 'البناء والهيكل الخرساني'],
        workingHours: 'من 8 صباحاً إلى 6 مساءً',
        licenseNumber: '1234567890',
        taxNumber: '123456789012345',
        bankAccount: 'SA1234567890123456789012',
        status: 'active'
      });
      setLoading(false);
    }, 1000);
  }, [vendorId]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setVendorData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setVendorData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayToggle = (field: string, value: string) => {
    setVendorData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      const isArrayField = Array.isArray(currentArray);
      
      if (!isArrayField) return prev;
      
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((item: string) => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success('تم حفظ بيانات المورد بنجاح');
      router.push(`/store/marketplace-vendors/${vendorId}`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6" dir="rtl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/store/marketplace-vendors/${vendorId}`)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تعديل بيانات المورد</h1>
            <p className="text-gray-600">تحديث معلومات {vendorData.name}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المورد *</Label>
              <Input
                id="name"
                value={vendorData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">الاسم التجاري</Label>
              <Input
                id="businessName"
                value={vendorData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الشركة</Label>
            <Textarea
              id="description"
              value={vendorData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>نوع النشاط</Label>
              <Select value={vendorData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع النشاط" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="establishedYear">سنة التأسيس</Label>
              <Input
                id="establishedYear"
                type="number"
                value={vendorData.establishedYear}
                onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                min="1980"
                max="2025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            معلومات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={vendorData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={vendorData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">رقم الواتساب</Label>
              <Input
                id="whatsapp"
                value={vendorData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <Input
                id="website"
                value={vendorData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان *</Label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                value={vendorData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="pr-10"
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                value={vendorData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">المنطقة</Label>
              <Input
                id="region"
                value={vendorData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>التخصصات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specializationOptions.map((spec) => (
              <div key={spec} className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id={`spec-${spec}`}
                  checked={vendorData.specialization.includes(spec)}
                  onChange={() => handleArrayToggle('specialization', spec)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`spec-${spec}`} className="text-sm">
                  {spec}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>الخدمات المقدمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <div key={service} className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id={`service-${service}`}
                  checked={vendorData.services.includes(service)}
                  onChange={() => handleArrayToggle('services', service)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`service-${service}`} className="text-sm">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            التفاصيل التجارية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">رقم السجل التجاري</Label>
              <Input
                id="licenseNumber"
                value={vendorData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">الرقم الضريبي</Label>
              <Input
                id="taxNumber"
                value={vendorData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bankAccount">رقم الحساب البنكي (IBAN)</Label>
              <Input
                id="bankAccount"
                value={vendorData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours">ساعات العمل</Label>
              <Input
                id="workingHours"
                value={vendorData.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>حالة المورد</Label>
            <Select value={vendorData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="facebook">فيسبوك</Label>
              <Input
                id="facebook"
                value={vendorData.socialMedia.facebook}
                onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">تويتر</Label>
              <Input
                id="twitter"
                value={vendorData.socialMedia.twitter}
                onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                placeholder="https://twitter.com/youraccount"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="instagram">إنستغرام</Label>
              <Input
                id="instagram"
                value={vendorData.socialMedia.instagram}
                onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                placeholder="https://instagram.com/youraccount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">لينكد إن</Label>
              <Input
                id="linkedin"
                value={vendorData.socialMedia.linkedin}
                onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle>الوثائق المطلوبة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>السجل التجاري</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">اسحب الملف هنا أو انقر لاختيار</p>
                <Button variant="outline" size="sm" className="mt-2">
                  اختيار الملف
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>الشهادة الضريبية</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">اسحب الملف هنا أو انقر لاختيار</p>
                <Button variant="outline" size="sm" className="mt-2">
                  اختيار الملف
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

