"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/Progress'
import { ArrowLeft, Upload, FileSpreadsheet, Download, AlertCircle } from 'lucide-react'

export default function ImportProductsPage() {
const supabase = createClientComponentClient();

  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importType, setImportType] = useState('products')
  const [results, setResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
        alert('يرجى اختيار ملف CSV أو Excel')
        return
      }
      setFile(selectedFile)
      setResults(null)
    }
  }

  const downloadTemplate = () => {
    // Generate CSV template based on import type
    let headers: string[] = []
    let []: string[] = []

    if (importType === 'products') {
      headers = [
        'title', 'description', 'sku', 'price', 'cost_price', 
        'category', 'status', 'weight', 'length', 'width', 'height',
        'quantity', 'low_stock_alert', 'tags'
      ]
      
    } else if (importType === 'inventory') {
      headers = ['sku', 'quantity', 'location', 'notes']
      
    } else if (importType === 'prices') {
      headers = ['sku', 'price', 'cost_price', 'sale_price', 'currency']
      
    }

    const csvContent = [headers.join(','), [].join(',')].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `template_${importType}.csv`
    link.click()
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)
    setResults(null)

    try {
      // Simulate file processing
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) {
          throw new Error('الملف فارغ')
        }

        const headers = lines[0].split(',')
        const dataLines = lines.slice(1)

        let successCount = 0
        let failedCount = 0
        const errors: string[] = []

        // Process each line
        for (let i = 0; i < dataLines.length; i++) {
          setProgress(((i + 1) / dataLines.length) * 100)
          
          try {
            const values = dataLines[i].split(',')
            if (values.length !== headers.length) {
              throw new Error(`السطر ${i + 2}: عدد الأعمدة غير متطابق`)
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 100))

            // Simulate some failures (10% failure rate)
            if (Math.random() < 0.1) {
              throw new Error(`السطر ${i + 2}: فشل في حفظ البيانات`)
            }

            // Create data object
            const data: any = {}
            headers.forEach((header, index) => {
              data[header.trim()] = values[index]?.trim()
            })

            // Save to localStorage based on import type
            if (importType === 'products') {
              const existingProducts = JSON.parse(localStorage.getItem('store_products') || '[]')
              const newProduct = {
                id: `PRD-${Date.now()}-${i}`,
                ...data,
                price: parseFloat(data.price) || 0,
                cost_price: parseFloat(data.cost_price) || 0,
                quantity: parseInt(data.quantity) || 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
              existingProducts.push(newProduct)
              localStorage.setItem('store_products', JSON.stringify(existingProducts))
            }

            successCount++
          } catch (error) {
            failedCount++
            errors.push(error instanceof Error ? error.message : 'خطأ غير معروف')
          }
        }

        setResults({ success: successCount, failed: failedCount, errors })
      }

      reader.readAsText(file, 'UTF-8')
    } catch (error) {
      console.error('Import error:', error)
      setResults({ 
        success: 0, 
        failed: 1, 
        errors: [error instanceof Error ? error.message : 'فشل في قراءة الملف'] 
      })
    } finally {
      setImporting(false)
      setProgress(100)
    }
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          <div className="flex items-center gap-3">
            <Upload className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">استيراد البيانات</h1>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Import Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                نوع الاستيراد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اختر نوع البيانات المراد استيرادها
                </label>
                <Select value={importType} onValueChange={setImportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">المنتجات</SelectItem>
                    <SelectItem value="inventory">المخزون</SelectItem>
                    <SelectItem value="prices">الأسعار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                اختيار الملف
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <FileSpreadsheet className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 font-medium">
                    اسحب وأفلت ملف CSV أو Excel هنا
                  </p>
                  <p className="text-xs text-gray-500">
                    أو انقر على الزر أدناه لاختيار الملف
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="max-w-sm mx-auto"
                  />
                </div>
              </div>

              {file && (
                <Alert className="border-green-200 bg-green-50">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <span className="font-medium">تم اختيار الملف:</span> {file.name} 
                    <span className="text-green-600"> ({(file.size / 1024).toFixed(1)} KB)</span>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4" />
                  تحميل القالب
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Import Progress */}
          {importing && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Upload className="w-5 h-5 animate-pulse" />
                  جارٍ الاستيراد...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full h-3" />
                <p className="text-sm text-blue-700 mt-3 font-medium">
                  {progress.toFixed(0)}% مكتمل
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  نتائج الاستيراد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {results.success}
                    </div>
                    <div className="text-sm font-medium text-green-700">نجح</div>
                  </div>
                  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      {results.failed}
                    </div>
                    <div className="text-sm font-medium text-red-700">فشل</div>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2 text-red-900">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      الأخطاء المكتشفة:
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {results.errors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-md">
                          {error}
                        </div>
                      ))}
                      {results.errors.length > 10 && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md text-center">
                          و {results.errors.length - 10} خطأ آخر...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {results.success > 0 && (
                  <Button 
                    onClick={() => router.push('/store/products?imported=true')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    عرض المنتجات المستوردة
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructions */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <AlertCircle className="w-5 h-5" />
                التعليمات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-3 text-gray-900">تنسيق الملف:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs mt-1">•</span>
                    ملفات CSV أو Excel فقط
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs mt-1">•</span>
                    الصف الأول يجب أن يحتوي على العناوين
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs mt-1">•</span>
                    استخدم الفاصلة (,) كفاصل في CSV
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs mt-1">•</span>
                    تأكد من ترميز UTF-8
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-gray-900">الحقول المطلوبة:</h4>
                <ul className="space-y-2 text-gray-700">
                  {importType === 'products' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        العنوان (title)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        رمز المنتج (sku)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        السعر (price)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        الفئة (category)
                      </li>
                    </>
                  )}
                  {importType === 'inventory' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        رمز المنتج (sku)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        الكمية (quantity)
                      </li>
                    </>
                  )}
                  {importType === 'prices' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        رمز المنتج (sku)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 text-xs mt-1">•</span>
                        السعر (price)
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button 
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                >
                  {importing ? 'جارٍ الاستيراد...' : 'بدء الاستيراد'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}
