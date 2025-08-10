'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Badge, Progress } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { projectTrackingService } from '@/services';
import { ConstructionGuidanceService, ConstructionLevel, ProjectLevel } from '@/services/constructionGuidanceService';
import LandPurchaseIntegration from '@/components/integrations/LandPurchaseIntegration';
import ContractorSelectionIntegration from '@/components/integrations/ContractorSelectionIntegration';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { 
  ArrowLeft, 
  Building2, 
  MapPin,
  Users,
  Shield,
  Hammer,
  Truck,
  FileCheck,
  Award,
  ExternalLink,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  Download,
  AlertTriangle,
  Lightbulb,
  Target,
  Calendar,
  FileText
} from 'lucide-react';

export default function EnhancedConstructionProjectPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'project-info' | 'level-selection' | 'level-details' | 'guidance'>('project-info');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [currentLevelView, setCurrentLevelView] = useState<string>('');
  const [projectData, setProjectData] = useState({
    name: '',
    location: '',
    area: '',
    budget: '',
    description: '',
    projectType: 'residential' as 'residential' | 'commercial' | 'industrial',
    clientName: ''
  });

  const constructionLevels = ConstructionGuidanceService.getConstructionLevels();

  const handleLevelToggle = (levelId: string) => {
    setSelectedLevels(prev => {
      const level = constructionLevels.find(l => l.id === levelId);
      if (!level) return prev;

      if (prev.includes(levelId)) {
        // Remove level and all dependent levels
        const levelsToRemove = constructionLevels
          .filter(l => l.dependencies?.includes(levelId) || l.id === levelId)
          .map(l => l.id);
        return prev.filter(id => !levelsToRemove.includes(id));
      } else {
        // Add level and all dependencies
        const levelsToAdd = new Set([levelId]);
        
        // Add dependencies recursively
        const addDependencies = (id: string) => {
          const currentLevel = constructionLevels.find(l => l.id === id);
          if (currentLevel?.dependencies) {
            currentLevel.dependencies.forEach(dep => {
              levelsToAdd.add(dep);
              addDependencies(dep);
            });
          }
        };
        
        addDependencies(levelId);
        return [...prev, ...Array.from(levelsToAdd)].filter((id, index, arr) => arr.indexOf(id) === index);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name.trim()) {
      alert('يرجى إدخال اسم المشروع');
      return;
    }

    if (selectedLevels.length === 0) {
      alert('يرجى اختيار مستوى واحد على الأقل');
      return;
    }

    setLoading(true);
    try {
      const projectLevels: ProjectLevel[] = selectedLevels.map(levelId => {
        const level = ConstructionGuidanceService.getConstructionLevels().find(l => l.id === levelId);
        return {
          id: levelId,
          name: level?.arabicTitle || '',
          description: level?.description || '',
          requirements: level?.requirements || [],
          status: 'not_started'
        };
      });

      await projectTrackingService.saveProject({
        id: Date.now().toString(),
        userId: user?.id || 'current-user',
        name: projectData.name,
        description: projectData.description,
        area: parseInt(projectData.area) || 0,
        projectType: projectData.projectType,
        floorCount: 1,
        roomCount: 4,
        stage: 'تخطيط',
        progress: 0,
        status: 'planning',
        location: projectData.location,
        budget: parseFloat(projectData.budget) || 0,
        clientName: projectData.clientName,
        selectedPhases: selectedLevels,
        enablePhotoTracking: true,
        enableProgressTracking: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      router.push('/user/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('حدث خطأ في إنشاء المشروع');
    } finally {
      setLoading(false);
    }
  };

  const canStartLevel = (levelId: string) => {
    return ConstructionGuidanceService.canStartLevel(levelId, selectedLevels);
  };

  const renderLevelIntegration = (level: ConstructionLevel) => {
    if (!level.hasExternalIntegration) return null;

    switch (level.id) {
      case 'land-acquisition':
        return (
          <LandPurchaseIntegration 
            onLandSelected={(land) => console.log('Land selected:', land)}
          />
        );
      case 'contractor-selection':
        return (
          <ContractorSelectionIntegration 
            onContractorSelected={(contractor) => console.log('Contractor selected:', contractor)}
          />
        );
      default:
        return (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-800">تكامل خارجي متاح</h4>
                  <p className="text-sm text-blue-600">
                    سيتم توفير التكامل مع: {level.externalPlatforms?.join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">إنشاء مشروع بناء متقدم</h1>
            <p className="text-gray-600">نظام شامل مع الإرشادات الرسمية والتكامل مع المنصات الخارجية</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">خطوات إنشاء المشروع</h3>
            <span className="text-sm text-gray-500">
              الخطوة {activeTab === 'project-info' ? 1 : activeTab === 'level-selection' ? 2 : activeTab === 'level-details' ? 3 : 4} من 4
            </span>
          </div>
          <Progress 
            value={
              activeTab === 'project-info' ? 25 : 
              activeTab === 'level-selection' ? 50 : 
              activeTab === 'level-details' ? 75 : 100
            } 
            className="w-full"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-xl bg-gray-200 p-1">
            {[
              { id: 'project-info', label: 'معلومات المشروع', icon: FileText },
              { id: 'level-selection', label: 'اختيار المستويات', icon: CheckCircle },
              { id: 'level-details', label: 'تفاصيل المستويات', icon: Building2 },
              { id: 'guidance', label: 'الإرشادات والوثائق', icon: FileCheck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'project-info' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                معلومات المشروع الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <label className="block text-sm font-medium mb-2">اسم العميل *</label>
                  <Input
                    value={projectData.clientName}
                    onChange={(e) => setProjectData(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="أحمد محمد العلي"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الموقع</label>
                  <Input
                    value={projectData.location}
                    onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="الرياض، المملكة العربية السعودية"
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
                <div>
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
              <div className="flex justify-end">
                <Button
                  onClick={() => setActiveTab('level-selection')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  التالي: اختيار المستويات
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'level-selection' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  اختيار مستويات البناء المطلوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {constructionLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedLevels.includes(level.id)
                          ? 'border-blue-500 bg-blue-50'
                          : canStartLevel(level.id)
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 opacity-50'
                      }`}
                      onClick={() => canStartLevel(level.id) && handleLevelToggle(level.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          selectedLevels.includes(level.id) ? 'bg-blue-200' : 'bg-gray-100'
                        }`}>
                          <Building2 className={`w-6 h-6 ${
                            selectedLevels.includes(level.id) ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{level.arabicTitle}</h4>
                            <Badge variant="outline" className="text-xs">
                              المستوى {level.order}
                            </Badge>
                            {level.hasExternalIntegration && (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                تكامل خارجي
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {level.estimatedDuration}
                            </span>
                            {level.estimatedCost && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {level.estimatedCost.min.toLocaleString('en-US')} - {level.estimatedCost.max.toLocaleString('en-US')} {level.estimatedCost.currency}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {level.documentationFiles.length} وثيقة
                            </span>
                          </div>
                          {level.dependencies && level.dependencies.length > 0 && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
                              <span className="text-yellow-800">
                                يتطلب إكمال: {level.dependencies.map(dep => 
                                  constructionLevels.find(l => l.id === dep)?.arabicTitle
                                ).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedLevels.includes(level.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedLevels.includes(level.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {selectedLevels.length > 0 && (
              <Card className="border-l-4 border-l-green-500 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-800 mb-2">ملخص المستويات المختارة</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedLevels.map(levelId => {
                      const level = constructionLevels.find(l => l.id === levelId);
                      return level ? (
                        <Badge key={levelId} className="bg-green-200 text-green-800">
                          {level.arabicTitle}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">
                      إجمالي المستويات: {selectedLevels.length}
                    </span>
                    <Button
                      onClick={() => setActiveTab('level-details')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      التالي: تفاصيل المستويات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'level-details' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  تفاصيل المستويات والتكاملات الخارجية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedLevels.map(levelId => {
                    const level = constructionLevels.find(l => l.id === levelId);
                    if (!level) return null;

                    return (
                      <div key={levelId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg">{level.arabicTitle}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentLevelView(currentLevelView === levelId ? '' : levelId)}
                          >
                            {currentLevelView === levelId ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                          </Button>
                        </div>

                        {currentLevelView === levelId && (
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">المتطلبات:</h5>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {level.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>

                            {level.hasExternalIntegration && (
                              <div>
                                <h5 className="font-medium mb-2">التكامل الخارجي:</h5>
                                {renderLevelIntegration(level)}
                              </div>
                            )}

                            <div>
                              <h5 className="font-medium mb-2">الوثائق الرسمية:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {level.documentationFiles.map((doc) => (
                                  <div key={doc.id} className="border rounded p-3 bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                      <h6 className="font-medium text-sm">{doc.arabicTitle}</h6>
                                      <Badge variant={doc.isOfficial ? 'default' : 'outline'} className="text-xs">
                                        {doc.isOfficial ? 'رسمي' : 'غير رسمي'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{doc.description}</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">{doc.source}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(doc.url, '_blank')}
                                        className="text-xs"
                                      >
                                        <Download className="w-3 h-3 mr-1" />
                                        تحميل
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab('level-selection')}
              >
                السابق: اختيار المستويات
              </Button>
              <Button
                onClick={() => setActiveTab('guidance')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                التالي: الإرشادات
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'guidance' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  الإرشادات والنصائح الشاملة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedLevels.map(levelId => {
                    const level = constructionLevels.find(l => l.id === levelId);
                    const guidance = ConstructionGuidanceService.getGuidanceForLevel(levelId);
                    if (!level) return null;

                    return (
                      <div key={levelId} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-4">{level.arabicTitle}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Tips */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                              <h5 className="font-medium text-blue-800">نصائح مهمة</h5>
                            </div>
                            <ul className="space-y-2 text-sm">
                              {guidance.tips.map((tip: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Warnings */}
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              <h5 className="font-medium text-yellow-800">تحذيرات</h5>
                            </div>
                            <ul className="space-y-2 text-sm">
                              {guidance.warnings.map((warning: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <span>{warning}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Best Practices */}
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Target className="w-5 h-5 text-green-600" />
                              <h5 className="font-medium text-green-800">أفضل الممارسات</h5>
                            </div>
                            <ul className="space-y-2 text-sm">
                              {guidance.bestPractices.map((practice: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('level-details')}
                >
                  السابق: تفاصيل المستويات
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'جاري الإنشاء...' : 'إنشاء المشروع النهائي'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}




