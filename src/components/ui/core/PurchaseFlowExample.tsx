'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import PurchaseAssignmentDialog from '@/components/ui/core/PurchaseAssignmentDialog';
import { ProjectPurchaseService, PurchaseAllocation } from '@/services';
import { Order } from '@/core/shared/types/types';
import { 
  ShoppingCart, 
  Package, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

// Example component showing how to integrate order/warranty with projects
export default function PurchaseFlowExample() {
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'info' | 'error', text: string } | null>(null);

  // Example order data
  const exampleOrder: Order = {
    id: "1001",
    userId: "user-123",
    items: [{
      id: "item-1",
      product_id: "cement-1",
      quantity: 50,
      price: 50,
      name: 'إسمنت عالي الجودة'
    }],
    total_amount: 2500,
    status: 'pending',
    payment_status: 'pending',
    shipping_address: 'الرياض',
    createdAt: new Date(),
    vendor: 'شركة الإسمنت السعودي'
  };

  const handlePurchaseOrder = async (order: Order) => {
    setMessage(null);
    
    try {
      // Try to auto-assign to project if only one active project
      const autoAssigned = await ProjectPurchaseService.autoAssignPurchase(order);
      
      if (autoAssigned) {
        setMessage({
          type: 'success',
          text: 'تم تعيين الطلب تلقائياً للمشروع النشط الوحيد'
        });
      } else {
        // Multiple projects - show assignment dialog
        setCurrentOrder(order);
        setShowAssignmentDialog(true);
        setMessage({
          type: 'info',
          text: 'يوجد عدة مشاريع نشطة. يرجى اختيار المشروع المناسب'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ في معالجة الطلب'
      });
    }
  };

  const handleAssignmentComplete = async (allocations: PurchaseAllocation[]) => {
    try {
      if (currentOrder) {
        await ProjectPurchaseService.assignOrderToProject(currentOrder, '', allocations);
        setMessage({
          type: 'success',
          text: `تم تعيين الطلب لـ ${allocations.length} مشروع بنجاح`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ في تعيين الطلب للمشاريع'
      });
    }
    
    setShowAssignmentDialog(false);
    setCurrentOrder(null);
  };

  const handleAddWarranty = async () => {
    // Example of adding warranty to a purchase
    const exampleWarranty = {
      id: 2001,
      item: exampleOrder.items?.[0]?.name || 'Unknown',
      store: exampleOrder.vendor || 'Unknown',
      purchaseDate: exampleOrder.created_at || new Date().toISOString(),
      warrantyYears: 2,
      expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      projectId: undefined,
      orderId: exampleOrder.id,
      materialId: 'cement-001',
      serialNumber: 'CEM-2025-001',
      cost: exampleOrder.total_amount || 0
    };

    setMessage({
      type: 'success',
      text: 'تم إضافة الضمان وربطه بالمشروع'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            مثال على تكامل المشتريات والضمانات مع المشاريع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              message.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
               message.type === 'info' ? <Package className="w-5 h-5" /> :
               <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          {/* Example Order */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-lg">طلب شراء جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">المنتج</p>
                  <p className="font-medium">{exampleOrder.items?.[0]?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الكمية</p>
                  <p className="font-medium">{exampleOrder.items?.length || 0} كيس</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">التكلفة</p>
                  <p className="font-medium">{(exampleOrder.total_amount || 0).toLocaleString('en-US')} ر.س</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">المورد</p>
                  <p className="font-medium">{exampleOrder.vendor || 'Unknown'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handlePurchaseOrder(exampleOrder)}
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  تأكيد الطلب وتعيين للمشروع
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleAddWarranty}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  إضافة ضمان
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card>
            <CardHeader>
              <CardTitle>كيف يعمل النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">تأكيد الطلب</h4>
                    <p className="text-sm text-gray-600">عند تأكيد طلب شراء جديد، يتحقق النظام من المشاريع النشطة</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">التعيين التلقائي</h4>
                    <p className="text-sm text-gray-600">إذا كان هناك مشروع واحد نشط فقط، يتم تعيين الطلب تلقائياً</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">الاختيار اليدوي</h4>
                    <p className="text-sm text-gray-600">إذا كان هناك عدة مشاريع، يظهر للمستخدم حوار لاختيار المشروع أو توزيع الطلب</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium">ربط الضمانات</h4>
                    <p className="text-sm text-gray-600">يتم ربط الضمانات بالمشتريات والمشاريع تلقائياً لسهولة المتابعة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Purchase Assignment Dialog */}
      <PurchaseAssignmentDialog
        isOpen={showAssignmentDialog}
        onClose={() => setShowAssignmentDialog(false)}
        order={currentOrder}
        onAssign={handleAssignmentComplete}
      />
    </div>
  );
}



