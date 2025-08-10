"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Shield, Upload, Calendar, DollarSign, Package, ArrowRight, FileText, Search, Bot, Sparkles } from 'lucide-react';
import { StoreSearch } from '@/core/shared/components/StoreSearch';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic'

interface Store {
  id: string;
  name: string;
  category?: string;
  rating: number;
  location: string;
  verified?: boolean;
  description?: string;
  phone?: string;
  reviews?: number;
  image?: string;
}

export default function NewWarrantyPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [showStoreSearch, setShowStoreSearch] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    store: '',
    storeId: '',
    purchaseDate: '',
    warrantyPeriod: '',
    warrantyType: '',
    receiptNumber: '',
    value: '',
    description: '',
    receiptImage: null as File | null
  });
  const [warranties, setWarranties] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchWarranties(user.id);
    }
  }, [user]);

  const fetchWarranties = async (userId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setWarranties(data || []);
    } catch (error) {
      console.error('Error fetching warranties:', error);
      setWarranties([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setFormData(prev => ({ 
      ...prev, 
      store: store.name,
      storeId: store.id
    }));
    setShowStoreSearch(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, receiptImage: file }));
      
      // Show AI processing option
      const useAI = window.confirm(
        'هل تريد استخدام الذكاء الاصطناعي لاستخراج بيانات الفاتورة تلقائياً؟\n\n' +
        '• سيتم تحليل الفاتورة واستخراج المعلومات\n' +
        '• خدمة مدفوعة: 5 ريال سعودي\n' +
        '• دقة عالية في استخراج البيانات'
      );

      if (useAI) {
        await processInvoiceWithAI(file);
      }
    }
  };

  const processInvoiceWithAI = async (file: File) => {
    setIsAIProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Integrate with real AI extraction or Supabase data
      const extractedData = {
        productName: 'مصابيح LED عالية الكفاءة - عبوة 3 قطع',
        store: 'متجر الإضاءة المتطورة',
        purchaseDate: '2024-07-20',
        value: '450.00',
        receiptNumber: 'INV-2024-001587',
        warrantyPeriod: '24'
      };

      // Find matching store
      const matchingStore = {
        id: 'store-4',
        name: 'متجر الإضاءة المتطورة',
        category: 'إضاءة',
        rating: 4.7,
        reviews: 156,
        location: 'الرياض، حي الورود',
        verified: true,
        image: '/api/placeholder/100/100',
        description: 'حلول الإضاءة الحديثة والذكية'
      };

      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));

      setSelectedStore(matchingStore);
      
      alert(
        '✅ تم استخراج البيانات بنجاح!\n\n' +
        `المنتج: ${extractedData.productName}\n` +
        `المتجر: ${extractedData.store}\n` +
        `التاريخ: ${extractedData.purchaseDate}\n` +
        `القيمة: ${extractedData.value} ر.س\n` +
        `رقم الفاتورة: ${extractedData.receiptNumber}\n\n` +
        'يرجى مراجعة البيانات وتعديلها إذا لزم الأمر'
      );

    } catch (error) {
      alert('حدث خطأ في معالجة الفاتورة. يرجى إدخال البيانات يدوياً.');
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStore) {
      alert('يرجى اختيار المتجر');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Submitting warranty registration:', formData);
    
    // Show success message and redirect
    alert('تم تسجيل الضمان بنجاح!');
    router.push('/user/warranties');
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
        
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          تسجيل ضمان جديد
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          قم بتسجيل ضمان منتج جديد لضمان حماية حقوقك
        </Typography>
      </div>

      <EnhancedCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900 border-b pb-2">
              معلومات المنتج
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <Package className="w-4 h-4 inline ml-1" />
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  المتجر *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="store"
                    value={formData.store}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المتجر"
                    readOnly
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowStoreSearch(true)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    اختر متجر
                  </Button>
                </div>
                {selectedStore && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedStore.image}
                        alt={selectedStore.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <Typography variant="body" size="sm" weight="medium" className="text-green-800">
                          {selectedStore.name}
                        </Typography>
                        <Typography variant="caption" size="xs" className="text-green-600">
                          {selectedStore.category} • {selectedStore.location}
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <Calendar className="w-4 h-4 inline ml-1" />
                  تاريخ الشراء *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  مدة الضمان *
                </label>
                <select
                  name="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر مدة الضمان</option>
                  <option value="6">6 أشهر</option>
                  <option value="12">سنة واحدة</option>
                  <option value="24">سنتان</option>
                  <option value="36">3 سنوات</option>
                  <option value="60">5 سنوات</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  نوع الضمان *
                </label>
                <select
                  name="warrantyType"
                  value={formData.warrantyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر نوع الضمان</option>
                  <option value="manufacturer">ضمان الشركة المصنعة</option>
                  <option value="store">ضمان المتجر</option>
                  <option value="extended">ضمان ممتد</option>
                  <option value="comprehensive">ضمان شامل</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <DollarSign className="w-4 h-4 inline ml-1" />
                  قيمة المنتج (ريال سعودي) *
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FileText className="w-4 h-4 inline ml-1" />
                رقم الفاتورة
              </label>
              <input
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="رقم الفاتورة أو الإيصال"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                وصف المنتج
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="وصف مختصر للمنتج ومواصفاته"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Upload className="w-4 h-4 inline ml-1" />
                صورة الفاتورة أو الإيصال
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {isAIProcessing && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <div>
                      <Typography variant="body" size="sm" weight="medium" className="text-blue-800">
                        جاري معالجة الفاتورة بالذكاء الاصطناعي...
                      </Typography>
                      <Typography variant="caption" size="xs" className="text-blue-600">
                        يتم استخراج البيانات، يرجى الانتظار
                      </Typography>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <Typography variant="body" size="sm" weight="medium" className="text-purple-800 mb-1 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      خدمة الذكاء الاصطناعي لاستخراج البيانات
                    </Typography>
                    <Typography variant="caption" size="sm" className="text-purple-700">
                      ارفع صورة الفاتورة وسيقوم الذكاء الاصطناعي باستخراج جميع البيانات تلقائياً
                      <br />
                      • اكتشاف اسم المنتج والمتجر • استخراج التاريخ والسعر • تحديد مدة الضمان
                      <br />
                      <span className="font-medium">الرسوم: 5 ريال سعودي فقط</span>
                    </Typography>
                  </div>
                </div>
              </div>

              <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                يُفضل رفع صورة واضحة للفاتورة أو الإيصال
              </Typography>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              تسجيل الضمان
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </EnhancedCard>

      {/* Help Section */}
      <EnhancedCard className="mt-8 p-6 bg-blue-50 border-blue-200">
        <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-900 mb-3">
          💡 نصائح مهمة
        </Typography>
        <ul className="space-y-2 text-blue-800">
          <li>• احتفظ بالفاتورة الأصلية والإيصال</li>
          <li>• تأكد من تاريخ الشراء الصحيح</li>
          <li>• اقرأ شروط الضمان بعناية</li>
          <li>• احفظ المنتج في مكان آمن</li>
          <li>• راجع تغطية الضمان والاستثناءات</li>
        </ul>
      </EnhancedCard>
      
      {/* Store Search Modal */}
      {showStoreSearch && (
        <StoreSearch
          onSelect={handleStoreSelect}
          onCancel={() => setShowStoreSearch(false)}
          selectedStore={selectedStore}
        />
      )}
    </div>
  );
}

