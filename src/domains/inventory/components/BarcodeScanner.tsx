// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Camera, Zap, Scan, Package, AlertCircle } from 'lucide-react';
import BarcodeScanner from '@/components/barcode/BarcodeScanner';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: number;
  stock: number;
  description?: string;
  type?: string;
  category?: string;
  unit?: string;
}

interface EnhancedBarcodeScannerProps {
  onScan: (barcode: string) => void;
  onProductFound?: (product: Product) => void;
  onClose: () => void;
  title?: string;
}

export default function EnhancedBarcodeScanner({ 
  onScan, 
  onProductFound, 
  onClose, 
  title = 'مسح الباركود' 
}: EnhancedBarcodeScannerProps) {
  const [scannedCode, setScannedCode] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Product | null>(null);
  const [searchError, setSearchError] = useState<string>('');
  const [manualInput, setManualInput] = useState('');

  const handleScan = async (barcode: string) => {
    setScannedCode(barcode);
    setSearchError('');
    setIsSearching(true);

    try {
      // Search in construction products first
      const constructionResponse = await fetch(`/api/products/construction?barcode=${barcode}`);
      if (constructionResponse.ok) {
        const constructionData = await constructionResponse.json();
        if (constructionData.products && constructionData.products.length > 0) {
          const product = constructionData.products[0];
          const formattedProduct: Product = {
            id: product.id,
            name: product.name_ar,
            barcode: product.barcode,
            price: product.price,
            stock: product.stock_quantity,
            description: product.description_ar,
            type: 'construction',
            category: product.category_name,
            unit: product.unit,
          };
          setSearchResult(formattedProduct);
          onProductFound?.(formattedProduct);
          setIsSearching(false);
          return;
        }
      }

      // If not found in construction products, search in other sources
      // (Add other product APIs here)
      
      setSearchError('لم يتم العثور على منتج بهذا الباركود');
    } catch (error) {
      console.error('Error searching for product:', error);
      setSearchError('حدث خطأ أثناء البحث عن المنتج');
    } finally {
      setIsSearching(false);
    }

    // Always call the onScan callback
    onScan(barcode);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
    }
  };

  const validateSaudiBarcode = (barcode: string): boolean => {
    // Saudi barcodes typically start with 628
    const saudiPrefix = /^628\d{10}$/;
    return saudiPrefix.test(barcode) || /^\d{8,14}$/.test(barcode);
  };

  const getBarcodeInfo = (barcode: string) => {
    if (!barcode) return null;
    
    if (barcode.startsWith('628')) {
      return {
        type: 'Saudi Barcode',
        typeAr: 'باركود سعودي',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    } else if (barcode.length === 13 || barcode.length === 12) {
      return {
        type: 'International EAN/UPC',
        typeAr: 'باركود دولي',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    } else {
      return {
        type: 'Custom Code',
        typeAr: 'رمز مخصص',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      };
    }
  };

  const barcodeInfo = getBarcodeInfo(scannedCode);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scan className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">امسح الباركود أو أدخله يدوياً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner */}
        <div className="p-6">
          <div className="mb-6">
            <BarcodeScanner 
              onScan={handleScan} 
              onClose={onClose}
            />
          </div>

          {/* Manual Input */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">إدخال يدوي</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                placeholder="أدخل الباركود يدوياً"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
              />
              <button
                onClick={handleManualSubmit}
                disabled={!manualInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                بحث
              </button>
            </div>
          </div>

          {/* Scanned Code Display */}
          {scannedCode && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">الباركود المسحوب</h4>
                {barcodeInfo && (
                  <span className={`text-xs px-2 py-1 rounded-full ${barcodeInfo.bgColor} ${barcodeInfo.color}`}>
                    {barcodeInfo.typeAr}
                  </span>
                )}
              </div>
              <div className="font-mono text-lg text-gray-900 bg-white p-3 rounded border">
                {scannedCode}
              </div>
              {!validateSaudiBarcode(scannedCode) && scannedCode.length > 0 && (
                <div className="mt-2 flex items-center text-sm text-orange-600">
                  <AlertCircle className="w-4 h-4 ml-1" />
                  هذا الباركود قد لا يتبع المعايير السعودية
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 ml-3"></div>
                <span className="text-blue-800">جاري البحث عن المنتج...</span>
              </div>
            </div>
          )}

          {/* Search Result */}
          {searchResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 mb-1">تم العثور على المنتج</h4>
                  <div className="text-sm text-green-700">
                    <p className="font-medium">{searchResult.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-green-600">السعر: </span>
                        <span className="font-medium">{searchResult.price.toLocaleString('en-US')} ر.س</span>
                      </div>
                      <div>
                        <span className="text-green-600">المخزون: </span>
                        <span className="font-medium">{searchResult.stock} {searchResult.unit || 'قطعة'}</span>
                      </div>
                      {searchResult.category && (
                        <div className="col-span-2">
                          <span className="text-green-600">الفئة: </span>
                          <span className="font-medium">{searchResult.category}</span>
                        </div>
                      )}
                    </div>
                    {searchResult.description && (
                      <p className="mt-2 text-green-600">{searchResult.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Error */}
          {searchError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
                <span className="text-red-700">{searchError}</span>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">نصائح للحصول على أفضل النتائج:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• تأكد من إضاءة جيدة عند المسح</li>
              <li>• احرص على وضوح الباركود وعدم تشويهه</li>
              <li>• للباركود السعودي: يجب أن يبدأ بـ 628</li>
              <li>• يمكنك إدخال الباركود يدوياً إذا لم يتم المسح بنجاح</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end gap-3">
            {searchResult && (
              <button
                onClick={() => {
                  onProductFound?.(searchResult);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                إضافة المنتج
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}






