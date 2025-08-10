"use client";

import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Search, Eye, Edit, Download, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/core/shared/utils/formatting";

interface Order {
  id: string;
  display_id: number;
  customer_email: string;
  customer_name: string;
  total: number;
  currency_code: string;
  status: "pending" | "completed" | "cancelled" | "shipped";
  payment_status: "paid" | "pending" | "refunded";
  created_at: string;
  items_count: number;
}

export const OrderListTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data - set immediately without setTimeout
    const mockOrders: Order[] = [
      {
        id: "order_1",
        display_id: 1001,
        customer_email: "ahmed.mohamed@example.com",
        customer_name: "أحمد محمد",
        total: 15000,
        currency_code: "SAR",
        status: "completed",
        payment_status: "paid",
        created_at: "2024-01-20T10:30:00Z",
        items_count: 3
      },
      {
        id: "order_2",
        display_id: 1002,
        customer_email: "sara.ali@example.com", 
        customer_name: "سارة علي",
        total: 8500,
        currency_code: "SAR",
        status: "shipped",
        payment_status: "paid",
        created_at: "2024-01-19T14:20:00Z",
        items_count: 2
      },
      {
        id: "order_3",
        display_id: 1003,
        customer_email: "khalid.hassan@example.com",
        customer_name: "خالد حسن", 
        total: 25000,
        currency_code: "SAR",
        status: "pending",
        payment_status: "pending",
        created_at: "2024-01-18T09:15:00Z",
        items_count: 5
      },
      {
        id: "order_4",
        display_id: 1004,
        customer_email: "fatima.omar@example.com",
        customer_name: "فاطمة عمر",
        total: 3200,
        currency_code: "SAR", 
        status: "cancelled",
        payment_status: "refunded",
        created_at: "2024-01-17T16:45:00Z",
        items_count: 1
      }
    ];

    // Set data immediately - no setTimeout
    setOrders(mockOrders);
    setLoading(false);
  }, []); // Empty dependency array

  // Memoize filtered orders to prevent unnecessary re-calculations
  const filteredOrders = useMemo(() => 
    orders.filter(order =>
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.display_id.toString().includes(searchTerm)
    ), [orders, searchTerm]
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "معلق", variant: "secondary" as const, icon: Clock },
      completed: { label: "مكتمل", variant: "default" as const, icon: CheckCircle },
      shipped: { label: "مشحون", variant: "outline" as const, icon: Package },
      cancelled: { label: "ملغي", variant: "destructive" as const, icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "مدفوع", variant: "default" as const },
      pending: { label: "معلق", variant: "secondary" as const },
      refunded: { label: "مسترد", variant: "outline" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>قائمة الطلبات</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => alert('Button clicked')}>
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المبلغ الإجمالي</TableHead>
              <TableHead className="text-right">حالة الطلب</TableHead>
              <TableHead className="text-right">حالة الدفع</TableHead>
              <TableHead className="text-right">عدد الأصناف</TableHead>
              <TableHead className="text-right">تاريخ الطلب</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-right">
                  #{order.display_id}
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(order.total, order.currency_code)}
                </TableCell>
                <TableCell className="text-right">
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-right">
                  {getPaymentStatusBadge(order.payment_status)}
                </TableCell>
                <TableCell className="text-right">{order.items_count}</TableCell>
                <TableCell className="text-right">
                  {new Date(order.created_at).toLocaleDateString('ar-SA')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد طلبات مطابقة لمعايير البحث
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderListTable;




