"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, User, Building, Phone, Mail, MapPin } from 'lucide-react'
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function CreateCustomerPage() {
const supabase = createClientComponentClient();
const { user } = useAuth();

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customerType, setCustomerType] = useState<'individual' | 'company'>('individual')
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Company Info (if applicable)
    companyName: '',
    taxNumber: '',
    industry: '',
    
    // Address
    address: {
      street: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'SA'
    },
    
    // Additional Info
    customerGroup: 'regular',
    notes: ''
  })

  const regions = [
    'الرياض', 'مكة المكرمة', 'المنطقة الشرقية', 'عسير', 'المدينة المنورة',
    'القصيم', 'حائل', 'تبوك', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف'
  ]

  const industries = [
    'البناء والتشييد', 'التجارة العامة', 'الصناعة', 'التكنولوجيا', 'الصحة',
    'التعليم', 'السياحة', 'النقل', 'الزراعة', 'الطاقة', 'أخرى'
  ]

  const customerGroups = [
    { value: 'regular', label: 'عادي' },
    { value: 'vip', label: 'مميز' },
    { value: 'wholesale', label: 'تاجر جملة' },
    { value: 'contractor', label: 'مقاول' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate customer ID
      const customerId = `CUST-${Date.now()}`
      const newCustomer = {
        id: customerId,
        user_id: user?.id || null,
        type: customerType,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_orders: 0,
        total_spent: 0
      }
      // Save to Supabase
      const { error } = await supabase.from('store_customers').insert([newCustomer]);
      if (error) throw error;
      // Redirect to customers list with success message
      router.push('/store/customers?created=true')
    } catch (error) {
      console.error('Error creating customer:', error)
      alert('حدث خطأ أثناء إنشاء العميل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">إضافة عميل جديد</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>نوع العميل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={customerType === 'individual' ? 'default' : 'outline'}
                  onClick={() => setCustomerType('individual')}
                  className="flex items-center gap-2 h-16"
                >
                  <User className="w-5 h-5" />
                  فرد
                </Button>
                <Button
                  type="button"
                  variant={customerType === 'company' ? 'default' : 'outline'}
                  onClick={() => setCustomerType('company')}
                  className="flex items-center gap-2 h-16"
                >
                  <Building className="w-5 h-5" />
                  شركة
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {customerType === 'individual' ? 'المعلومات الشخصية' : 'معلومات جهة الاتصال'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأول *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="أدخل الاسم الأول"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأخير *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="أدخل الاسم الأخير"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@domain.com"
                    required
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+966 50 123 4567"
                    required
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Company Information (if company type) */}
            {customerType === 'company' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    معلومات الشركة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الشركة *
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="أدخل اسم الشركة"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الرقم الضريبي
                    </label>
                    <Input
                      value={formData.taxNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxNumber: e.target.value }))}
                      placeholder="123456789012345"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      القطاع
                    </label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القطاع" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Group (if individual type) */}
            {customerType === 'individual' && (
              <Card>
                <CardHeader>
                  <CardTitle>مجموعة العميل</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.customerGroup}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerGroup: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customerGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                العنوان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الشارع
                </label>
                <Input
                  value={formData.address.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  placeholder="أدخل عنوان الشارع"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المدينة
                  </label>
                  <Input
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="المدينة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المنطقة
                  </label>
                  <Select
                    value={formData.address.region}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      address: { ...prev.address, region: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنطقة" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الرمز البريدي
                  </label>
                  <Input
                    value={formData.address.postalCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      address: { ...prev.address, postalCode: e.target.value }
                    }))}
                    placeholder="12345"
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
            >
              {loading ? 'جاري الحفظ...' : 'حفظ العميل'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
