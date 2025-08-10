"use client"

import React from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard } from '@/components/ui/enhanced-components';
import { ArrowRight, FileText, Upload, Search, Shield, Tag, FolderOpen, Download } from 'lucide-react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

export default function DocumentsHelpPage() {
  const { user, session, isLoading, error } = useAuth();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/user/help-center"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowRight className="w-5 h-5" />
          العودة لمركز المساعدة
        </Link>
        
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          دليل إدارة المستندات
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          تعلم كيفية إدارة وتنظيم مستنداتك بفعالية في منصة بنّا
        </Typography>
      </div>

      {/* Quick Start Guide */}
      <EnhancedCard className="p-6 mb-8 bg-blue-50 border-blue-200">
        <Typography variant="subheading" size="xl" weight="semibold" className="text-blue-900 mb-4 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          البدء السريع
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Typography variant="body" size="lg" weight="medium" className="text-blue-800 mb-2">
              1. رفع المستندات
            </Typography>
            <Typography variant="caption" size="sm" className="text-blue-700">
              استخدم زر "رفع مستند" لإضافة الفواتير، الضمانات، والعقود إلى حسابك
            </Typography>
          </div>
          
          <div>
            <Typography variant="body" size="lg" weight="medium" className="text-blue-800 mb-2">
              2. التصنيف والتنظيم
            </Typography>
            <Typography variant="caption" size="sm" className="text-blue-700">
              صنف مستنداتك حسب المشروع، النوع، أو التاريخ لسهولة الوصول
            </Typography>
          </div>
        </div>
      </EnhancedCard>

      {/* Document Types */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-6">
          أنواع المستندات المدعومة
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-green-600" />
              <Typography variant="body" size="lg" weight="medium">الفواتير</Typography>
            </div>
            <Typography variant="caption" size="sm" className="text-gray-600">
              فواتير الشراء، إيصالات الدفع، والمستندات المالية
            </Typography>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <Typography variant="body" size="lg" weight="medium">الضمانات</Typography>
            </div>
            <Typography variant="caption" size="sm" className="text-gray-600">
              شهادات الضمان، كتيبات الصيانة، ومستندات الخدمة
            </Typography>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <FolderOpen className="w-6 h-6 text-purple-600" />
              <Typography variant="body" size="lg" weight="medium">مستندات المشاريع</Typography>
            </div>
            <Typography variant="caption" size="sm" className="text-gray-600">
              العقود، المخططات، التراخيص، والتصاريح
            </Typography>
          </div>
        </div>
      </EnhancedCard>

      {/* Features Guide */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-6">
          الميزات الأساسية
        </Typography>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Typography variant="body" size="lg" weight="medium" className="mb-2">البحث الذكي</Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">
                ابحث في مستنداتك بالاسم، النوع، التاريخ، أو حتى المحتوى باستخدام خاصية البحث المتقدم
              </Typography>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Typography variant="body" size="lg" weight="medium" className="mb-2">العلامات والتصنيف</Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">
                أضف علامات مخصصة لمستنداتك لتسهيل التنظيم والعثور عليها لاحقاً
              </Typography>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Download className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <Typography variant="body" size="lg" weight="medium" className="mb-2">التحميل والمشاركة</Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">
                حمّل مستنداتك أو شاركها مع المقاولين والموردين بسهولة وأمان
              </Typography>
            </div>
          </div>
        </div>
      </EnhancedCard>

      {/* Integration with Other Features */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-6">
          التكامل مع الميزات الأخرى
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Typography variant="body" size="lg" weight="medium" className="mb-2">ربط بالمشاريع</Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">
              اربط مستنداتك بمشاريع محددة لتنظيم أفضل وسهولة الوصول
            </Typography>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <Typography variant="body" size="lg" weight="medium" className="mb-2">إدارة الضمانات</Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">
              تكامل مباشر مع نظام إدارة الضمانات لتتبع أفضل للمنتجات والخدمات
            </Typography>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <Typography variant="body" size="lg" weight="medium" className="mb-2">تتبع المصروفات</Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">
              ربط الفواتير والإيصالات بنظام تتبع المصروفات لمتابعة مالية شاملة
            </Typography>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <Typography variant="body" size="lg" weight="medium" className="mb-2">الذكاء الاصطناعي</Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">
              استخدم أدوات الذكاء الاصطناعي لاستخراج البيانات من المستندات تلقائياً
            </Typography>
          </div>
        </div>
      </EnhancedCard>

      {/* Best Practices */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-6">
          أفضل الممارسات
        </Typography>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <Typography variant="caption" size="sm" className="text-gray-700">
              اتبع تسمية موحدة للملفات تتضمن التاريخ ونوع المستند
            </Typography>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <Typography variant="caption" size="sm" className="text-gray-700">
              أضف وصف مفصل لكل مستند لسهولة البحث والتعرف عليه
            </Typography>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <Typography variant="caption" size="sm" className="text-gray-700">
              قم بمراجعة وتحديث المستندات بانتظام وأرشف القديمة منها
            </Typography>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <Typography variant="caption" size="sm" className="text-gray-700">
              استخدم العلامات بذكاء لتصنيف المستندات حسب الأولوية والحالة
            </Typography>
          </div>
        </div>
      </EnhancedCard>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/user/documents">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <Typography variant="body" size="md" weight="medium">إدارة المستندات</Typography>
            </div>
          </EnhancedCard>
        </Link>
        
        <Link href="/user/warranties">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <Typography variant="body" size="md" weight="medium">إدارة الضمانات</Typography>
            </div>
          </EnhancedCard>
        </Link>
        
        <Link href="/user/ai-hub">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6 text-purple-600" />
              <Typography variant="body" size="md" weight="medium">مركز الذكاء الاصطناعي</Typography>
            </div>
          </EnhancedCard>
        </Link>
      </div>
    </div>
  );
}



