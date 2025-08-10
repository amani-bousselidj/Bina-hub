// @ts-nocheck
import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Brain, Calculator, Download, Loader, AlertCircle, CheckCircle, Eye, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui';

interface ExtractedData {
  rooms: Array<{
    name: string;
    width: number;
    length: number;
    height?: number;
    area: number;
  }>;
  totalArea: number;
  dimensions: {
    plotWidth?: number;
    plotLength?: number;
    floors?: number;
  };
  specifications: {
    foundationType?: string;
    wallType?: string;
    roofType?: string;
    finishLevel?: string;
  };
  quantities: {
    walls: number; // linear meters
    doors: number;
    windows: number;
    electricalPoints: number;
    plumbingFixtures: number;
  };
  confidence: number;
}

interface CostEstimate {
  totalCost: number;
  breakdown: {
    foundation: number;
    structure: number;
    walls: number;
    roofing: number;
    electrical: number;
    plumbing: number;
    finishing: number;
    labor: number;
  };
  materials: Array<{
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  timeline: {
    estimated_duration: number;
    phases: Array<{
      name: string;
      duration: number;
      cost: number;
    }>;
  };
  recommendations: string[];
  alternatives: Array<{
    description: string;
    savings: number;
    impact: string;
  }>;
}

const PDFBlueprintAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [rawText, setRawText] = useState<string>('');
  const [editableData, setEditableData] = useState<Partial<ExtractedData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setError(null);
      setExtractedData(null);
      setCostEstimate(null);
    } else {
      setError('يرجى رفع ملف PDF صالح يحتوي على مخططات معمارية');
    }
  }, []);

  const analyzePDF = async () => {
    if (!file) {
      setError('يرجى رفع ملف PDF أولاً');
      return;
    }

    setProcessing(true);
    setError(null);
    setAnalysisStep('جاري قراءة ملف PDF...');

    try {
      // Step 1: Extract text and analyze PDF
      setAnalysisStep('استخراج النصوص والأبعاد من المخطط...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const extractResponse = await fetch('/api/ai/analyze-pdf-blueprint', {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        throw new Error('فشل في تحليل ملف PDF');
      }

      const extractedResult = await extractResponse.json();
      setExtractedData(extractedResult.data);
      setRawText(extractedResult.rawText || '');

      // Step 2: Calculate construction costs
      setAnalysisStep('حساب التكاليف والكميات...');
      
      const costResponse = await fetch('/api/ai/calculate-blueprint-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedData: extractedResult.data,
          location: 'الرياض', // Default location
          finishLevel: 'standard',
        }),
      });

      if (!costResponse.ok) {
        throw new Error('فشل في حساب التكاليف');
      }

      const costResult = await costResponse.json();
      setCostEstimate(costResult.estimate);

      setAnalysisStep('تم التحليل بنجاح!');
      
    } catch (err) {
      console.error('PDF Analysis Error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحليل المخطط');
    } finally {
      setTimeout(() => {
        setProcessing(false);
        setAnalysisStep('');
      }, 1000);
    }
  };

  const recalculateWithEdits = async () => {
    if (!extractedData) return;

    const updatedData = { ...extractedData, ...editableData };
    setProcessing(true);
    setAnalysisStep('إعادة حساب التكاليف...');

    try {
      const costResponse = await fetch('/api/ai/calculate-blueprint-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedData: updatedData,
          location: 'الرياض',
          finishLevel: 'standard',
        }),
      });

      const costResult = await costResponse.json();
      setCostEstimate(costResult.estimate);
      
    } catch (err) {
      setError('فشل في إعادة حساب التكاليف');
    } finally {
      setProcessing(false);
      setAnalysisStep('');
    }
  };

  const exportReport = () => {
    if (!extractedData || !costEstimate) return;

    const report = {
      projectName: file?.name.replace('.pdf', '') || 'مشروع غير محدد',
      analysisDate: new Date().toLocaleDateString('en-US'),
      extractedData,
      costEstimate,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_التكلفة_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">محلل المخططات المعمارية بالذكاء الاصطناعي</h2>
            <p className="text-gray-600">تحليل ملفات PDF للمخططات المعمارية وحساب التكاليف تلقائياً</p>
          </div>
        </div>

        {/* File Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            file ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-green-700">{file.name}</p>
                <p className="text-sm text-green-600">
                  {(file.size / 1024 / 1024).toFixed(2)} ميجابايت
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                اسحب وأفلت ملف PDF هنا أو انقر للاختيار
              </p>
              <p className="text-sm text-gray-500">
                يدعم ملفات PDF للمخططات المعمارية والتصاميم الهندسية
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={analyzePDF}
            disabled={!file || processing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                تحليل المخطط
              </>
            )}
          </Button>
          
          {rawText && (
            <Button
              variant="outline"
              onClick={() => setShowExtractedText(!showExtractedText)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showExtractedText ? 'إخفاء النص' : 'عرض النص المستخرج'}
            </Button>
          )}
        </div>
      </Card>

      {/* Processing Status */}
      {processing && analysisStep && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-blue-700 font-medium">{analysisStep}</span>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        </Card>
      )}

      {/* Extracted Text Display */}
      {showExtractedText && rawText && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            النص المستخرج من PDF
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{rawText}</pre>
          </div>
        </Card>
      )}

      {/* Extracted Data Display */}
      {extractedData && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              البيانات المستخرجة من المخطط
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">دقة التحليل:</span>
              <span className={`font-medium ${extractedData.confidence > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                {extractedData.confidence}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rooms Data */}
            <div>
              <h4 className="font-medium mb-3 text-gray-800">الغرف والمساحات</h4>
              <div className="space-y-2">
                {extractedData.rooms.map((room, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-sm text-gray-600">
                      {room.width} × {room.length} م = {room.area} م²
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-700">إجمالي المساحة</div>
                  <div className="text-lg font-bold text-blue-800">{extractedData.totalArea} م²</div>
                </div>
              </div>
            </div>

            {/* Plot Dimensions */}
            <div>
              <h4 className="font-medium mb-3 text-gray-800">أبعاد الأرض</h4>
              <div className="space-y-2">
                {extractedData.dimensions.plotWidth && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">العرض: </span>
                    <span className="font-medium">{extractedData.dimensions.plotWidth} م</span>
                  </div>
                )}
                {extractedData.dimensions.plotLength && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">الطول: </span>
                    <span className="font-medium">{extractedData.dimensions.plotLength} م</span>
                  </div>
                )}
                {extractedData.dimensions.floors && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">عدد الطوابق: </span>
                    <span className="font-medium">{extractedData.dimensions.floors}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantities */}
            <div>
              <h4 className="font-medium mb-3 text-gray-800">الكميات المستخرجة</h4>
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">الجدران: </span>
                  <span className="font-medium">{extractedData.quantities.walls} م طولي</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">الأبواب: </span>
                  <span className="font-medium">{extractedData.quantities.doors} باب</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">النوافذ: </span>
                  <span className="font-medium">{extractedData.quantities.windows} نافذة</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">النقاط الكهربائية: </span>
                  <span className="font-medium">{extractedData.quantities.electricalPoints} نقطة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={recalculateWithEdits}
              disabled={processing}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              تعديل البيانات وإعادة الحساب
            </Button>
          </div>
        </Card>
      )}

      {/* Cost Estimate Display */}
      {costEstimate && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-green-600" />
              تقدير التكاليف الذكي
            </h3>
            <Button onClick={exportReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              تصدير التقرير
            </Button>
          </div>

          {/* Total Cost */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-6 border border-green-200">
            <div className="text-center">
              <div className="text-sm text-green-600 mb-2">التكلفة الإجمالية المقدرة</div>
              <div className="text-4xl font-bold text-green-700">
                {costEstimate.totalCost.toLocaleString('en-US')} ريال
              </div>
              <div className="text-sm text-green-600 mt-2">
                تشمل المواد والعمالة (بدون أرباح المقاول)
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-4">تفصيل التكاليف حسب المرحلة</h4>
              <div className="space-y-3">
                {Object.entries(costEstimate.breakdown).map(([phase, cost]) => (
                  <div key={phase} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{getPhaseNameArabic(phase)}</span>
                    <span className="font-bold text-gray-800">{cost.toLocaleString('en-US')} ر.س</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">المواد الرئيسية</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {costEstimate.materials.slice(0, 10).map((material, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{material.name}</div>
                        <div className="text-sm text-gray-600">
                          {material.quantity} {material.unit} × {material.unitPrice} ر.س
                        </div>
                      </div>
                      <div className="font-bold text-right">
                        {material.totalPrice.toLocaleString('en-US')} ر.س
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">الجدول الزمني المقدر</h4>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-center mb-4">
                <span className="text-blue-600 font-medium">مدة التنفيذ المقدرة: </span>
                <span className="text-2xl font-bold text-blue-700">{costEstimate.timeline.estimated_duration} شهر</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {costEstimate.timeline.phases.map((phase, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg">
                    <div className="font-medium text-sm">{phase.name}</div>
                    <div className="text-blue-600 font-bold">{phase.duration} شهر</div>
                    <div className="text-xs text-gray-600">{phase.cost.toLocaleString('en-US')} ر.س</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">توصيات الذكاء الاصطناعي</h4>
            <div className="space-y-3">
              {costEstimate.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-800">{recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost-Saving Alternatives */}
          {costEstimate.alternatives.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4">بدائل توفير التكلفة</h4>
              <div className="space-y-3">
                {costEstimate.alternatives.map((alternative, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-green-800">{alternative.description}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                        وفر {alternative.savings.toLocaleString('en-US')} ر.س
                      </span>
                    </div>
                    <div className="text-sm text-green-600">{alternative.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold mb-4">كيفية الاستخدام</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-blue-700">متطلبات الملف</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ملف PDF يحتوي على مخططات معمارية</li>
              <li>• أبعاد واضحة ومكتوبة بالأرقام</li>
              <li>• أسماء الغرف والمساحات باللغة العربية أو الإنجليزية</li>
              <li>• جودة عالية للنص والرسوم</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-700">نصائح للحصول على أفضل النتائج</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• تأكد من وضوح الأبعاد في المخطط</li>
              <li>• تحقق من صحة البيانات المستخرجة قبل الحساب</li>
              <li>• يمكن تعديل البيانات يدوياً إذا لزم الأمر</li>
              <li>• التكاليف تقديرية وقد تختلف حسب السوق</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper function to translate phase names to Arabic
const getPhaseNameArabic = (phase: string): string => {
  const translations: Record<string, string> = {
    foundation: 'الأساسات',
    structure: 'الهيكل الإنشائي',
    walls: 'الجدران',
    roofing: 'السقف',
    electrical: 'الكهرباء',
    plumbing: 'السباكة',
    finishing: 'التشطيبات',
    labor: 'العمالة',
  };
  return translations[phase] || phase;
};

export default PDFBlueprintAnalyzer;








