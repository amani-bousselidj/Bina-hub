'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { ArrowLeft, MapPin, Building, Image } from 'lucide-react';

export default function UnifiedProjectWizard() {
  const router = useRouter();
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    projectType: 'residential' as 'residential' | 'commercial' | 'industrial',
  });

  const saveProject = async () => {
    if (!form.name.trim()) {
      setError('يرجى إدخال اسم المشروع');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,  // Use 'name' field which matches the database schema
        description: form.description,
        status: 'planning',
        location: form.location,
        budget: 0,
        type: form.projectType,  // Use 'type' field
        // Add coordinates if provided
        ...(form.latitude && { latitude: parseFloat(form.latitude) }),
        ...(form.longitude && { longitude: parseFloat(form.longitude) }),
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || res.statusText);
      }

      const data = await res.json();
      
      if (data?.project?.id) {
        router.push(`/user/projects/${data.project.id}`);
      } else {
        router.push('/user/projects');
      }
    } catch (e: any) {
      setError(e?.message || 'تعذر حفظ المشروع');
    } finally {
      setSaving(false);
    }
  };

  const isValid = form.name.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> رجوع
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">إنشاء مشروع جديد</h1>
            <p className="text-sm text-gray-600">بيانات أساسية للمشروع</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" /> بيانات المشروع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
                <Input 
                  value={form.name} 
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                  placeholder="مثال: فيلا عائلية في الرياض" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نوع المشروع</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={form.projectType} 
                  onChange={e => setForm(p => ({ ...p, projectType: e.target.value as any }))}
                >
                  <option value="residential">سكني</option>
                  <option value="commercial">تجاري</option>
                  <option value="industrial">صناعي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الموقع</label>
                <Input 
                  value={form.location} 
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))} 
                  placeholder="مثال: الرياض - حي الياسمين" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">خط العرض (Latitude)</label>
                  <Input 
                    value={form.latitude} 
                    onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))} 
                    placeholder="24.774265" 
                    type="number"
                    step="any"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">خط الطول (Longitude)</label>
                  <Input 
                    value={form.longitude} 
                    onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))} 
                    placeholder="46.738586" 
                    type="number"
                    step="any"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">وصف المشروع</label>
                <Textarea 
                  rows={4} 
                  value={form.description} 
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} 
                  placeholder="وصف مختصر عن المشروع ومتطلباته..." 
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">صورة المشروع (اختيارية)</span>
                </div>
                <p className="text-sm text-blue-700">يمكنك إضافة صورة للمشروع لاحقًا من صفحة إعدادات المشروع.</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={saveProject} 
                disabled={!isValid || saving}
                className="flex-1"
              >
                {saving ? 'جاري الحفظ...' : 'إنشاء المشروع'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                disabled={saving}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
