import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  Calendar,
  Package,
  DollarSign,
  Store,
  Shield,
  Receipt,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface ProjectProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  phase: string;
  phaseOrder: number;
  storeId: string;
  storeName: string;
  storeContact: {
    phone: string;
    email: string;
  };
  category: string;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
    details: string;
    startDate: Date;
    endDate: Date;
  };
  invoiceId?: string;
  invoiceDate?: Date;
  addedAt: Date;
  deliveredAt?: Date;
  specifications: Record<string, string>;
}

interface ProjectProductReportProps {
  projectId: string;
  projectName: string;
  projectStartDate: Date;
  projectEndDate?: Date;
  products: ProjectProduct[];
  onViewInvoice?: (invoiceId: string) => void;
  onDownloadReport?: (format: 'pdf' | 'excel') => void;
  onSendReport?: (email: string) => void;
  onPrintReport?: () => void;
}

export const ProjectProductReport: React.FC<ProjectProductReportProps> = ({
  projectId,
  projectName,
  projectStartDate,
  projectEndDate,
  products,
  onViewInvoice,
  onDownloadReport,
  onSendReport,
  onPrintReport,
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [selectedTab, setSelectedTab] = useState('summary');

  // Group products by phase
  const productsByPhase = products.reduce((acc, product) => {
    if (!acc[product.phase]) {
      acc[product.phase] = [];
    }
    acc[product.phase].push(product);
    return acc;
  }, {} as Record<string, ProjectProduct[]>);

  // Sort phases by phase order
  const sortedPhases = Object.entries(productsByPhase).sort(
    ([, a], [, b]) => (a[0]?.phaseOrder || 0) - (b[0]?.phaseOrder || 0)
  );

  // Calculate totals
  const totalCost = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const uniqueStores = [...new Set(products.map(p => p.storeId))].length;
  const productsWithWarranty = products.filter(p => p.warranty).length;
  const paidInvoices = products.filter(p => p.invoiceId).length;

  const togglePhaseExpansion = (phase: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phase)) {
      newExpanded.delete(phase);
    } else {
      newExpanded.add(phase);
    }
    setExpandedPhases(newExpanded);
  };

  const formatWarranty = (warranty: ProjectProduct['warranty']) => {
    if (!warranty) return 'لا يوجد ضمان';
    return `${warranty.duration} ${warranty.type === 'years' ? 'سنة' : 'شهر'}`;
  };

  const getWarrantyStatus = (warranty: ProjectProduct['warranty']) => {
    if (!warranty) return null;
    const now = new Date();
    const isActive = now <= warranty.endDate;
    const daysRemaining = Math.ceil((warranty.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return { isActive, daysRemaining };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6" />
                تقرير منتجات المشروع
              </CardTitle>
              <p className="text-gray-600 mt-1">{projectName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>رقم المشروع: {projectId}</span>
                <span>تاريخ البداية: {projectStartDate.toLocaleDateString('ar-SA')}</span>
                {projectEndDate && (
                  <span>تاريخ الانتهاء: {projectEndDate.toLocaleDateString('ar-SA')}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onPrintReport}>
                <Printer className="h-4 w-4 mr-2" />
                طباعة
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownloadReport?.('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button size="sm" onClick={() => onDownloadReport?.('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{totalItems}</p>
            <p className="text-sm text-gray-600">إجمالي القطع</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{totalCost.toLocaleString()}</p>
            <p className="text-sm text-gray-600">ريال سعودي</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Store className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{uniqueStores}</p>
            <p className="text-sm text-gray-600">متجر</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{productsWithWarranty}</p>
            <p className="text-sm text-gray-600">منتج بضمان</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Receipt className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold">{paidInvoices}</p>
            <p className="text-sm text-gray-600">فاتورة مدفوعة</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">الملخص</TabsTrigger>
          <TabsTrigger value="phases">حسب المراحل</TabsTrigger>
          <TabsTrigger value="stores">حسب المتجر</TabsTrigger>
          <TabsTrigger value="warranty">الضمانات</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ملخص شامل للمنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المرحلة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتجر</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر الإجمالي</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.phase}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.storeName}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.quantity}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {(product.price * product.quantity).toLocaleString()} ريال
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {product.deliveredAt ? (
                              <Badge variant="secondary">تم التسليم</Badge>
                            ) : (
                              <Badge variant="outline">قيد التنفيذ</Badge>
                            )}
                            {product.warranty && (
                              <Badge variant="default">بضمان</Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          {sortedPhases.map(([phase, phaseProducts]) => {
            const phaseCost = phaseProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            const isExpanded = expandedPhases.has(phase);
            
            return (
              <Card key={phase}>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePhaseExpansion(phase)}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <span>{phase}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {phaseProducts.length} منتج
                      </Badge>
                      <span className="font-bold text-blue-600">
                        {phaseCost.toLocaleString()} ريال
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-3">
                      {phaseProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.storeName}</p>
                            <p className="text-xs text-gray-500">
                              أضيف في {product.addedAt.toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">
                              {(product.price * product.quantity).toLocaleString()} ريال
                            </p>
                            <p className="text-sm text-gray-600">
                              {product.quantity} × {product.price.toLocaleString()} ريال
                            </p>
                            {product.warranty && (
                              <Badge variant="outline" className="mt-1">
                                ضمان {formatWarranty(product.warranty)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          {[...new Set(products.map(p => p.storeId))].map(storeId => {
            const storeProducts = products.filter(p => p.storeId === storeId);
            const storeName = storeProducts[0]?.storeName;
            const storeContact = storeProducts[0]?.storeContact;
            const storeCost = storeProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            
            return (
              <Card key={storeId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <span>{storeName}</span>
                      {storeContact && (
                        <div className="text-sm font-normal text-gray-600 mt-1">
                          <p>هاتف: {storeContact.phone}</p>
                          <p>بريد: {storeContact.email}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{storeCost.toLocaleString()} ريال</p>
                      <p className="text-sm text-gray-600">{storeProducts.length} منتج</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {storeProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.phase}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(product.price * product.quantity).toLocaleString()} ريال
                          </p>
                          <p className="text-sm text-gray-600">الكمية: {product.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="warranty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>حالة الضمانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.filter(p => p.warranty).map((product) => {
                  const warrantyStatus = getWarrantyStatus(product.warranty);
                  
                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.storeName}</p>
                        <p className="text-xs text-gray-500">
                          من {product.warranty!.startDate.toLocaleDateString('ar-SA')} 
                          إلى {product.warranty!.endDate.toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          {formatWarranty(product.warranty)}
                        </p>
                        {warrantyStatus && (
                          <Badge 
                            variant={warrantyStatus.isActive ? "default" : "destructive"}
                            className="mt-1"
                          >
                            {warrantyStatus.isActive 
                              ? `متبقي ${warrantyStatus.daysRemaining} يوم`
                              : 'منتهي الصلاحية'
                            }
                          </Badge>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {product.warranty!.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {products.filter(p => p.warranty).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد منتجات بضمان في هذا المشروع</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


