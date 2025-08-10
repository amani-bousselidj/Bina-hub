// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { ClientIcon } from '@/components/ui';
import { Button } from '@/components/ui/enhanced-components';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

interface ProjectSpecs {
  projectType: string;
  area: number;
  floors: number;
  location: string;
  finishLevel: string;
  timeline: string;
}

interface MaterialCalculation {
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  supplier: string;
  alternatives?: Array<{
    material: string;
    price: number;
    savings: number;
  }>;
}

interface CostEstimate {
  totalCost: number;
  materialsBreakdown: MaterialCalculation[];
  laborCost: number;
  riskFactor: number;
  confidenceScore: number;
  recommendations: string[];
  timelineEstimate: string;
  priceValidUntil: string;
}

interface AIConstructionCalculatorProps {
  userId: string;
}

export default function AIConstructionCalculator({ userId }: AIConstructionCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [projectSpecs, setProjectSpecs] = useState<ProjectSpecs>({
    projectType: '',
    area: 0,
    floors: 1,
    location: '',
    finishLevel: '',
    timeline: ''
  });
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'specs' | 'results'>('specs');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const projectTypes = [
    { value: 'villa', label: 'فيلا سكنية', icon: 'design' },
    { value: 'apartment', label: 'شقة سكنية', icon: 'dashboard' },
    { value: 'commercial', label: 'مبنى تجاري', icon: 'marketing' },
    { value: 'warehouse', label: 'مستودع', icon: 'settings' },
    { value: 'mosque', label: 'مسجد', icon: 'shield' }
  ];

  const finishLevels = [
    { value: 'basic', label: 'تشطيب أساسي', multiplier: 1.0 },
    { value: 'standard', label: 'تشطيب عادي', multiplier: 1.3 },
    { value: 'luxury', label: 'تشطيب فاخر', multiplier: 1.8 },
    { value: 'super_luxury', label: 'تشطيب سوبر لوكس', multiplier: 2.5 }
  ];

  const calculateEstimate = async () => {
    if (!projectSpecs.projectType || !projectSpecs.area) {
      setError('يرجى إكمال المعلومات الأساسية للمشروع');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/calculate-construction-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          projectSpecs,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في حساب التكلفة');
      }

      const result = await response.json();
      setEstimate(result.estimate);
      setActiveTab('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في الحساب');
    } finally {
      setIsCalculating(false);
    }
  };

  const saveEstimate = async () => {
    if (!estimate) return;

    try {
      const response = await fetch('/api/user/construction-estimates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          projectSpecs,
          estimate,
          createdAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        // Show success message or redirect
        console.log('Estimate saved successfully');
      }
    } catch (err) {
      console.error('Failed to save estimate:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    if (!isClient) {
      // Return a simple format for SSR to avoid hydration mismatch
      return `${amount.toLocaleString('en-US')} ر.س`;
    }
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
          <ClientIcon type="calculator" size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">حاسبة البناء الذكية</h3>
          <p className="text-gray-600 text-sm">احسب تكلفة مشروعك بدقة باستخدام الذكاء الاصطناعي</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'specs'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          مواصفات المشروع
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'results'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          disabled={!estimate}
        >
          النتائج والتوصيات
        </button>
      </div>

      {activeTab === 'specs' && (
        <div className="space-y-6">
          {/* Project Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">نوع المشروع</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setProjectSpecs({ ...projectSpecs, projectType: type.value })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    projectSpecs.projectType === type.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <ClientIcon type={type.icon as any} size={24} className={`mx-auto mb-2 ${
                    projectSpecs.projectType === type.value ? 'text-orange-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    projectSpecs.projectType === type.value ? 'text-orange-800' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المساحة (متر مربع)</label>
              <input
                type="number"
                value={projectSpecs.area || ''}
                onChange={(e) => setProjectSpecs({ ...projectSpecs, area: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="مثال: 300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عدد الأدوار</label>
              <select
                value={projectSpecs.floors}
                onChange={(e) => setProjectSpecs({ ...projectSpecs, floors: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'دور' : 'أدوار'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
              <select
                value={projectSpecs.location}
                onChange={(e) => setProjectSpecs({ ...projectSpecs, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">اختر المدينة</option>
                <option value="riyadh">الرياض</option>
                <option value="jeddah">جدة</option>
                <option value="dammam">الدمام</option>
                <option value="mecca">مكة</option>
                <option value="medina">المدينة</option>
                <option value="other">مدينة أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">مستوى التشطيب</label>
              <select
                value={projectSpecs.finishLevel}
                onChange={(e) => setProjectSpecs({ ...projectSpecs, finishLevel: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">اختر مستوى التشطيب</option>
                {finishLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الجدول الزمني المطلوب</label>
            <select
              value={projectSpecs.timeline}
              onChange={(e) => setProjectSpecs({ ...projectSpecs, timeline: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">اختر المدة الزمنية</option>
              <option value="fast">سريع (3-6 أشهر)</option>
              <option value="normal">عادي (6-12 شهر)</option>
              <option value="slow">متأني (12-18 شهر)</option>
            </select>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-3">
            <Button
              onClick={calculateEstimate}
              disabled={isCalculating || !projectSpecs.projectType || !projectSpecs.area}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
            >
              {isCalculating ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner />
                  جاري الحساب...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ClientIcon type="calculator" size={16} className="text-white" />
                  احسب التكلفة
                </div>
              )}
            </Button>
            <Button
              onClick={() => {
                setProjectSpecs({
                  projectType: '',
                  area: 0,
                  floors: 1,
                  location: '',
                  finishLevel: '',
                  timeline: ''
                });
                setEstimate(null);
                setError(null);
              }}
              variant="secondary"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3"
            >
              إلغاء
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ClientIcon type="shield" size={20} className="text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && estimate && (
        <div className="space-y-6">
          {/* Total Cost Summary */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-800">التكلفة الإجمالية المقدرة</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(estimate.confidenceScore)}`}>
                دقة التقدير: {Math.round(estimate.confidenceScore * 100)}%
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {formatCurrency(estimate.totalCost)}
            </div>
            <p className="text-gray-600 text-sm">
              صالح حتى: {estimate.priceValidUntil} • مدة الإنجاز المقدرة: {estimate.timelineEstimate}
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <ClientIcon type="settings" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">تكلفة المواد</span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {formatCurrency(estimate.materialsBreakdown.reduce((sum, item) => sum + item.totalPrice, 0))}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <ClientIcon type="ai" size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">تكلفة العمالة</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(estimate.laborCost)}
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <ClientIcon type="shield" size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">عامل المخاطر</span>
              </div>
              <div className="text-xl font-bold text-yellow-700">
                +{Math.round(estimate.riskFactor * 100)}%
              </div>
            </div>
          </div>

          {/* Materials Breakdown */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 mb-4">تفصيل المواد المطلوبة</h5>
            <div className="space-y-3">
              {estimate.materialsBreakdown.map((material, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-gray-800">{material.material}</h6>
                    <span className="text-lg font-bold text-gray-700">
                      {formatCurrency(material.totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{material.quantity} {material.unit} × {formatCurrency(material.unitPrice)}</span>
                    <span className="text-blue-600">{material.supplier}</span>
                  </div>
                  {material.alternatives && material.alternatives.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">بدائل أرخص:</p>
                      {material.alternatives.map((alt, altIndex) => (
                        <div key={altIndex} className="text-xs text-green-600">
                          {alt.material}: {formatCurrency(alt.price)} (توفير {formatCurrency(alt.savings)})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <ClientIcon type="ai" size={20} className="text-purple-600" />
              <h5 className="text-lg font-semibold text-purple-800">توصيات الذكاء الاصطناعي</h5>
            </div>
            <ul className="space-y-2">
              {estimate.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span className="text-purple-700 text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={saveEstimate}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 shadow-md"
            >
              حفظ التقدير
            </Button>
            <Button
              onClick={() => setActiveTab('specs')}
              variant="secondary"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2"
            >
              تعديل المواصفات
            </Button>
            <Button 
              variant="secondary"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2"
             onClick={() => alert('Button clicked')}>
              تصدير PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}





