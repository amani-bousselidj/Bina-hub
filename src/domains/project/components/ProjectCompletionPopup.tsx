'use client';

import React, { useState } from 'react';
import { cn } from '@/core/shared/utils';
import { 
  CheckCircle, 
  Trophy, 
  DollarSign, 
  Eye, 
  X, 
  Star,
  Calendar,
  MapPin,
  Camera,
  FileText,
  Sparkles
} from 'lucide-react';
import { Project } from '@/core/shared/types/types';

interface ProjectCompletionPopupProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSellProject: (saleData: {
    sale_price: number;
    sale_description: string;
    for_sale: boolean;
    profit_percentage?: number;
    total_cost?: number;
  }) => void;
  onKeepPrivate: () => void;
}

export default function ProjectCompletionPopup({
  project,
  isOpen,
  onClose,
  onSellProject,
  onKeepPrivate
}: ProjectCompletionPopupProps) {
  const [currentStep, setCurrentStep] = useState<'celebration' | 'decision' | 'selling'>('celebration');
  const [salePrice, setSalePrice] = useState('');
  const [saleDescription, setSaleDescription] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('20'); // Default 20% profit
  
  // Calculate total project cost from estimations
  const totalProjectCost = project.estimations?.totalCost || 0;
  const calculatedSalePrice = totalProjectCost * (1 + parseFloat(profitPercentage || '0') / 100);
  const platformFee = parseFloat(salePrice || '0') * 0.05; // 5% platform fee
  const netProfit = parseFloat(salePrice || '0') - totalProjectCost - platformFee;

  if (!isOpen) return null;

  const handleSellDecision = () => {
    setCurrentStep('selling');
  };

  const handlePrivateDecision = () => {
    onKeepPrivate();
    onClose();
  };

  const handleSubmitSale = () => {
    if (!salePrice || !saleDescription.trim()) return;
    
    onSellProject({
      sale_price: parseFloat(salePrice),
      sale_description: saleDescription,
      for_sale: true,
      profit_percentage: parseFloat(profitPercentage),
      total_cost: totalProjectCost
    });
    onClose();
  };

  const goBack = () => {
    if (currentStep === 'selling') {
      setCurrentStep('decision');
    } else if (currentStep === 'decision') {
      setCurrentStep('celebration');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {currentStep === 'celebration' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Trophy className="w-16 h-16 text-yellow-300" />
                  <Sparkles className="w-6 h-6 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">مبروك! تم إنجاز المشروع</h1>
              <p className="text-green-100">لقد أكملت مشروع "{project.name}" بنجاح!</p>
            </div>
          )}
          
          {currentStep === 'decision' && (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">ماذا تريد أن تفعل بمشروعك؟</h1>
              <p className="text-green-100">اختر كيف تريد عرض مشروعك المكتمل</p>
            </div>
          )}
          
          {currentStep === 'selling' && (
            <div className="text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">عرض المشروع للبيع</h1>
              <p className="text-green-100">أدخل تفاصيل البيع لعرض مشروعك في المتجر</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Project Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ملخص المشروع
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>تاريخ البدء: {project.startDate ? new Date(project.startDate).toLocaleDateString('ar') : 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>الموقع: {typeof project.location === 'string' ? project.location : project.location?.address || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>نسبة الإنجاز: 100%</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Camera className="w-4 h-4" />
                <span>الصور: {project.images?.length || 0} صورة</span>
              </div>
            </div>
            
            {/* Cost Information */}
            {totalProjectCost > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  التكلفة الإجمالية للمشروع
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-800">
                    {totalProjectCost.toLocaleString('en-US')} ريال سعودي
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    شامل جميع المواد والعمالة والمعدات
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Celebration Step */}
          {currentStep === 'celebration' && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-700">
                  لقد أنجزت مشروعاً رائعاً! هذا إنجاز يستحق الاحتفال.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    💡 نصيحة: يمكنك الآن عرض مشروعك للآخرين أو حتى بيعه في المتجر
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentStep('decision')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                التالي
              </button>
            </div>
          )}

          {/* Decision Step */}
          {currentStep === 'decision' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sell Option */}
                <button
                  onClick={handleSellDecision}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-right group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">عرض للبيع</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        عرض مشروعك في المتجر للمشترين المهتمين واكسب من عملك
                      </p>
                      <div className="mt-3 text-xs text-green-600 font-medium">
                        ✓ عرض في المتجر العام
                        <br />
                        ✓ إمكانية تحديد السعر
                        <br />
                        ✓ عمولة منصة منخفضة
                      </div>
                    </div>
                  </div>
                </button>

                {/* Keep Private Option */}
                <button
                  onClick={handlePrivateDecision}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-right group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">عرض عام فقط</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        عرض المشروع للجمهور كمرجع دون بيع
                      </p>
                      <div className="mt-3 text-xs text-blue-600 font-medium">
                        ✓ عرض في الصفحة العامة
                        <br />
                        ✓ مرجع للآخرين
                        <br />
                        ✓ بناء سمعة احترافية
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={goBack}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                رجوع
              </button>
            </div>
          )}

          {/* Selling Step */}
          {currentStep === 'selling' && (
            <div className="space-y-6">
              {/* Cost Breakdown */}
              {totalProjectCost > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    تحليل التكلفة والربح
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700 font-medium">التكلفة الإجمالية:</p>
                      <p className="text-lg font-bold text-blue-800">{totalProjectCost.toLocaleString('en-US')} ر.س</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">السعر المقترح (+{profitPercentage}%):</p>
                      <p className="text-lg font-bold text-green-600">{calculatedSalePrice.toLocaleString('en-US')} ر.س</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Profit Percentage Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نسبة الربح المطلوبة (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={profitPercentage}
                        onChange={(e) => {
                          setProfitPercentage(e.target.value);
                          if (totalProjectCost > 0) {
                            setSalePrice(calculatedSalePrice.toString());
                          }
                        }}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        value={profitPercentage}
                        onChange={(e) => {
                          setProfitPercentage(e.target.value);
                          if (totalProjectCost > 0) {
                            setSalePrice(calculatedSalePrice.toString());
                          }
                        }}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-center text-sm"
                        min="0"
                        max="100"
                      />
                    </div>
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سعر البيع النهائي (ريال سعودي)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => {
                        setSalePrice(e.target.value);
                        // Update profit percentage based on manual price input
                        if (totalProjectCost > 0 && e.target.value) {
                          const newProfit = ((parseFloat(e.target.value) - totalProjectCost) / totalProjectCost) * 100;
                          setProfitPercentage(Math.max(0, newProfit).toFixed(0));
                        }
                      }}
                      placeholder={totalProjectCost > 0 ? calculatedSalePrice.toFixed(0) : "مثال: 50000"}
                      className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                      min="0"
                      step="100"
                    />
                  </div>
                  {totalProjectCost > 0 && (
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>عمولة المنصة (5%):</span>
                        <span className="text-red-600">-{platformFee.toLocaleString('en-US')} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span>صافي الربح:</span>
                        <span className={netProfit >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('en-US')} ر.س
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف المشروع للمشترين
                  </label>
                  <textarea
                    value={saleDescription}
                    onChange={(e) => setSaleDescription(e.target.value)}
                    placeholder="اكتب وصفاً جذاباً لمشروعك... ما يجعله مميزاً؟ ما هي المواد المستخدمة؟ ما هي المميزات الخاصة؟"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {saleDescription.length}/500 حرف
                  </p>
                </div>

                {/* Enhanced Preview */}
                {salePrice && saleDescription && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">معاينة الإعلان:</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <p><strong>المشروع:</strong> {project.name}</p>
                      <p><strong>السعر:</strong> {parseFloat(salePrice).toLocaleString('en-US')} ريال سعودي</p>
                      {totalProjectCost > 0 && (
                        <>
                          <p><strong>التكلفة الأساسية:</strong> {totalProjectCost.toLocaleString('en-US')} ر.س</p>
                          <p><strong>نسبة الربح:</strong> {profitPercentage}%</p>
                          <p><strong>صافي المبلغ بعد العمولة:</strong> {(parseFloat(salePrice) * 0.95).toLocaleString('en-US')} ريال سعودي</p>
                          <p><strong>الربح الصافي:</strong> 
                            <span className={netProfit >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                              {' '}{netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('en-US')} ر.س
                            </span>
                          </p>
                        </>
                      )}
                      <p><strong>الوصف:</strong> {saleDescription.substring(0, 100)}...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={goBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  رجوع
                </button>
                <button
                  onClick={handleSubmitSale}
                  disabled={!salePrice || !saleDescription.trim()}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-medium transition-all duration-200",
                    salePrice && saleDescription.trim()
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  عرض للبيع
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



