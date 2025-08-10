// @ts-nocheck
'use client';

import { useState, useRef } from 'react';
import { ClientIcon } from '@/components/ui';
import { Button } from '@/components/ui/enhanced-components';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProgressAnalysis {
  progressPercentage: number;
  qualityScore: number;
  detectedElements: string[];
  recommendations: string[];
  progressChange?: number;
  areasChanged?: string[];
}

interface ConstructionProgressProps {
  userId: string;
  projectId?: string;
}

export default function ConstructionProgressTracker({ userId, projectId }: ConstructionProgressProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ProgressAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>(projectId || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى تحديد ملف صورة صالح');
      return;
    }

    setUploadedImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    await analyzeProgress(file);
  };

  const analyzeProgress = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userId);
      formData.append('projectId', selectedProject);
      formData.append('timestamp', new Date().toISOString());

      // Get GPS location if available
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        formData.append('latitude', position.coords.latitude.toString());
        formData.append('longitude', position.coords.longitude.toString());
      }

      const response = await fetch('/api/ai/analyze-construction-progress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل في تحليل الصورة');
      }

      const result = await response.json();
      setAnalysisResult(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في التحليل');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveProgressUpdate = async () => {
    if (!analysisResult || !selectedProject) return;

    try {
      const response = await fetch('/api/user/construction-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          projectId: selectedProject,
          progressData: analysisResult,
          imageUrl: imagePreview,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ تحديث التقدم');
      }

      // Reset form
      setUploadedImage(null);
      setImagePreview(null);
      setAnalysisResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حفظ التحديث');
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'text-red-600 bg-red-100';
    if (percentage < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getQualityColor = (score: number) => {
    if (score < 0.6) return 'text-red-600 bg-red-100';
    if (score < 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
          <ClientIcon type="design" size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">تتبع تقدم البناء بالذكاء الاصطناعي</h3>
          <p className="text-gray-600 text-sm">ارفع صورة للموقع وسيتم تحليل التقدم تلقائياً</p>
        </div>
      </div>

      {/* Project Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">المشروع</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">اختر مشروع</option>
          <option value="project-1">فيلا الرياض - الطوابق الأرضية</option>
          <option value="project-2">مجمع تجاري - المرحلة الأولى</option>
          <option value="project-3">مشروع العمارة السكنية</option>
        </select>
      </div>

      {/* Image Upload Area */}
      <div className="mb-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <div className="space-y-4">
              <img 
                src={imagePreview} 
                alt="صورة التقدم" 
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <p className="text-green-600 font-medium">تم رفع الصورة بنجاح</p>
            </div>
          ) : (
            <>
              <ClientIcon type="dashboard" size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">ارفع صورة للموقع أو التقدم</p>
              <p className="text-sm text-gray-500">انقر هنا أو اسحب الصورة</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <LoadingSpinner />
            <div>
              <p className="text-blue-800 font-medium">جاري تحليل الصورة بالذكاء الاصطناعي...</p>
              <p className="text-blue-600 text-sm">تحليل التقدم وجودة العمل</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <ClientIcon type="shield" size={20} className="text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <ClientIcon type="ai" size={20} className="text-green-600" />
            <h4 className="text-green-800 font-medium">نتائج التحليل</h4>
          </div>

          {/* Progress Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">نسبة التقدم</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProgressColor(analysisResult.progressPercentage)}`}>
                  {Math.round(analysisResult.progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${analysisResult.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">نقاط الجودة</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityColor(analysisResult.qualityScore)}`}>
                  {Math.round(analysisResult.qualityScore * 100)}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${analysisResult.qualityScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Progress Change */}
          {analysisResult.progressChange && (
            <div className="bg-white rounded-lg p-4 border mb-4">
              <h5 className="font-medium text-gray-800 mb-2">التغيير من آخر صورة</h5>
              <div className="flex items-center gap-2">
                <ClientIcon type="chart" size={16} className="text-blue-600" />
                <span className="text-blue-600 font-medium">+{analysisResult.progressChange.toFixed(1)}% تقدم</span>
              </div>
            </div>
          )}

          {/* Detected Elements */}
          <div className="bg-white rounded-lg p-4 border mb-4">
            <h5 className="font-medium text-gray-800 mb-3">العناصر المكتشفة</h5>
            <div className="flex flex-wrap gap-2">
              {analysisResult.detectedElements.map((element, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {element}
                </span>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-lg p-4 border mb-6">
            <h5 className="font-medium text-gray-800 mb-3">توصيات الذكاء الاصطناعي</h5>
            <ul className="space-y-2">
              {analysisResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ClientIcon type="ai" size={16} className="text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={saveProgressUpdate}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!selectedProject}
            >
              حفظ تحديث التقدم
            </Button>
            <Button
              variant="secondary"
              onClick={() => setAnalysisResult(null)}
            >
              تحليل صورة أخرى
            </Button>
          </div>
        </div>
      )}

      {/* Recent Progress Updates */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">تحديثات التقدم الأخيرة</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src="/api/placeholder/60/60" 
              alt="صورة تقدم"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">فيلا الرياض - الطوابق الأرضية</p>
              <p className="text-xs text-gray-500">قبل ساعتين • تحليل AI • جودة 87%</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">75%</span>
              <p className="text-xs text-gray-500">نسبة التقدم</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src="/api/placeholder/60/60" 
              alt="صورة تقدم"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">مجمع تجاري - المرحلة الأولى</p>
              <p className="text-xs text-gray-500">أمس • تحليل AI • جودة 92%</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-600">45%</span>
              <p className="text-xs text-gray-500">نسبة التقدم</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






