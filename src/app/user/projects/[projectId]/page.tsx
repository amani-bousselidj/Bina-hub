"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, Brain, Calculator, Package, TrendingUp, Shield, Users, Camera,
  FileText, ShoppingCart, Truck, HardHat as Helmet, AlertCircle, Building2, Share2
} from 'lucide-react';

export default function ProjectDashboardPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const goTo = (path: string) => router.push(path);

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مركز المشروع</h1>
          <p className="text-gray-600 mt-1">إدارة كل شيء للمشروع من مكان واحد</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => goTo(`/user/projects/${projectId}/report`)}>
            <FileText className="w-4 h-4 ml-2" /> تقرير المشروع
          </Button>
          <Button onClick={() => goTo(`/user/projects/${projectId}/marketplace`)}>
            <ShoppingCart className="w-4 h-4 ml-2" /> السوق للمشروع
          </Button>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionCard title="الموقع والمعلومات" desc="تحديد الموقع، مستوى المشروع ونطاقه" icon={MapPin}
          onClick={() => goTo(`/user/projects/${projectId}/settings`)} />
        <ActionCard title="استشارة الذكاء الاصطناعي" desc="نصائح مخصصة لتقدم المشروع" icon={Brain}
          onClick={() => goTo(`/user/ai-assistant?projectId=${projectId}`)} />
        <ActionCard title="حاسبة التكلفة الذكية" desc="تقدير التكاليف بحسب المستوى" icon={Calculator}
          onClick={() => goTo(`/user/comprehensive-construction-calculator?projectId=${projectId}`)} />
        <ActionCard title="السوق وشراء المنتجات" desc="شراء احتياجات المشروع مع ربط المصروفات" icon={Package}
          onClick={() => goTo(`/user/projects/${projectId}/marketplace`)} />
        <ActionCard title="مصروفات المشروع" desc="جميع المصروفات المرتبطة بالمشروع" icon={TrendingUp}
          onClick={() => goTo(`/user/expenses?projectId=${projectId}`)} />
        <ActionCard title="الضمانات" desc="تتبع الضمانات لكل عنصر وخدمة" icon={Shield}
          onClick={() => goTo(`/user/warranties?projectId=${projectId}`)} />
        <ActionCard title="فريق المشروع" desc="المشرفون والمقاولون والعمال" icon={Users}
          onClick={() => goTo(`/user/projects/${projectId}/team`)} />
        <ActionCard title="صور المراحل" desc="توثيق كل مرحلة بالصور" icon={Camera}
          onClick={() => goTo(`/user/projects/${projectId}/photos`)} />
        <ActionCard title="تقرير شامل" desc="الفواتير، الضمانات، المصروفات" icon={FileText}
          onClick={() => goTo(`/user/projects/${projectId}/report`)} />
      </div>

      {/* Quick Requests */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">طلبات سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickButton label="طلب خرسانة" icon={Truck} onClick={() => goTo(`/user/projects/${projectId}/requests/concrete`)} />
          <QuickButton label="زيارة مشرف" icon={Helmet} onClick={() => goTo(`/user/projects/${projectId}/requests/supervisor`)} />
          <QuickButton label="نقل مخلفات" icon={Truck} onClick={() => goTo(`/user/projects/${projectId}/requests/waste`)} />
          <QuickButton label="تسليم عاجل" icon={AlertCircle} onClick={() => goTo(`/user/projects/${projectId}/requests/urgent-delivery`)} />
        </div>
      </div>

      {/* Developer Tools */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">أدوات المطورين</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard title="مشروع تطوير متعدد" desc="إدارة مجموعة من الفلل/الوحدات" icon={Building2}
            onClick={() => goTo(`/user/projects/${projectId}/portfolio`)} />
          <ActionCard title="عرض المشروع للبيع" desc="نشر تفاصيل المشروع للشراء" icon={Share2}
            onClick={() => goTo(`/user/projects/${projectId}/publish`)} />
          <ActionCard title="تقدير خبير" desc="دعوة مُقدر تكاليف متخصص" icon={Calculator}
            onClick={() => goTo(`/user/projects/${projectId}/invite-estimator`)} />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon: Icon, onClick }: { title: string; desc: string; icon: any; onClick: () => void; }) {
  return (
    <button onClick={onClick} className="text-right bg-white border rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="rounded-lg p-2 bg-blue-50 text-blue-700"><Icon className="w-5 h-5" /></div>
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{desc}</div>
        </div>
      </div>
    </button>
  );
}

function QuickButton({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void; }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-50">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
