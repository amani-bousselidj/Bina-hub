'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui';
import { ArrowLeft, Building2, MapPin, FileText, Calculator, CheckCircle, AlertTriangle } from 'lucide-react';
// Enhanced Project Components
import dynamic from 'next/dynamic';
// Note: ProjectManager component is not available, using legacy mode

// Import real ProjectTrackingService
import { projectTrackingService } from '@/services';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import GoogleMapsLocationPicker from '@/components/ui/GoogleMapsLocationPicker';

interface ProjectLevel {
  id: string;
  name: string;
}

interface ConstructionLevel {
  id: string;
  name: string;
}

interface ProjectData {
  name: string;
  location: string;
  locationCoordinates?: { lat: number; lng: number };
  area: string;
  budget: string;
  description: string;
  projectType: 'residential' | 'commercial' | 'industrial';
  floors: number;
  rooms: number;
  bathrooms: number;
}

export default function UnifiedProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, isLoading, error } = useAuth();
  
  // State management
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [useEnhancedMode, setUseEnhancedMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Legacy state for backward compatibility
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    location: '',
    locationCoordinates: { lat: 0, lng: 0 },
    area: '',
    budget: '',
    description: '',
    projectType: 'residential',
    floors: 1,
    rooms: 4,
    bathrooms: 3,
  });
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Initialize based on URL parameters
  useEffect(() => {
    const editId = searchParams?.get('editId');
    const forceEnhanced = searchParams?.get('enhanced') === 'true';
    const forceLegacy = searchParams?.get('legacy') === 'true';
    
    // Determine mode
    if (editId) {
      setMode('edit');
      setEditProjectId(editId);
      if (!forceLegacy) {
        loadProjectForEdit(editId);
      }
    } else if (searchParams?.get('create') === 'true') {
      setMode('create');
    } else if (searchParams?.get('view') === 'true') {
      setMode('view');
    }
    
    // Determine enhanced vs legacy mode
    if (forceEnhanced) {
      setUseEnhancedMode(true);
    } else if (forceLegacy) {
      setUseEnhancedMode(false);
    }
  }, [searchParams]);

  const loadProjectForEdit = async (projectId: string) => {
    try {
      const project = await projectTrackingService.getProjectById(projectId);
      if (project) {
        setProjectData({
          name: project.name,
          location: typeof project.location === 'string' ? project.location : project.location?.address || '',
          area: project.area?.toString() || '',
          budget: project.budget?.toString() || '',
          description: project.description || '',
          projectType: (project.projectType as 'residential' | 'commercial' | 'industrial') || 'residential',
          floors: project.floorCount || 1,
          rooms: project.roomCount || 4,
          bathrooms: 3,
        });
        setSelectedLevels(project.selectedPhases || []);
      }
    } catch (error) {
      console.error('Error loading project for edit:', error);
      alert('حدث خطأ في تحميل بيانات المشروع');
    }
  };

  // Enhanced mode - use new components
  if (useEnhancedMode && (mode === 'create' || mode === 'edit' || mode === 'view')) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* ProjectManager component not available - redirecting to legacy mode */}
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-2">الواجهة المحسنة غير متاحة حالياً</h3>
            <p className="text-yellow-700 mb-4">سيتم استخدام الواجهة التقليدية بدلاً من ذلك</p>
            <Button 
              onClick={() => setUseEnhancedMode(false)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              الانتقال للواجهة التقليدية
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Legacy mode - simplified version for backward compatibility
  const handleLegacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name.trim()) {
      alert('يرجى إدخال اسم المشروع');
      return;
    }

    setLoading(true);
    try {
      const projectPayload = {
        id: mode === 'edit' ? editProjectId! : Date.now().toString(),
        userId: user?.id || 'current-user',
        name: projectData.name,
        description: projectData.description,
        area: parseInt(projectData.area) || 0,
        projectType: projectData.projectType,
        floorCount: projectData.floors || 1,
        roomCount: projectData.rooms || 0,
        stage: 'تخطيط',
        progress: 0,
        status: 'planning' as const,
        location: projectData.location,
        budget: parseInt(projectData.budget) || 0,
        selectedPhases: selectedLevels,
        enablePhotoTracking: true,
        enableProgressTracking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await projectTrackingService.saveProject(projectPayload);
      router.push('/user/projects');
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} project:`, error);
      alert(`حدث خطأ في ${mode === 'edit' ? 'تحديث' : 'إنشاء'} المشروع`);
    } finally {
      setLoading(false);
    }
  };

  // Main page content
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {mode === 'edit' ? 'تعديل المشروع' : mode === 'create' ? 'إنشاء مشروع جديد' : 'منصة بِنَّا الموحدة للبناء'}
            </h1>
            <p className="text-gray-600">
              {mode === 'edit' ? 'تحديث معلومات وتفاصيل المشروع' : 'نظام شامل لإدارة مشاريع البناء'}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">اختر واجهة المشروع</h3>
                  <p className="text-sm text-gray-600">
                    يمكنك التبديل بين الواجهة المحسنة والواجهة التقليدية
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={useEnhancedMode ? "default" : "outline"}
                    onClick={() => setUseEnhancedMode(true)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    واجهة محسنة
                  </Button>
                  <Button
                    variant={!useEnhancedMode ? "default" : "outline"}
                    onClick={() => setUseEnhancedMode(false)}
                    className="flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    واجهة تقليدية
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {mode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
              setMode('create');
              router.push(`${window.location.pathname}?create=true${useEnhancedMode ? '&enhanced=true' : '&legacy=true'}`);
            }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">إنشاء مشروع جديد</h3>
                <p className="text-sm text-gray-600">ابدأ مشروع بناء جديد مع الإرشادات الكاملة</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/user/projects')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">مشاريعي</h3>
                <p className="text-sm text-gray-600">عرض وإدارة جميع مشاريعك الحالية</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/user/comprehensive-construction-calculator')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">حاسبة التكاليف</h3>
                <p className="text-sm text-gray-600">احسب تكلفة المواد والعمالة</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legacy Simple Form */}
        {!useEnhancedMode && (mode === 'create' || mode === 'edit') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                {mode === 'edit' ? 'تعديل معلومات المشروع' : 'معلومات المشروع الأساسية'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLegacySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
                    <Input
                      value={projectData.name}
                      onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="فيلا العائلة الجديدة"
                      required
                    />
                  </div>
                  <div>
                    <GoogleMapsLocationPicker
                      onLocationSelected={(location: { lat: number; lng: number }) => {
                        setProjectData(prev => ({
                          ...prev,
                          location: `${location.lat}, ${location.lng}`,
                          locationCoordinates: { lat: location.lat, lng: location.lng }
                        }));
                      }}
                      defaultLocation={
                        projectData.location && projectData.locationCoordinates && projectData.locationCoordinates.lat !== 0
                          ? {
                              lat: projectData.locationCoordinates.lat,
                              lng: projectData.locationCoordinates.lng
                            }
                          : undefined
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع المشروع</label>
                    <select
                      value={projectData.projectType}
                      onChange={(e) => setProjectData(prev => ({ ...prev, projectType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="residential">سكني</option>
                      <option value="commercial">تجاري</option>
                      <option value="industrial">صناعي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المساحة (متر مربع)</label>
                    <Input
                      type="number"
                      value={projectData.area}
                      onChange={(e) => setProjectData(prev => ({ ...prev, area: e.target.value }))}
                      placeholder="500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">الميزانية التقديرية (ريال)</label>
                    <Input
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => setProjectData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="800000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">وصف المشروع</label>
                  <Textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي للمشروع ومتطلباته..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">نصيحة:</p>
                    <p className="text-sm text-blue-600">
                      للحصول على تجربة أفضل مع خطوات مفصلة وإرشادات شاملة، استخدم الواجهة المحسنة
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUseEnhancedMode(true)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    التبديل للواجهة المحسنة
                  </Button>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'جاري الحفظ...' : mode === 'edit' ? 'حفظ التعديلات' : 'إنشاء المشروع'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Info Cards for list mode */}
        {mode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">الواجهة المحسنة</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    نموذج متعدد الخطوات مع إرشادات واضحة
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    تكامل مع مقدمي الخدمات
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    إدارة شاملة للمشروع
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    تتبع التقدم والميزانية
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">الواجهة التقليدية</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    نموذج بسيط وسريع
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    مناسب للمشاريع البسيطة
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    تركيز على المعلومات الأساسية
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    أسرع في الإدخال
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation helper */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            يمكنك التبديل بين الواجهات في أي وقت باستخدام المعاملات التالية في الرابط:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Badge variant="outline">?enhanced=true للواجهة المحسنة</Badge>
            <Badge variant="outline">?legacy=true للواجهة التقليدية</Badge>
            <Badge variant="outline">?create=true لإنشاء مشروع</Badge>
            <Badge variant="outline">?editId=123 لتعديل مشروع</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}




