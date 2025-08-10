import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ShoppingCart, Package, DollarSign, Calendar, MapPin } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  storeId: string;
  storeName: string;
  phase: string;
  addedAt: Date;
}

interface ProjectOrderSummaryProps {
  projectId: string;
  projectName: string;
  orders: OrderItem[];
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  onCreateOrder?: () => void;
  onClearAll?: () => void;
}

export const ProjectOrderSummary: React.FC<ProjectOrderSummaryProps> = ({
  projectId,
  projectName,
  orders,
  onRemoveItem,
  onUpdateQuantity,
  onCreateOrder,
  onClearAll,
}) => {
  // Group orders by phase
  const ordersByPhase = orders.reduce((acc, order) => {
    if (!acc[order.phase]) {
      acc[order.phase] = [];
    }
    acc[order.phase].push(order);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  // Calculate totals
  const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);
  const totalCost = orders.reduce((sum, order) => sum + (order.priceAtPurchase * order.quantity), 0);
  const uniqueStores = [...new Set(orders.map(order => order.storeId))].length;

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = orders.find(o => o.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        onRemoveItem?.(itemId);
      } else {
        onUpdateQuantity?.(itemId, newQuantity);
      }
    }
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد منتجات في سلة المشروع
          </h3>
          <p className="text-gray-600">
            ابدأ بإضافة المنتجات إلى مراحل المشروع
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">ملخص طلبات المشروع</h2>
                <p className="text-sm font-normal text-gray-600">{projectName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClearAll} size="sm">
                إلغاء الكل
              </Button>
              <Button onClick={onCreateOrder} size="sm">
                إنشاء الطلب
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-gray-600">إجمالي القطع</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">ريال سعودي</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{uniqueStores}</p>
                <p className="text-sm text-gray-600">متجر</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{Object.keys(ordersByPhase).length}</p>
                <p className="text-sm text-gray-600">مرحلة</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders by Phase */}
      {Object.entries(ordersByPhase).map(([phase, phaseOrders]) => {
        const phaseCost = phaseOrders.reduce(
          (sum, order) => sum + (order.priceAtPurchase * order.quantity), 
          0
        );
        const phaseItems = phaseOrders.reduce((sum, order) => sum + order.quantity, 0);

        return (
          <Card key={phase}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{phase}</span>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {phaseItems} قطعة
                  </Badge>
                  <span className="font-bold text-blue-600">
                    {phaseCost.toLocaleString()} ريال
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phaseOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{order.productName}</h4>
                      <p className="text-sm text-gray-600">{order.storeName}</p>
                      <p className="text-xs text-gray-500">
                        أضيف في {order.addedAt.toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {(order.priceAtPurchase * order.quantity).toLocaleString()} ريال
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.priceAtPurchase.toLocaleString()} ريال للقطعة
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(order.id, -1)}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {order.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(order.id, 1)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem?.(order.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Order Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">إجمالي الطلب</h3>
              <p className="text-gray-600">
                {totalItems} قطعة من {uniqueStores} متجر في {Object.keys(ordersByPhase).length} مرحلة
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {totalCost.toLocaleString()} ريال
              </p>
              <p className="text-sm text-gray-600">شامل جميع المراحل</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClearAll}>
              إلغاء جميع الطلبات
            </Button>
            <Button onClick={onCreateOrder} size="lg" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              إنشاء الطلب النهائي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


