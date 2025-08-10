"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Percent, Calendar, Target } from 'lucide-react'
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function CreatePromotionPage() {
const supabase = createClientComponentClient();
const { user } = useAuth();

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    type: 'percentage',
    value: '',
    minimumAmount: '',
    maximumDiscount: '',
    usageLimit: '',
    usageCount: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    applicableProducts: 'all',
    applicableCustomers: 'all',
    stackable: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate promotion ID
      const promotionId = `PROMO-${Date.now()}`
      const newPromotion = {
        id: promotionId,
        user_id: user?.id || null,
        ...formData,
        value: parseFloat(formData.value),
        minimum_amount: formData.minimumAmount ? parseFloat(formData.minimumAmount) : null,
        maximum_discount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount) : null,
        usage_limit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      // Save to Supabase
      const { error } = await supabase.from('store_promotions').insert([newPromotion]);
      if (error) throw error;
      // Redirect to promotions list with success message
      router.push('/store/promotions?created=true')
    } catch (error) {
      console.error('Error creating promotion:', error)
      alert('حدث خطأ أثناء إنشاء العرض')
    } finally {
      setLoading(false)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, code: result }))
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة
        </Button>
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">إنشاء عرض ترويجي جديد</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    اسم العرض *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="مثال: خصم خاص على مواد البناء"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الوصف
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف العرض وشروطه..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      كود الخصم *
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="SAVE20"
                        required
                        dir="ltr"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateCode}
                      >
                        إنشاء
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      نوع الخصم
                    </label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت (ريال)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {formData.type === 'percentage' ? 'نسبة الخصم (%)' : 'مبلغ الخصم (ريال)'}
                    </label>
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder={formData.type === 'percentage' ? '20' : '100'}
                      min="0"
                      max={formData.type === 'percentage' ? '100' : undefined}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الحد الأدنى للطلب (ريال)
                    </label>
                    <Input
                      type="number"
                      value={formData.minimumAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimumAmount: e.target.value }))}
                      placeholder="500"
                      min="0"
                    />
                  </div>

                  {formData.type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الحد الأقصى للخصم (ريال)
                      </label>
                      <Input
                        type="number"
                        value={formData.maximumDiscount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maximumDiscount: e.target.value }))}
                        placeholder="1000"
                        min="0"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Usage & Timing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  الاستخدام والتوقيت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      تاريخ البداية
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      تاريخ الانتهاء
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    حد الاستخدام
                  </label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    placeholder="اتركه فارغاً للاستخدام غير المحدود"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    عدد المرات التي يمكن استخدام هذا الكود فيها
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Applicability */}
            <Card>
              <CardHeader>
                <CardTitle>نطاق التطبيق</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المنتجات المطبقة
                  </label>
                  <Select 
                    value={formData.applicableProducts} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, applicableProducts: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المنتجات</SelectItem>
                      <SelectItem value="specific">منتجات محددة</SelectItem>
                      <SelectItem value="categories">فئات محددة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    العملاء المطبقة
                  </label>
                  <Select 
                    value={formData.applicableCustomers} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, applicableCustomers: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع العملاء</SelectItem>
                      <SelectItem value="specific">عملاء محددين</SelectItem>
                      <SelectItem value="groups">مجموعات عملاء</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">
                      قابل للتجميع مع عروض أخرى
                    </label>
                    <p className="text-xs text-muted-foreground">
                      يمكن استخدامه مع كودات خصم أخرى
                    </p>
                  </div>
                  <Switch
                    checked={formData.stackable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stackable: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات العرض</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">
                      العرض نشط
                    </label>
                    <p className="text-xs text-muted-foreground">
                      تفعيل أو إلغاء تفعيل العرض
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>ملخص العرض</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>نوع الخصم:</span>
                  <span>{formData.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</span>
                </div>
                <div className="flex justify-between">
                  <span>قيمة الخصم:</span>
                  <span>
                    {formData.value} {formData.type === 'percentage' ? '%' : 'ريال'}
                  </span>
                </div>
                {formData.minimumAmount && (
                  <div className="flex justify-between">
                    <span>الحد الأدنى:</span>
                    <span>{formData.minimumAmount} ريال</span>
                  </div>
                )}
                {formData.usageLimit && (
                  <div className="flex justify-between">
                    <span>حد الاستخدام:</span>
                    <span>{formData.usageLimit} مرة</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !formData.title || !formData.code || !formData.value}
                  >
                    {loading ? 'جارٍ الإنشاء...' : 'إنشاء العرض'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.back()}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
