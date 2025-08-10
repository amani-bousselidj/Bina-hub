'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { AlertTriangle, ArrowLeft, CheckCircle, FileText, Hammer, Image, MapPin, Package, ShoppingCart, Store, Users } from 'lucide-react';

type StepKey = 'basic' | 'image' | 'sale' | 'selection' | 'execution' | 'report' | 'publish';

const STEPS: { key: StepKey; title: string; icon: React.ElementType; desc: string }[] = [
  { key: 'basic', title: 'بيانات المشروع', icon: MapPin, desc: 'تحديد بيانات الموقع، نوع المشروع، مراحله' },
  { key: 'image', title: 'صورة المشروع', icon: Image, desc: 'رفع صورة المشروع' },
  { key: 'sale', title: 'للبيع (اختياري)', icon: Store, desc: 'تحديد ما إذا كان المشروع للبيع' },
  { key: 'selection', title: 'اختيار المنتجات والخدمات', icon: ShoppingCart, desc: 'من Marketplace المدمج في المشروع' },
  { key: 'execution', title: 'التنفيذ والمتابعة', icon: Hammer, desc: 'إدارة التقدم والعمال وتقليل الكميات تلقائيًا' },
  { key: 'report', title: 'التقرير الختامي', icon: FileText, desc: 'ملخص المنتجات والضمانات والفواتير والصور' },
  { key: 'publish', title: 'عرض للبيع', icon: CheckCircle, desc: 'إضافة رقم الترخيص وعرض في المشاريع العامة' },
];

type ProjectType = 'residential' | 'commercial' | 'industrial';
interface FormState {
  name: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  projectType: ProjectType;
  imageSelected: boolean;
  stages: string[];
  invited: string[];
  forSale: boolean;
  adLicense: string;
  selectedItemsCount: number;
}

