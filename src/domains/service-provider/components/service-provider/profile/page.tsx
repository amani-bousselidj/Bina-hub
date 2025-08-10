'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Building, Award, Calendar } from 'lucide-react';

export default function ServiceProviderProfilePage() {
  const profileData = {
    personalInfo: {
      ownerName: 'أحمد محمد الزهراني',
      businessNameAr: 'شركة البناء الحديث للمقاولات',
      businessNameEn: 'Modern Construction Company',
      email: 'info@modernbuilding.sa',
      phone: '+966501234567',
      city: 'الرياض',
      district: 'حي النرجس',
      address: 'شارع الملك فهد، مجمع النرجس التجاري'
    },
    businessInfo: {
      establishedYear: 2015,
      experienceYears: 10,
      teamSize: 25,
      maxServiceRadius: 50,
      workingHours: {
        from: '08:00',
        to: '17:00'
      },
      workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
    },
    services: {
      specializations: ['البناء', 'التشطيب', 'إدارة المشاريع', 'الاستشارات الهندسية'],
      certifications: ['ISO 9001', 'شهادة المقاولين', 'شهادة السلامة المهنية'],
      serviceDescriptionAr: 'نقدم خدمات البناء والتشييد وإدارة المشاريع بجودة عالية ووفقاً لأحدث المعايير العالمية',
      portfolioItems: 42
    },
    verification: {
      status: 'verified',
      documentsSubmitted: ['commercial-register', 'tax-certificate', 'insurance', 'safety-certificate'],
      verificationDate: '2025-01-15'
    }
  };

  const getVerificationColor = (status: string) => {
    const colors: Record<string, string> = {
      'verified': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'rejected': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getVerificationText = (status: string) => {
    const texts: Record<string, string> = {
      'verified': 'موثق',
      'pending': 'قيد المراجعة',
      'rejected': 'مرفوض'
    };
    return texts[status] || status;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            الملف الشخصي
          </h1>
          <p className="text-gray-600">
            إدارة وتحديث معلومات ملفك الشخصي
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            معاينة الملف العام
          </Button>
          <Button>
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              حالة التوثيق
            </span>
            <Badge className={getVerificationColor(profileData.verification.status)}>
              {getVerificationText(profileData.verification.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">الوثائق المطلوبة:</h4>
              <div className="space-y-2">
                {[
                  { key: 'commercial-register', label: 'السجل التجاري' },
                  { key: 'tax-certificate', label: 'شهادة الزكاة والضريبة' },
                  { key: 'insurance', label: 'شهادة التأمين' },
                  { key: 'safety-certificate', label: 'شهادة السلامة المهنية' }
                ].map((doc) => (
                  <div key={doc.key} className="flex items-center justify-between">
                    <span>{doc.label}</span>
                    <Badge 
                      className={profileData.verification.documentsSubmitted.includes(doc.key) 
                        ? 'bg-green-500' : 'bg-gray-500'}
                    >
                      {profileData.verification.documentsSubmitted.includes(doc.key) ? 'مرفوع' : 'مطلوب'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">معلومات التوثيق:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">تاريخ التوثيق:</span>
                  <div>{new Date(profileData.verification.verificationDate).toLocaleDateString('ar-SA')}</div>
                </div>
                <div>
                  <span className="text-gray-500">الحالة:</span>
                  <div>{getVerificationText(profileData.verification.status)}</div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    رفع وثائق إضافية
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>اسم المالك</Label>
              <Input value={profileData.personalInfo.ownerName} />
            </div>
            <div className="space-y-2">
              <Label>اسم النشاط (عربي)</Label>
              <Input value={profileData.personalInfo.businessNameAr} />
            </div>
            <div className="space-y-2">
              <Label>اسم النشاط (إنجليزي)</Label>
              <Input value={profileData.personalInfo.businessNameEn} />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input type="email" value={profileData.personalInfo.email} />
            </div>
            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <Input value={profileData.personalInfo.phone} />
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              معلومات الموقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>المدينة</Label>
              <Select value={profileData.personalInfo.city}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riyadh">الرياض</SelectItem>
                  <SelectItem value="jeddah">جدة</SelectItem>
                  <SelectItem value="dammam">الدمام</SelectItem>
                  <SelectItem value="mecca">مكة المكرمة</SelectItem>
                  <SelectItem value="medina">المدينة المنورة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الحي</Label>
              <Input value={profileData.personalInfo.district} />
            </div>
            <div className="space-y-2">
              <Label>العنوان التفصيلي</Label>
              <Textarea value={profileData.personalInfo.address} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>نطاق الخدمة (كيلومتر)</Label>
              <Input type="number" value={profileData.businessInfo.maxServiceRadius} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              معلومات النشاط
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>سنة التأسيس</Label>
                <Input type="number" value={profileData.businessInfo.establishedYear} />
              </div>
              <div className="space-y-2">
                <Label>سنوات الخبرة</Label>
                <Input type="number" value={profileData.businessInfo.experienceYears} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>حجم الفريق</Label>
              <Input type="number" value={profileData.businessInfo.teamSize} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ساعات العمل من</Label>
                <Input type="time" value={profileData.businessInfo.workingHours.from} />
              </div>
              <div className="space-y-2">
                <Label>إلى</Label>
                <Input type="time" value={profileData.businessInfo.workingHours.to} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>أيام العمل</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'sunday', label: 'الأحد' },
                  { key: 'monday', label: 'الاثنين' },
                  { key: 'tuesday', label: 'الثلاثاء' },
                  { key: 'wednesday', label: 'الأربعاء' },
                  { key: 'thursday', label: 'الخميس' },
                  { key: 'friday', label: 'الجمعة' },
                  { key: 'saturday', label: 'السبت' }
                ].map((day) => (
                  <label key={day.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.businessInfo.workingDays.includes(day.key)}
                      className="rounded"
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              معلومات الخدمات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>التخصصات</Label>
              <div className="flex flex-wrap gap-2">
                {profileData.services.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline">{spec}</Badge>
                ))}
              </div>
              <Button variant="outline" size="sm">
                إضافة تخصص
              </Button>
            </div>
            <div className="space-y-2">
              <Label>الشهادات</Label>
              <div className="flex flex-wrap gap-2">
                {profileData.services.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    <Award className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm">
                إضافة شهادة
              </Button>
            </div>
            <div className="space-y-2">
              <Label>وصف الخدمات</Label>
              <Textarea 
                value={profileData.services.serviceDescriptionAr}
                rows={4}
                placeholder="اكتب وصفاً شاملاً للخدمات التي تقدمها..."
              />
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">عدد أعمال المعرض:</span>
                <span className="font-medium">{profileData.services.portfolioItems}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          إلغاء التغييرات
        </Button>
        <Button>
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  );
}




