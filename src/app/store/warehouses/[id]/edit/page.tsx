'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight,
  Save,
  Warehouse,
  MapPin,
  Phone,
  User,
  Package,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function EditWarehousePage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warehouse, setWarehouse] = useState({
    name: '',
    code: '',
    type: '',
    status: 'active',
    manager: '',
    managerPhone: '',
    managerEmail: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    area: '',
    capacity: '',
    operatingHours: {
      start: '',
      end: '',
      workDays: [] as string[]
    },
    facilities: [] as string[],
    zones: [
      { name: '', type: '', capacity: '' }
    ],
    securityFeatures: [] as string[],
    temperatureControlled: false,
    fireProtection: false,
    insurance: {
      provider: '',
      policyNumber: '',
      expiryDate: '',
      coverage: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    notes: ''
  });

  const warehouseTypes = [
    'مستودع رئيسي',
    'مستودع فرعي', 
    'مستودع متخصص',
    'مستودع موسمي',
    'مستودع ترانزيت'
  ];

  const statusOptions = [
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' },
    { value: 'maintenance', label: 'تحت الصيانة' },
    { value: 'renovation', label: 'تحت التجديد' }
  ];

  const regions = [
    'منطقة الرياض',
    'منطقة مكة المكرمة',
    'المنطقة الشرقية',
    'منطقة المدينة المنورة',
    'منطقة القصيم',
    'منطقة حائل',
    'منطقة تبوك',
    'منطقة الحدود الشمالية',
    'منطقة جازان',
    'منطقة نجران',
    'منطقة الباحة',
    'منطقة الجوف',
    'منطقة عسير'
  ];

  const weekDays = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];

  const facilityOptions = [
    'نظام تكييف مركزي',
    'أنظمة إنذار حريق',
    'كاميرات مراقبة 24/7',
    'رافعات شوكية',
    'منطقة تحميل وتفريغ',
    'مكاتب إدارية',
    'غرف استراحة للعمال',
    'مولد كهرباء احتياطي',
    'نظام أمني متطور',
    'مواقف سيارات',
    'مختبر فحص جودة',
    'منطقة الحجر الصحي'
  ];

  const securityOptions = [
    'حراسة أمنية 24/7',
    'نظام بصمات',
    'كاميرات مراقبة HD',
    'أجهزة إنذار ضد السرقة',
    'نظام تتبع الدخول والخروج',
    'حواجز أمنية',
    'إضاءة ليلية',
    'نظام اتصال طوارئ'
  ];

  useEffect(() => {
    // Load warehouse data
    setTimeout(() => {
      const mockData = {
        name: 'مستودع الرياض الرئيسي',
        code: 'RYD-MAIN-001',
        type: 'مستودع رئيسي',
        status: 'active',
        manager: 'أحمد محمد السعيد',
        managerPhone: '+966 50 123 4567',
        managerEmail: 'ahmed.manager@company.com',
        address: 'شارع الصناعية، حي السلي',
        city: 'الرياض',
        region: 'منطقة الرياض',
        postalCode: '12345',
        area: '2500',
        capacity: '5000',
        operatingHours: {
          start: '06:00',
          end: '22:00',
          workDays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
        },
        facilities: [
          'نظام تكييف مركزي',
          'أنظمة إنذار حريق',
          'كاميرات مراقبة 24/7',
          'رافعات شوكية'
        ],
        zones: [
          { name: 'منطقة A', type: 'مواد البناء الثقيلة', capacity: '1500' },
          { name: 'منطقة B', type: 'مواد التشطيب', capacity: '1000' },
          { name: 'منطقة C', type: 'الأدوات والمعدات', capacity: '1500' }
        ],
        securityFeatures: [
          'حراسة أمنية 24/7',
          'نظام بصمات',
          'كاميرات مراقبة HD'
        ],
        temperatureControlled: true,
        fireProtection: true,
        insurance: {
          provider: 'شركة التأمين الوطنية',
          policyNumber: 'INS-2025-001',
          expiryDate: '2025-12-31',
          coverage: '5000000'
        },
        emergencyContact: {
          name: 'خالد أحمد الصالح',
          phone: '+966 50 987 6543',
          relationship: 'مدير العمليات'
        },
        notes: 'مستودع استراتيجي يخدم منطقة الرياض الكبرى. يتطلب صيانة دورية كل 3 أشهر.'
      };
      
      setWarehouse(mockData);
      setLoading(false);
    }, 1000);
  }, [warehouseId]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Validate required fields
      if (!warehouse.name || !warehouse.code || !warehouse.type) {
        toast.error('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('تم حفظ بيانات المستودع بنجاح');
      router.push(`/store/warehouses/${warehouseId}`);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleAddZone = () => {
    setWarehouse(prev => ({
      ...prev,
      zones: [...prev.zones, { name: '', type: '', capacity: '' }]
    }));
  };

  const handleRemoveZone = (index: number) => {
    setWarehouse(prev => ({
      ...prev,
      zones: prev.zones.filter((_, i) => i !== index)
    }));
  };

  const handleZoneChange = (index: number, field: string, value: string) => {
    setWarehouse(prev => ({
      ...prev,
      zones: prev.zones.map((zone, i) => 
        i === index ? { ...zone, [field]: value } : zone
      )
    }));
  };

  const handleWorkDaysChange = (day: string, checked: boolean) => {
    setWarehouse(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        workDays: checked 
          ? [...prev.operatingHours.workDays, day]
          : prev.operatingHours.workDays.filter(d => d !== day)
      }
    }));
  };

  const handleFacilitiesChange = (facility: string, checked: boolean) => {
    setWarehouse(prev => ({
      ...prev,
      facilities: checked 
        ? [...prev.facilities, facility]
        : prev.facilities.filter(f => f !== facility)
    }));
  };

  const handleSecurityChange = (feature: string, checked: boolean) => {
    setWarehouse(prev => ({
      ...prev,
      securityFeatures: checked 
        ? [...prev.securityFeatures, feature]
        : prev.securityFeatures.filter(f => f !== feature)
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6" dir="rtl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/store/warehouses/${warehouseId}`)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تعديل المستودع</h1>
            <p className="text-gray-600">تعديل بيانات ومعلومات المستودع</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المستودع *</Label>
              <Input
                id="name"
                value={warehouse.name}
                onChange={(e) => setWarehouse(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم المستودع"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">كود المستودع *</Label>
              <Input
                id="code"
                value={warehouse.code}
                onChange={(e) => setWarehouse(prev => ({ ...prev, code: e.target.value }))}
                placeholder="مثال: RYD-MAIN-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">نوع المستودع *</Label>
              <Select value={warehouse.type} onValueChange={(value) => setWarehouse(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المستودع" />
                </SelectTrigger>
                <SelectContent>
                  {warehouseTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select value={warehouse.status} onValueChange={(value) => setWarehouse(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            معلومات المدير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="manager">اسم المدير</Label>
              <Input
                id="manager"
                value={warehouse.manager}
                onChange={(e) => setWarehouse(prev => ({ ...prev, manager: e.target.value }))}
                placeholder="اسم مدير المستودع"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerPhone">رقم الهاتف</Label>
              <Input
                id="managerPhone"
                value={warehouse.managerPhone}
                onChange={(e) => setWarehouse(prev => ({ ...prev, managerPhone: e.target.value }))}
                placeholder="+966 50 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerEmail">البريد الإلكتروني</Label>
              <Input
                id="managerEmail"
                type="email"
                value={warehouse.managerEmail}
                onChange={(e) => setWarehouse(prev => ({ ...prev, managerEmail: e.target.value }))}
                placeholder="manager@company.com"
              />
            </div>
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
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Textarea
              id="address"
              value={warehouse.address}
              onChange={(e) => setWarehouse(prev => ({ ...prev, address: e.target.value }))}
              placeholder="العنوان التفصيلي للمستودع"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <Input
                id="city"
                value={warehouse.city}
                onChange={(e) => setWarehouse(prev => ({ ...prev, city: e.target.value }))}
                placeholder="المدينة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">المنطقة</Label>
              <Select value={warehouse.region} onValueChange={(value) => setWarehouse(prev => ({ ...prev, region: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">الرمز البريدي</Label>
              <Input
                id="postalCode"
                value={warehouse.postalCode}
                onChange={(e) => setWarehouse(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            السعة والمساحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="area">المساحة الإجمالية (متر مربع)</Label>
              <Input
                id="area"
                type="number"
                value={warehouse.area}
                onChange={(e) => setWarehouse(prev => ({ ...prev, area: e.target.value }))}
                placeholder="2500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">السعة القصوى (وحدة تخزين)</Label>
              <Input
                id="capacity"
                type="number"
                value={warehouse.capacity}
                onChange={(e) => setWarehouse(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="5000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            ساعات العمل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startTime">وقت البداية</Label>
              <Input
                id="startTime"
                type="time"
                value={warehouse.operatingHours.start}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  operatingHours: { ...prev.operatingHours, start: e.target.value }
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">وقت النهاية</Label>
              <Input
                id="endTime"
                type="time"
                value={warehouse.operatingHours.end}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  operatingHours: { ...prev.operatingHours, end: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>أيام العمل</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {weekDays.map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={warehouse.operatingHours.workDays.includes(day)}
                    onCheckedChange={(checked) => handleWorkDaysChange(day, checked as boolean)}
                  />
                  <Label htmlFor={day} className="text-sm">{day}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>مناطق التخزين</span>
            <Button variant="outline" size="sm" onClick={handleAddZone}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة منطقة
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {warehouse.zones.map((zone, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">منطقة التخزين {index + 1}</h3>
                {warehouse.zones.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRemoveZone(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنطقة</Label>
                  <Input
                    value={zone.name}
                    onChange={(e) => handleZoneChange(index, 'name', e.target.value)}
                    placeholder="مثال: منطقة A"
                  />
                </div>

                <div className="space-y-2">
                  <Label>نوع التخزين</Label>
                  <Input
                    value={zone.type}
                    onChange={(e) => handleZoneChange(index, 'type', e.target.value)}
                    placeholder="مثال: مواد البناء الثقيلة"
                  />
                </div>

                <div className="space-y-2">
                  <Label>السعة</Label>
                  <Input
                    type="number"
                    value={zone.capacity}
                    onChange={(e) => handleZoneChange(index, 'capacity', e.target.value)}
                    placeholder="1500"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>المرافق والخدمات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilityOptions.map(facility => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={warehouse.facilities.includes(facility)}
                  onCheckedChange={(checked) => handleFacilitiesChange(facility, checked as boolean)}
                />
                <Label htmlFor={facility} className="text-sm">{facility}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>الميزات الأمنية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityOptions.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={warehouse.securityFeatures.includes(feature)}
                  onCheckedChange={(checked) => handleSecurityChange(feature, checked as boolean)}
                />
                <Label htmlFor={feature} className="text-sm">{feature}</Label>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="temperatureControlled"
                checked={warehouse.temperatureControlled}
                onCheckedChange={(checked) => setWarehouse(prev => ({ ...prev, temperatureControlled: checked as boolean }))}
              />
              <Label htmlFor="temperatureControlled">مكيف ومتحكم في درجة الحرارة</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fireProtection"
                checked={warehouse.fireProtection}
                onCheckedChange={(checked) => setWarehouse(prev => ({ ...prev, fireProtection: checked as boolean }))}
              />
              <Label htmlFor="fireProtection">نظام مكافحة الحرائق</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات التأمين</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">شركة التأمين</Label>
              <Input
                id="insuranceProvider"
                value={warehouse.insurance.provider}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  insurance: { ...prev.insurance, provider: e.target.value }
                }))}
                placeholder="اسم شركة التأمين"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyNumber">رقم البوليصة</Label>
              <Input
                id="policyNumber"
                value={warehouse.insurance.policyNumber}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  insurance: { ...prev.insurance, policyNumber: e.target.value }
                }))}
                placeholder="INS-2025-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">تاريخ انتهاء التأمين</Label>
              <Input
                id="expiryDate"
                type="date"
                value={warehouse.insurance.expiryDate}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  insurance: { ...prev.insurance, expiryDate: e.target.value }
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverage">مبلغ التغطية (ريال سعودي)</Label>
              <Input
                id="coverage"
                type="number"
                value={warehouse.insurance.coverage}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  insurance: { ...prev.insurance, coverage: e.target.value }
                }))}
                placeholder="5000000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>جهة الاتصال في حالات الطوارئ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">الاسم</Label>
              <Input
                id="emergencyName"
                value={warehouse.emergencyContact.name}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                }))}
                placeholder="اسم جهة الاتصال"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">رقم الهاتف</Label>
              <Input
                id="emergencyPhone"
                value={warehouse.emergencyContact.phone}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
                placeholder="+966 50 987 6543"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">الصفة</Label>
              <Input
                id="relationship"
                value={warehouse.emergencyContact.relationship}
                onChange={(e) => setWarehouse(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                }))}
                placeholder="مدير العمليات"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>ملاحظات إضافية</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={warehouse.notes}
            onChange={(e) => setWarehouse(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="أي ملاحظات أو معلومات إضافية حول المستودع..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={() => router.push(`/store/warehouses/${warehouseId}`)}>
          إلغاء
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>
    </div>
  );
}

