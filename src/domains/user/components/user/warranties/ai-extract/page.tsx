"use client"

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Upload, ArrowRight, Zap, CheckCircle, AlertCircle, Eye, Calendar, Shield, DollarSign, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface ExtractedData {
  productName: string;
  store: string;
  purchaseDate: string;
  price: number;
  receiptNumber: string;
  warrantyPeriod: string;
  confidence: number;
}

export default function AIExtractionPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (selectedFile: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      setLocalError('نوع الملف غير مدعوم. يرجى استخدام JPG, PNG, أو PDF');
      return;
    }

    if (selectedFile.size > maxSize) {
      setLocalError('حجم الملف كبير جداً. الحد الأقصى 10MB');
      return;
    }

    setFile(selectedFile);
    setLocalError(null);
  };

  const simulateAIExtraction = async (): Promise<ExtractedData> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // TODO: Integrate with real AI extraction or Supabase data
    return {
      productName: 'مضخة المياه الذكية عالية الكفاءة',
      store: 'متجر الأدوات الصحية المتقدمة',
      purchaseDate: '2024-07-15',
      price: 850,
      receiptNumber: 'REC-2024-001857',
      warrantyPeriod: '24 شهر',
      confidence: 94.5
    };
  };

  const handleExtract = async () => {
    if (!file) return;

    setExtracting(true);
    setLocalError(null);

    try {
      const data = await simulateAIExtraction();
      setExtractedData(data);
    } catch (err) {
      setLocalError('فشل في استخراج البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setExtracting(false);
    }
  };

  const handleCreateWarranty = () => {
    if (extractedData) {
      // Navigate to warranty creation with pre-filled data
      const params = new URLSearchParams({
        productName: extractedData.productName,
        store: extractedData.store,
        purchaseDate: extractedData.purchaseDate,
        price: extractedData.price.toString(),
        receiptNumber: extractedData.receiptNumber,
        warrantyPeriod: extractedData.warrantyPeriod,
        fromAI: 'true'
      });
      router.push(`/user/warranties/new?${params.toString()}`);
    }
  };

  
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
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowRight className="w-5 h-5" />
          العودة للضمانات
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900">
              خدمة الذكاء الاصطناعي
            </Typography>
            <Typography variant="body" size="lg" className="text-gray-600">
              استخراج بيانات الضمان من الفاتورة تلقائياً
            </Typography>
          </div>
        </div>

        {/* Service Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600" />
            <Typography variant="caption" size="sm" className="text-blue-800">
              اكتشاف اسم المنتج والمتجر
            </Typography>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
            <Typography variant="caption" size="sm" className="text-green-800">
              استخراج التاريخ والسعر
            </Typography>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <Shield className="w-5 h-5 text-purple-600" />
            <Typography variant="caption" size="sm" className="text-purple-800">
              تحديد مدة الضمان
            </Typography>
          </div>
        </div>
      </div>

      {!extractedData ? (
        <EnhancedCard className="p-8">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleChange}
              className="hidden"
              id="file-upload"
            />
            
            <div className="mb-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
            
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-2">
              ارفع صورة الفاتورة
            </Typography>
            
            <Typography variant="body" size="md" className="text-gray-600 mb-4">
              اسحب وأفلت الملف هنا أو انقر للاختيار
            </Typography>
            
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5" />
              اختر الملف
            </label>
            
            <Typography variant="caption" size="sm" className="text-gray-500 mt-4 block">
              يدعم: JPG, PNG, PDF • الحد الأقصى: 10MB
            </Typography>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <Typography variant="body" size="md" weight="medium">
                      {file.name}
                    </Typography>
                    <Typography variant="caption" size="sm" className="text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </div>
                </div>
                
                <Button
                  onClick={handleExtract}
                  disabled={extracting}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {extracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جاري الاستخراج...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 ml-2" />
                      استخراج البيانات
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Cost Information */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <Typography variant="subheading" size="md" weight="semibold" className="text-green-800">
                تكلفة الخدمة
              </Typography>
            </div>
            <Typography variant="body" size="md" className="text-green-700">
              5 ريال سعودي فقط • دقة عالية • سرعة في الاستخراج
            </Typography>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <Typography variant="body" size="md" className="text-red-700">
                  {error}
                </Typography>
              </div>
            </div>
          )}
        </EnhancedCard>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Success Header */}
          <EnhancedCard className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800">
                  تم استخراج البيانات بنجاح!
                </Typography>
                <Typography variant="body" size="md" className="text-green-700">
                  دقة الاستخراج: {extractedData.confidence}%
                </Typography>
              </div>
            </div>
          </EnhancedCard>

          {/* Extracted Data */}
          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 mb-6">
              البيانات المستخرجة
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">اسم المنتج</Typography>
                <Typography variant="body" size="lg" weight="medium" className="text-gray-900">
                  {extractedData.productName}
                </Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">اسم المتجر</Typography>
                <Typography variant="body" size="lg" weight="medium" className="text-gray-900">
                  {extractedData.store}
                </Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">تاريخ الشراء</Typography>
                <Typography variant="body" size="lg" weight="medium" className="text-gray-900">
                  {new Date(extractedData.purchaseDate).toLocaleDateString('en-US')}
                </Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">السعر</Typography>
                <Typography variant="body" size="lg" weight="medium" className="text-gray-900">
                  {extractedData.price.toLocaleString('en-US')} ريال سعودي
                </Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">رقم الفاتورة</Typography>
                <Typography variant="body" size="lg" weight="medium" className="text-gray-900">
                  {extractedData.receiptNumber}
                </Typography>
              </div>
              
              <div>
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">مدة الضمان</Typography>
                <Typography variant="body" size="lg" weight="medium" className="text-gray-900">
                  {extractedData.warrantyPeriod}
                </Typography>
              </div>
            </div>
          </EnhancedCard>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleCreateWarranty}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              إنشاء ضمان بهذه البيانات
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setExtractedData(null);
                setLocalError(null);
              }}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg"
            >
              استخراج فاتورة أخرى
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}



