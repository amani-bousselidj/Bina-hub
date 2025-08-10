// @ts-nocheck
'use client';

import { useState, useRef } from 'react';
import { ClientIcon } from '@/components/ui';
import { Button } from '@/components/ui/enhanced-components';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ExpenseData {
  vendor: string;
  amount: number;
  date: string;
  category: string;
  items: string[];
  confidence: number;
}

interface AIExpenseTrackerProps {
  userId: string;
  onExpenseAdded?: (expense: ExpenseData) => void;
}

export default function AIExpenseTracker({ userId, onExpenseAdded }: AIExpenseTrackerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExpenseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      setError('يرجى تحديد ملف PDF أو صورة');
      return;
    }

    setUploadedFile(file);
    setError(null);
    await processReceipt(file);
  };

  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      // Call our AI processing API
      const response = await fetch('/api/ai/process-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل في معالجة الملف');
      }

      const result = await response.json();
      setExtractedData(result.expenseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في المعالجة');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveExpense = async () => {
    if (!extractedData) return;

    try {
      const response = await fetch('/api/user/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...extractedData,
          source: 'ai_processed',
          processedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ المصروف');
      }

      const savedExpense = await response.json();
      onExpenseAdded?.(savedExpense);
      
      // Reset form
      setUploadedFile(null);
      setExtractedData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حفظ المصروف');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <ClientIcon type="ai" size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">تتبع المصروفات بالذكاء الاصطناعي</h3>
          <p className="text-gray-600 text-sm">ارفع فاتورة أو إيصال وسيتم استخراج البيانات تلقائياً</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <ClientIcon type="settings" size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">اسحب وأفلت ملف PDF أو صورة هنا</p>
          <p className="text-sm text-gray-500">أو انقر لتحديد ملف</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <LoadingSpinner />
            <div>
              <p className="text-blue-800 font-medium">جاري معالجة الملف بالذكاء الاصطناعي...</p>
              <p className="text-blue-600 text-sm">استخراج البيانات من الفاتورة</p>
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

      {/* Extracted Data Display */}
      {extractedData && (
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ClientIcon type="settings" size={20} className="text-green-600" />
            <h4 className="text-green-800 font-medium">تم استخراج البيانات بنجاح</h4>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
              دقة: {Math.round(extractedData.confidence * 100)}%
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المورد</label>
              <p className="bg-white rounded-lg p-3 border">{extractedData.vendor}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ</label>
              <p className="bg-white rounded-lg p-3 border">{extractedData.amount.toLocaleString('en-US')} ريال</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
              <p className="bg-white rounded-lg p-3 border">{extractedData.date}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
              <p className="bg-white rounded-lg p-3 border">{extractedData.category}</p>
            </div>
          </div>
          
          {extractedData.items.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">العناصر المشتراة</label>
              <div className="bg-white rounded-lg p-3 border">
                <ul className="space-y-1">
                  {extractedData.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            <Button
              onClick={saveExpense}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              حفظ المصروف
            </Button>
            <Button
              variant="secondary"
              onClick={() => setExtractedData(null)}
            >
              إعادة المعالجة
            </Button>
          </div>
        </div>
      )}

      {/* Recent AI Processed Expenses */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">المصروفات المعالجة بالذكاء الاصطناعي</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClientIcon type="ai" size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">مواد بناء - محل الصالحي</p>
                <p className="text-xs text-gray-500">معالج تلقائياً • دقة 94%</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-800">2,450 ريال</span>
          </div>
        </div>
      </div>
    </div>
  );
}