export default function UnifiedProjectWizard() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    projectType: 'residential',
    imageSelected: false,
    stages: [],
    invited: [],
    forSale: false,
    adLicense: '',
    selectedItemsCount: 0,
  });

  const step = useMemo(() => STEPS[activeIndex], [activeIndex]);
  const progress = Math.round(((activeIndex + 1) / STEPS.length) * 100);

  const next = () => setActiveIndex(i => Math.min(i + 1, STEPS.length - 1));
  const back = () => setActiveIndex(i => Math.max(i - 1, 0));

  const toggleStage = (stage: string) => {
    setForm(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter((s: string) => s !== stage)
        : [...prev.stages, stage],
    }));
  };

  const invitePhone = (phone: string) => {
    if (!phone) return;
    setForm(prev => ({ ...prev, invited: Array.from(new Set([...(prev.invited || []), phone])) }));
  };

  const saveMinimalProject = async (): Promise<{ id?: string } | null> => {
    setSaving(true);
    setError(null);
    try {
      // Only send columns that exist to avoid DB errors
      const payload = {
        project_name: form.name,
        description: form.description,
        status: 'planning',
        location: form.location,
        estimated_cost: 0,
        project_type: form.projectType,
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || res.statusText);
      }
      const data = await res.json().catch(() => ({}));
      // Expecting { project: { id } }
      return { id: data?.project?.id };
    } catch (e: any) {
      setError(e?.message || 'تعذر حفظ المشروع');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    const created = await saveMinimalProject();
    if (!created) return;
    if (created.id) {
      router.push(`/user/projects/${created.id}`);
    } else {
      router.push('/user/projects');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> رجوع
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">إنشاء مشروع جديد</h1>
            <p className="text-sm text-gray-600">اتبع الخطوات التالية لإعداد مشروعك</p>
          </div>
        </div>

        {/* Stepper */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {STEPS.map((s, idx) => (
                <div key={s.key} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${idx === activeIndex ? 'bg-blue-600 text-white' : idx < activeIndex ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                  <s.icon className="w-4 h-4" />
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        {/* Active step */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <step.icon className="w-5 h-5 text-blue-600" /> {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step.key === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">اسم المشروع</label>
                    <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مشروع سكني في الرياض" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">نوع المشروع</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md" value={form.projectType} onChange={e => setForm(p => ({ ...p, projectType: e.target.value as any }))}>
                      <option value="residential">سكني</option>
                      <option value="commercial">تجاري</option>
                      <option value="industrial">صناعي</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">الموقع</label>
                    <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="الرياض - حي الياسمين" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">إحداثيات الموقع (Latitude)</label>
                    <Input value={form.latitude} onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))} placeholder="24.774265" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">إحداثيات الموقع (Longitude)</label>
                    <Input value={form.longitude} onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))} placeholder="46.738586" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">وصف مختصر</label>
                    <Textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف المشروع ومتطلباته" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">المراحل</label>
                  <div className="flex flex-wrap gap-2">
                    {['التسوير', 'الحفر', 'الأساسات', 'الهيكل', 'الكهرباء', 'السباكة', 'التشطيب'].map((s: string) => (
                      <button key={s} type="button" onClick={() => toggleStage(s)} className={`px-3 py-1 rounded-full text-sm border ${form.stages.includes(s) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step.key === 'image' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">ارفع صورة للمشروع (اختياري). سيُضاف نظام رفع لاحقاً.</p>
                <Button type="button" variant={form.imageSelected ? 'default' : 'outline'} onClick={() => setForm(p => ({ ...p, imageSelected: !p.imageSelected }))}>
                  {form.imageSelected ? 'تم تحديد صورة افتراضية' : 'تحديد صورة افتراضية'}
                </Button>
              </div>
            )}

            {step.key === 'sale' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input id="forSale" type="checkbox" checked={form.forSale} onChange={e => setForm(p => ({ ...p, forSale: e.target.checked }))} />
                  <label htmlFor="forSale">المشروع معروض للبيع</label>
                </div>
                {form.forSale && (
                  <div>
                    <label className="block text-sm font-medium mb-1">رقم الترخيص الإعلاني</label>
                    <Input value={form.adLicense} onChange={e => setForm(p => ({ ...p, adLicense: e.target.value }))} placeholder="مثال: 1234-ABCD" />
                  </div>
                )}
              </div>
            )}

            {step.key === 'selection' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">اختر المنتجات والخدمات من السوق. حالياً رابط للسوق وسيتم الدمج الكامل لاحقاً.</p>
                <div className="flex gap-3">
                  <Button type="button" onClick={() => window.open('/marketplace', '_blank')} className="flex items-center gap-2"><Package className="w-4 h-4" /> فتح السوق</Button>
                  <Button type="button" variant="outline" onClick={() => setForm(p => ({ ...p, selectedItemsCount: p.selectedItemsCount + 1 }))}>إضافة عنصر وهمي</Button>
                </div>
                <Badge variant="outline">العناصر المحددة: {form.selectedItemsCount}</Badge>
              </div>
            )}

            {step.key === 'execution' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">أدعُ مشرفين وعمال بإدخال أرقام الجوال. سيتم ربطهم تلقائياً عند التسجيل.</p>
                <div className="flex gap-2">
                  <Input placeholder="05xxxxxxxx" onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const t = e.target as HTMLInputElement;
                      invitePhone(t.value.trim());
                      t.value = '';
                    }
                  }} />
                  <Button type="button" onClick={() => invitePhone(prompt('أدخل رقم الجوال') || '')} className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> إضافة
                  </Button>
                </div>
                {form.invited.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.invited.map((ph: string) => (
                      <Badge key={ph} variant="outline">{ph}</Badge>
                    ))}
                  </div>
                )}
                <div className="p-3 rounded-md bg-blue-50 text-blue-700 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <div>سيقوم النظام مستقبلاً بتقليل الكميات المتبقية تلقائياً عند الشراء من داخل المشروع.</div>
                </div>
              </div>
            )}

            {step.key === 'report' && (
              <div className="space-y-3 text-sm text-gray-700">
                <div>التقرير يتضمن: المنتجات المستخدمة، الضمانات، الفواتير، الصور، تقدم المراحل.</div>
                <div className="p-3 rounded-md bg-gray-50">
                  <div><strong>اسم:</strong> {form.name || '—'}</div>
                  <div><strong>نوع:</strong> {form.projectType}</div>
                  <div><strong>موقع:</strong> {form.location || '—'}</div>
                  <div><strong>مراحل:</strong> {form.stages.join('، ') || '—'}</div>
                  <div><strong>للبيع:</strong> {form.forSale ? `نعم (${form.adLicense || 'بدون ترخيص حتى الآن'})` : 'لا'}</div>
                  <div><strong>العناصر المحددة من السوق:</strong> {form.selectedItemsCount}</div>
                  <div><strong>مدعوون:</strong> {form.invited.join(', ') || '—'}</div>
                </div>
              </div>
            )}

            {step.key === 'publish' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">إن اخترت البيع، سيتم عرض المشروع في قسم المشاريع العامة للزوار.</p>
                {form.forSale ? (
                  <div className="text-green-700 bg-green-50 p-3 rounded-md text-sm">جاهز للنشر مع رقم الترخيص: {form.adLicense || '—'}</div>
                ) : (
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">هذا المشروع غير معروض للبيع.</div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <Button type="button" variant="outline" onClick={back} disabled={activeIndex === 0}>السابق</Button>
              <div className="flex gap-2">
                {step.key === 'basic' && (
                  <Button type="button" variant="secondary" onClick={finish} disabled={!form.name.trim() || saving}>
                    {saving ? 'جارٍ الحفظ...' : 'إنهاء سريع'}
                  </Button>
                )}
                {activeIndex < STEPS.length - 1 ? (
                  <Button type="button" onClick={next} disabled={step.key === 'basic' && !form.name.trim()}>التالي</Button>
                ) : (
                  <Button type="button" onClick={finish} disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'إنهاء وحفظ'}</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {!user && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md">
            لتسجيل المشروع بإسمك يرجى تسجيل الدخول.
          </div>
        )}
      </div>
    </div>
  );
}
