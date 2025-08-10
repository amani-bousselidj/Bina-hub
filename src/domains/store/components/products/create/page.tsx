"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { CategoryService } from '@/domains/store/services/CategoryService';

export default function CreateProductPage() {
const supabase = createClientComponentClient();
const { user } = useAuth();
const categoryService = new CategoryService();

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{value: string, label: string}>>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sku: '',
    price: '',
    costPrice: '',
    category: '',
    status: 'draft',
    tags: [] as string[],
    images: [] as string[],
    inventory: {
      trackQuantity: true,
      quantity: 0,
      lowStockAlert: 10
    },
    dimensions: {
      weight: '',
      length: '',
      width: '',
      height: ''
    }
  })
  const [newTag, setNewTag] = useState('')

  // Load categories from Supabase
  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true)
      try {
        const { data, error } = await categoryService.getStoreCategories()
        if (data) {
          setCategories(data.map(cat => ({ value: cat.value, label: cat.label })))
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate product ID
      const productId = `PRD-${Date.now()}`
      const newProduct = {
        id: productId,
        user_id: user?.id || null,
        ...formData,
        price: parseFloat(formData.price),
        cost_price: parseFloat(formData.costPrice),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      // Save to Supabase
      const { error } = await supabase.from('store_products').insert([newProduct]);
      if (error) throw error;
      // Redirect to products list with success message
      router.push('/store/products?created=true')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('حدث خطأ أثناء إنشاء المنتج')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
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
          <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المنتج *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="أدخل اسم المنتج"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وصف المنتج
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف تفصيلي للمنتج..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رمز المنتج (SKU) *
                      </label>
                      <Input
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="SKU-12345"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        التصنيف
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التصنيف" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>التسعير</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        سعر البيع (ريال) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        سعر التكلفة (ريال)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>العلامات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="أضف علامة جديدة"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>حالة المنتج</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>المخزون</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الكمية المتوفرة
                    </label>
                    <Input
                      type="number"
                      value={formData.inventory.quantity}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, quantity: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تنبيه نقص المخزون
                    </label>
                    <Input
                      type="number"
                      value={formData.inventory.lowStockAlert}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, lowStockAlert: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>صور المنتج</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">اسحب الصور هنا أو انقر لاختيارها</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      اختر الصور
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

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
              disabled={!formData.title || !formData.sku || !formData.price}
            >
              {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}




