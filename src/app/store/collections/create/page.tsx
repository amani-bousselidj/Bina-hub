"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, FolderPlus, Tag } from 'lucide-react'
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function CreateCollectionPage() {
const supabase = createClientComponentClient();
const { user } = useAuth();

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    handle: '',
    description: '',
    status: 'draft',
    type: 'manual',
    visibility: 'public',
    seoTitle: '',
    seoDescription: '',
    metafields: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate collection ID
      const collectionId = `COL-${Date.now()}`
      const newCollection = {
        id: collectionId,
        user_id: user?.id || null,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        products_count: 0
      }
      // Save to Supabase
      const { error } = await supabase.from('store_collections').insert([newCollection]);
      if (error) throw error;
      // Redirect to collections list with success message
      router.push('/store/collections?created=true')
    } catch (error) {
      console.error('Error creating collection:', error)
      alert('حدث خطأ أثناء إنشاء المجموعة')
    } finally {
      setLoading(false)
    }
  }

  const generateHandle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      handle: generateHandle(title)
    }))
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
          <FolderPlus className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">إنشاء مجموعة جديدة</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    اسم المجموعة *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="مثال: مواد البناء الحديثة"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    معرف المجموعة (Handle)
                  </label>
                  <Input
                    value={formData.handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="modern-construction-materials"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    سيتم استخدامه في الرابط: /collections/{formData.handle}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الوصف
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف المجموعة ومحتوياتها..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>إعدادات محركات البحث (SEO)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    عنوان SEO
                  </label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="عنوان محسن لمحركات البحث"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoTitle.length}/60 حرف
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    وصف SEO
                  </label>
                  <Textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="وصف مختصر لمحركات البحث..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seoDescription.length}/160 حرف
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المجموعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الحالة
                  </label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع المجموعة
                  </label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">يدوي</SelectItem>
                      <SelectItem value="automated">تلقائي</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.type === 'manual' 
                      ? 'إضافة المنتجات يدوياً' 
                      : 'إضافة المنتجات تلقائياً حسب الشروط'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الرؤية
                  </label>
                  <Select 
                    value={formData.visibility} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">عام</SelectItem>
                      <SelectItem value="private">خاص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !formData.title}
                  >
                    {loading ? 'جارٍ الإنشاء...' : 'إنشاء المجموعة'}
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
