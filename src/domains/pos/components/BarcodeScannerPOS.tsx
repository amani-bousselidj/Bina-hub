// @ts-nocheck
// Enhanced Barcode Scanner Component for Professional POS Systems
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Scan, X, Package, ShoppingCart, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BarcodeProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  barcode: string;
  stock_quantity?: number;
  category?: string;
  brand?: string;
  supplier?: string;
  image_url?: string;
  tax_rate?: number;
  is_active: boolean;
}

interface BarcodeScannerProps {
  onProductSelected: (product: BarcodeProduct) => void;
  onClose: () => void;
  storeId: string;
}

export default function BarcodeScanner({ onProductSelected, onClose, storeId }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [searchResults, setSearchResults] = useState<BarcodeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera scanning
  const startCameraScanning = async () => {
    try {
      setIsScanning(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('تعذر الوصول إلى الكاميرا. يرجى التأكد من إعطاء الصلاحيات اللازمة.');
      setIsScanning(false);
    }
  };

  // Stop camera scanning
  const stopCameraScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Search for product by barcode
  const searchByBarcode = async (barcode: string) => {
    if (!barcode.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/barcode-search?barcode=${encodeURIComponent(barcode)}&store_id=${storeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل في البحث عن المنتج');
      }

      if (data.products && data.products.length > 0) {
        setSearchResults(data.products);
      } else {
        setError(`لم يتم العثور على منتج بالباركود: ${barcode}`);
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching barcode:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في البحث');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual barcode input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchByBarcode(manualBarcode);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraScanning();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Scan className="w-6 h-6 ml-2" />
            مسح الباركود
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Scan Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => {
                setScanMode('manual');
                stopCameraScanning();
              }}
              className="flex-1"
            >
              <Package className="w-4 h-4 ml-2" />
              إدخال يدوي
            </Button>
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => {
                setScanMode('camera');
                startCameraScanning();
              }}
              className="flex-1"
            >
              <Camera className="w-4 h-4 ml-2" />
              مسح بالكاميرا
            </Button>
          </div>

          {/* Manual Input Mode */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <Input
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="أدخل رقم الباركود أو اسم المنتج..."
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'جاري البحث...' : 'بحث'}
                </Button>
              </form>
              
              <div className="text-sm text-gray-600">
                <p>يمكنك إدخال:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>رقم الباركود (UPC, EAN, Code128, إلخ)</li>
                  <li>اسم المنتج أو جزء منه</li>
                  <li>رقم SKU أو كود المنتج</li>
                </ul>
              </div>
            </div>
          )}

          {/* Camera Scanning Mode */}
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
                    onClick={stopCameraScanning}
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
                  <p className="text-gray-600 mb-4">اضغط على "بدء المسح" لتشغيل الكاميرا</p>
                  <Button onClick={startCameraScanning}>
                    بدء المسح
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 ml-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">نتائج البحث</h3>
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onProductSelected(product)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          {product.stock_quantity !== undefined && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                product.stock_quantity > 0
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              المخزون: {product.stock_quantity}
                            </span>
                          )}
                        </div>
                        
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>الباركود: {product.barcode}</span>
                          {product.category && <span>الفئة: {product.category}</span>}
                          {product.brand && <span>العلامة التجارية: {product.brand}</span>}
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <div className="text-lg font-bold text-blue-600">
                          {product.price.toFixed(2)} ريال
                        </div>
                        {product.tax_rate && (
                          <div className="text-xs text-gray-500">
                            + ضريبة {(product.tax_rate * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => alert('Button clicked')}>
                        <ShoppingCart className="w-4 h-4 ml-1" />
                        إضافة للفاتورة
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Add Popular Items */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات الشائعة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'أسمنت بورتلاندي',
                'حديد تسليح 12مم',
                'رمل بناء',
                'بلوك إسمنتي 20سم',
                'أنابيب PVC 4 بوصة',
                'سيراميك أرضيات'
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setManualBarcode(item)}
                  className="p-2 text-left text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>نصيحة: يمكنك أيضاً استخدام قارئ الباركود المحمول أو لوحة المفاتيح</span>
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}









