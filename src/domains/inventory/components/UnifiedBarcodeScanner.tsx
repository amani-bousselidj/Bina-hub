// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Camera, Package, Search, ShoppingCart, Building, Scan, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui';

interface Product {
  id: string;
  name: string;
  name_ar?: string;
  barcode?: string;
  price: number;
  stock: number;
  stock_quantity?: number;
  description?: string;
  description_ar?: string;
  category?: string;
  category_name?: string;
  type: 'construction' | 'regular';
  unit?: string;
  brand?: string;
  image_url?: string;
  specifications?: any;
}

interface UnifiedBarcodeScannerProps {
  onProductSelect: (product: Product) => void;
  onClose: () => void;
  title?: string;
  mode?: 'all' | 'construction' | 'regular';
  storeId?: string;
}

export default function UnifiedBarcodeScanner({
  onProductSelect,
  onClose,
  title = 'مسح الباركود',
  mode = 'all',
  storeId
}: UnifiedBarcodeScannerProps) {
  const [scannedCode, setScannedCode] = useState<string>('');
  const [manualInput, setManualInput] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('manual');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('تعذر الوصول إلى الكاميرا. يرجى التحقق من الصلاحيات.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Search for products by barcode
  const searchProducts = async (barcode: string) => {
    if (!barcode.trim()) return;

    setIsSearching(true);
    setError('');
    setSearchResults([]);

    try {
      const results: Product[] = [];

      // Search construction products if mode allows
      if (mode === 'all' || mode === 'construction') {
        try {
          const constructionResponse = await fetch(`/api/products/construction?barcode=${encodeURIComponent(barcode)}`);
          if (constructionResponse.ok) {
            const constructionData = await constructionResponse.json();
            if (constructionData.products && constructionData.products.length > 0) {
              const constructionProducts = constructionData.products.map((product: any) => ({
                id: product.id,
                name: product.name_ar || product.name_en,
                name_ar: product.name_ar,
                barcode: product.barcode,
                price: product.selling_price || product.price,
                stock: product.current_stock || product.stock_quantity || 0,
                description: product.description_ar || product.description_en,
                description_ar: product.description_ar,
                category: product.category_name,
                type: 'construction' as const,
                unit: product.unit_of_measure || product.unit,
                brand: product.brand_ar || product.brand_en,
                image_url: product.images?.[0],
                specifications: product.specifications,
              }));
              results.push(...constructionProducts);
            }
          }
        } catch (constructionError) {
          console.error('Error searching construction products:', constructionError);
        }
      }

      // Search regular store products if mode allows
      if (mode === 'all' || mode === 'regular') {
        try {
          const storeParam = storeId ? `&store_id=${storeId}` : '';
          const regularResponse = await fetch(`/api/barcode-search?barcode=${encodeURIComponent(barcode)}${storeParam}`);
          if (regularResponse.ok) {
            const regularData = await regularResponse.json();
            if (regularData.products && regularData.products.length > 0) {
              const regularProducts = regularData.products.map((product: any) => ({
                id: product.id,
                name: product.name,
                barcode: product.barcode,
                price: product.price,
                stock: product.stock_quantity || product.stock || 0,
                description: product.description,
                category: product.category,
                type: 'regular' as const,
                brand: product.brand,
                image_url: product.image_url,
              }));
              results.push(...regularProducts);
            }
          }
        } catch (regularError) {
          console.error('Error searching regular products:', regularError);
        }
      }

      if (results.length === 0) {
        setError(`لم يتم العثور على منتج بالباركود: ${barcode}`);
      } else {
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('حدث خطأ أثناء البحث');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle barcode scan
  const handleScan = (barcode: string) => {
    setScannedCode(barcode);
    searchProducts(barcode);
    if (scanMode === 'camera') {
      stopCamera();
      setScanMode('manual');
    }
  };

  // Handle manual submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
    }
  };

  // Get barcode type info
  const getBarcodeInfo = (barcode: string) => {
    if (!barcode) return null;
    
    if (barcode.startsWith('628') || barcode.startsWith('629')) {
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

  // Product type icon
  const getProductTypeIcon = (type: 'construction' | 'regular') => {
    return type === 'construction' ? (
      <Building className="w-4 h-4 text-orange-600" />
    ) : (
      <Package className="w-4 h-4 text-blue-600" />
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {mode !== 'all' && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {mode === 'construction' ? 'مواد البناء فقط' : 'المنتجات العامة فقط'}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex gap-2 mb-4">
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => {
                setScanMode('manual');
                stopCamera();
              }}
              className="flex-1"
            >
              <Search className="w-4 h-4 ml-2" />
              إدخال يدوي
            </Button>
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => {
                setScanMode('camera');
                startCamera();
              }}
              className="flex-1"
            >
              <Camera className="w-4 h-4 ml-2" />
              مسح بالكاميرا
            </Button>
          </div>

          {/* Manual Input */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="أدخل رقم الباركود أو اسم المنتج..."
                className="flex-1"
                autoFocus
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? 'جاري البحث...' : 'بحث'}
              </Button>
            </form>
          )}

          {/* Camera View */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              {isScanning ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg bg-gray-900"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
                      <span className="text-blue-500 text-sm">وجه الباركود هنا</span>
                    </div>
                  </div>
                  <Button
                    onClick={stopCamera}
                    className="absolute top-2 left-2"
                    variant="outline"
                    size="sm"
                  >
                    إيقاف المسح
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">اضغط على "مسح بالكاميرا" لتشغيل الكاميرا</p>
                </div>
              )}
            </div>
          )}

          {/* Scanned Code Display */}
          {scannedCode && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">الباركود الممسوح:</span>
                  <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{scannedCode}</code>
                </div>
                {getBarcodeInfo(scannedCode) && (
                  <span className={`px-2 py-1 rounded-full text-xs ${getBarcodeInfo(scannedCode)?.bgColor} ${getBarcodeInfo(scannedCode)?.color}`}>
                    {getBarcodeInfo(scannedCode)?.typeAr}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
            <div className="mt-2 text-sm text-red-600">
              <p>نصائح:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>تأكد من وضوح الباركود وعدم تلفه</li>
                <li>جرب البحث باسم المنتج بدلاً من الباركود</li>
                <li>تحقق من أن المنتج متوفر في النظام</li>
              </ul>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Search className="w-5 h-5" />
                نتائج البحث ({searchResults.length})
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((product) => (
                  <Card key={product.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onProductSelect(product)}>
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          getProductTypeIcon(product.type)
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getProductTypeIcon(product.type)}
                              <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.type === 'construction' 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {product.type === 'construction' ? 'مواد بناء' : 'منتج عام'}
                              </span>
                            </div>
                            
                            {product.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {product.barcode && (
                                <span>الباركود: {product.barcode}</span>
                              )}
                              {product.category && (
                                <span>الفئة: {product.category}</span>
                              )}
                              {product.brand && (
                                <span>العلامة التجارية: {product.brand}</span>
                              )}
                            </div>
                          </div>

                          {/* Price and Stock */}
                          <div className="text-left flex-shrink-0">
                            <div className="text-lg font-bold text-blue-600">
                              {product.price.toLocaleString('en-US')} ر.س
                            </div>
                            <div className={`text-sm ${
                              product.stock > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              المخزون: {product.stock} {product.unit || 'قطعة'}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            disabled={product.stock === 0}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                          >
                            <ShoppingCart className="w-4 h-4 ml-1" />
                            {product.stock === 0 ? 'نفذ المخزون' : 'إضافة للطلب'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                نصيحة: يمكنك البحث بالباركود أو اسم المنتج
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-orange-600" />
                  <span>مواد بناء</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-blue-600" />
                  <span>منتجات عامة</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}









