'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Warehouse, MapPin, Package, TrendingUp } from 'lucide-react';
import { fetchAllWarehouses } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
interface WarehouseData {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  region: string;
  country_code: string;
  warehouse_type: "main" | "distribution" | "returns" | "dropship";
  is_active: boolean;
  is_default: boolean;
  capacity: number;
  current_utilization: number;
  total_items: number;
  total_value: number;
  created_at: string;
}

export default function WarehouseManagement() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetchAllWarehouses()
      .then((data) => setWarehouses(data || []))
      .catch((err) => {
        setWarehouses([]);
        console.error('Error loading warehouses:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(warehouse => {
      const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           warehouse.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || warehouse.warehouse_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [warehouses, searchTerm, typeFilter]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "main": return "bg-blue-100 text-blue-800";
      case "distribution": return "bg-green-100 text-green-800";
      case "returns": return "bg-orange-100 text-orange-800";
      case "dropship": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "main": return "رئيسي";
      case "distribution": return "توزيع";
      case "returns": return "مرتجعات";
      case "dropship": return "شحن مباشر";
      default: return type;
    }
  };

  const getUtilizationColor = (utilization: number, capacity: number) => {
    const percentage = (utilization / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async (warehouseId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستودع؟ لا يمكن التراجع عن هذا الإجراء.")) {
      try {
        setWarehouses(warehouses.filter(w => w.id !== warehouseId));
      } catch (error) {
        console.error("Error deleting warehouse:", error);
      }
    }
  };

  const totalStats = useMemo(() => {
    return warehouses.reduce(
      (acc, warehouse) => ({
        totalCapacity: acc.totalCapacity + warehouse.capacity,
        totalUtilization: acc.totalUtilization + warehouse.current_utilization,
        totalItems: acc.totalItems + warehouse.total_items,
        totalValue: acc.totalValue + warehouse.total_value,
      }),
      { totalCapacity: 0, totalUtilization: 0, totalItems: 0, totalValue: 0 }
    );
  }, [warehouses]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المستودعات</h1>
            <p className="text-gray-600 mt-2">إدارة المستودعات ومواقع المخزون</p>
          </div>
          <Button onClick={() => router.push("/store/warehouses/create")}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة مستودع
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Warehouse className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المستودعات</p>
                  <p className="text-2xl font-bold">{warehouses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الأصناف</p>
                  <p className="text-2xl font-bold">{totalStats.totalItems.toLocaleString('ar-SA')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي القيمة</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">معدل الاستخدام</p>
                  <p className="text-2xl font-bold">
                    {Math.round((totalStats.totalUtilization / totalStats.totalCapacity) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في المستودعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-48 h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الأنواع</option>
                <option value="main">مستودع رئيسي</option>
                <option value="distribution">توزيع</option>
                <option value="returns">مرتجعات</option>
                <option value="dropship">شحن مباشر</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredWarehouses.length === 0 ? (
              <div className="text-center py-12">
                <Warehouse className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستودعات</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || typeFilter !== "all" 
                    ? "جرب تعديل المرشحات"
                    : "أنشئ أول مستودع للبدء"
                  }
                </p>
                {!searchTerm && typeFilter === "all" && (
                  <Button onClick={() => router.push("/store/warehouses/create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة مستودع
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستودع</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>السعة</TableHead>
                    <TableHead>الأصناف</TableHead>
                    <TableHead>القيمة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{warehouse.name}</div>
                          <div className="text-sm text-gray-500">{warehouse.code}</div>
                          {warehouse.is_default && (
                            <Badge className="mt-1 bg-blue-100 text-blue-800">افتراضي</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(warehouse.warehouse_type)}>
                          {getTypeLabel(warehouse.warehouse_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{warehouse.city}</div>
                          <div className="text-xs text-gray-500">{warehouse.region}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className={`text-sm font-medium ${getUtilizationColor(warehouse.current_utilization, warehouse.capacity)}`}>
                            {warehouse.current_utilization.toLocaleString('ar-SA')} / {warehouse.capacity.toLocaleString('ar-SA')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((warehouse.current_utilization / warehouse.capacity) * 100)}% مستخدم
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{warehouse.total_items.toLocaleString('ar-SA')}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{formatCurrency(warehouse.total_value)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={warehouse.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {warehouse.is_active ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/store/warehouses/${warehouse.id}`)}
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/store/warehouses/${warehouse.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(warehouse.id)}
                            disabled={warehouse.is_default}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






