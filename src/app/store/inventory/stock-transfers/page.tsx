'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  ArrowRightLeft, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  Building,
  MapPin,
  Calendar,
  Hash,
  Barcode,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  Timer,
  CheckSquare,
  XCircle
} from 'lucide-react';

interface StockTransfer {
  id: string;
  transferNumber: string;
  fromLocation: string;
  toLocation: string;
  items: TransferItem[];
  status: 'draft' | 'pending_approval' | 'approved' | 'in_transit' | 'completed' | 'cancelled' | 'rejected';
  requestDate: string;
  transferDate?: string;
  completedDate?: string;
  requestedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
  attachments?: string[];
  totalValue: number;
  requiresApproval: boolean;
}

interface TransferItem {
  id: string;
  productName: string;
  sku: string;
  quantityRequested: number;
  quantityTransferred: number;
  unit: string;
  fromStock: number;
  toStock: number;
  unitCost: number;
  totalCost: number;
  batches?: BatchInfo[];
  serialNumbers?: string[];
  expiryDate?: string;
  lotNumber?: string;
  availableStock: number;
  reservedQuantity: number;
}

interface BatchInfo {
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufacturingDate: string;
  supplier: string;
  costPrice: number;
  location: string;
}

interface ApprovalWorkflow {
  id: string;
  transferId: string;
  approverLevel: number;
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  comments?: string;
  requiredForValue: number;
}

interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'store' | 'outlet';
  address: string;
  manager: string;
  totalItems: number;
}

export default function StockTransfersPage() {
  const [stockTransfers] = useState<StockTransfer[]>([
    {
      id: '1',
      transferNumber: 'ST-001',
      fromLocation: 'المستودع الرئيسي',
      toLocation: 'فرع الرياض',
      items: [
        {
          id: '1',
          productName: 'لابتوب HP EliteBook',
          sku: 'HP-001',
          quantityRequested: 5,
          quantityTransferred: 5,
          unit: 'قطعة',
          fromStock: 20,
          toStock: 3,
          unitCost: 2500,
          totalCost: 12500,
          availableStock: 20,
          reservedQuantity: 0,
          batches: [
            {
              batchNumber: 'HP-B001',
              quantity: 5,
              expiryDate: '2027-12-31',
              manufacturingDate: '2024-01-15',
              supplier: 'HP العربية',
              costPrice: 2500,
              location: 'A-01-15'
            }
          ],
          serialNumbers: ['HP001001', 'HP001002', 'HP001003', 'HP001004', 'HP001005'],
          lotNumber: 'LOT-HP-2024-001'
        },
        {
          id: '2',
          productName: 'ماوس لوجيتك',
          sku: 'LG-002',
          quantityRequested: 10,
          quantityTransferred: 10,
          unit: 'قطعة',
          fromStock: 50,
          toStock: 5,
          unitCost: 75,
          totalCost: 750,
          availableStock: 50,
          reservedQuantity: 0,
          batches: [
            {
              batchNumber: 'LG-B002',
              quantity: 10,
              expiryDate: '2026-06-30',
              manufacturingDate: '2024-02-01',
              supplier: 'لوجيتك الشرق الأوسط',
              costPrice: 75,
              location: 'B-02-08'
            }
          ]
        }
      ],
      status: 'completed',
      requestDate: '2025-01-10',
      transferDate: '2025-01-12',
      completedDate: '2025-01-13',
      requestedBy: 'أحمد محمد',
      approvedBy: 'مدير المستودع',
      approvalDate: '2025-01-11',
      priority: 'high',
      notes: 'تحويل عاجل لتغطية النقص في الفرع',
      totalValue: 13250,
      requiresApproval: true
    },
    {
      id: '2',
      transferNumber: 'ST-002',
      fromLocation: 'فرع جدة',
      toLocation: 'فرع الدمام',
      items: [
        {
          id: '3',
          productName: 'كيبورد ميكانيكي',
          sku: 'KB-003',
          quantityRequested: 8,
          quantityTransferred: 0,
          unit: 'قطعة',
          fromStock: 12,
          toStock: 2,
          unitCost: 150,
          totalCost: 1200,
          availableStock: 12,
          reservedQuantity: 8,
          batches: [
            {
              batchNumber: 'KB-B003',
              quantity: 8,
              expiryDate: '2025-12-31',
              manufacturingDate: '2024-03-10',
              supplier: 'مورد المعدات المكتبية',
              costPrice: 150,
              location: 'C-01-20'
            }
          ]
        }
      ],
      status: 'pending_approval',
      requestDate: '2025-01-15',
      requestedBy: 'سارة أحمد',
      priority: 'normal',
      notes: 'طلب من مدير الفرع',
      totalValue: 1200,
      requiresApproval: true
    },
    {
      id: '3',
      transferNumber: 'ST-003',
      fromLocation: 'المستودع الرئيسي',
      toLocation: 'فرع مكة',
      items: [
        {
          id: '4',
          productName: 'شاشة 4K Dell',
          sku: 'DL-004',
          quantityRequested: 3,
          quantityTransferred: 3,
          unit: 'قطعة',
          fromStock: 15,
          toStock: 1,
          unitCost: 1200,
          totalCost: 3600,
          availableStock: 15,
          reservedQuantity: 0,
          batches: [
            {
              batchNumber: 'DL-B004',
              quantity: 3,
              expiryDate: '2026-08-31',
              manufacturingDate: '2024-01-20',
              supplier: 'Dell الشرق الأوسط',
              costPrice: 1200,
              location: 'A-03-12'
            }
          ],
          serialNumbers: ['DL004001', 'DL004002', 'DL004003']
        }
      ],
      status: 'in_transit',
      requestDate: '2025-01-14',
      transferDate: '2025-01-15',
      requestedBy: 'محمد علي',
      approvedBy: 'مدير العمليات',
      approvalDate: '2025-01-14',
      priority: 'normal',
      notes: 'توصيل مع شركة النقل',
      totalValue: 3600,
      requiresApproval: true
    }
  ]);

  const [locations] = useState<Location[]>([
    {
      id: '1',
      name: 'المستودع الرئيسي',
      type: 'warehouse',
      address: 'الرياض - حي الصناعية',
      manager: 'عبدالله السعد',
      totalItems: 1250
    },
    {
      id: '2',
      name: 'فرع الرياض',
      type: 'store',
      address: 'الرياض - حي العليا',
      manager: 'أحمد محمد',
      totalItems: 320
    },
    {
      id: '3',
      name: 'فرع جدة',
      type: 'store',
      address: 'جدة - حي الزهراء',
      manager: 'سارة أحمد',
      totalItems: 280
    },
    {
      id: '4',
      name: 'فرع الدمام',
      type: 'outlet',
      address: 'الدمام - حي الفيصلية',
      manager: 'محمد علي',
      totalItems: 150
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTransfers = stockTransfers.filter(transfer => 
    selectedStatus === 'all' || transfer.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'in_transit': return 'قيد النقل';
      case 'pending_approval': return 'قيد الموافقة';
      case 'approved': return 'معتمد';
      case 'draft': return 'مسودة';
      case 'cancelled': return 'ملغي';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'pending_approval': return <Clock className="h-4 w-4" />;
      case 'approved': return <ShieldCheck className="h-4 w-4" />;
      case 'draft': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عاجل';
      case 'normal': return 'عادي';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return <Building className="h-4 w-4" />;
      case 'store': return <Building className="h-4 w-4" />;
      case 'outlet': return <MapPin className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const getLocationTypeText = (type: string) => {
    switch (type) {
      case 'warehouse': return 'مستودع';
      case 'store': return 'فرع';
      case 'outlet': return 'منفذ';
      default: return type;
    }
  };

  const totalTransfers = stockTransfers.length;
  const pendingTransfers = stockTransfers.filter(t => t.status === 'pending_approval').length;
  const completedTransfers = stockTransfers.filter(t => t.status === 'completed').length;
  const inTransitTransfers = stockTransfers.filter(t => t.status === 'in_transit').length;
  const approvedTransfers = stockTransfers.filter(t => t.status === 'approved').length;
  const rejectedTransfers = stockTransfers.filter(t => t.status === 'rejected').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">نقل المخزون</h1>
          <p className="text-gray-600">إدارة نقل المنتجات بين المواقع والفروع</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            طلب نقل جديد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي النقل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalTransfers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عملية نقل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">قيد الموافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{pendingTransfers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طلب معلق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">معتمد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{approvedTransfers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">جاهز للنقل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">قيد النقل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{inTransitTransfers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عملية نقل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">مكتمل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{completedTransfers}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عملية مكتملة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{location.name}</CardTitle>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                  {getLocationIcon(location.type)}
                  {getLocationTypeText(location.type)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{location.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">المدير: {location.manager}</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">إجمالي المنتجات:</span>
                    <span className="font-medium text-blue-600">{location.totalItems.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    عرض المخزون
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    نقل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>عمليات نقل المخزون</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في عمليات النقل..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="draft">مسودة</option>
                <option value="pending_approval">قيد الموافقة</option>
                <option value="approved">معتمد</option>
                <option value="in_transit">قيد النقل</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
                <option value="rejected">مرفوض</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransfers.map((transfer) => (
              <div key={transfer.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{transfer.transferNumber}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(transfer.priority)}`}>
                          {getPriorityText(transfer.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {transfer.fromLocation} → {transfer.toLocation}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        قيمة النقل: {transfer.totalValue.toLocaleString()} ريال
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(transfer.status)}`}>
                      {getStatusIcon(transfer.status)}
                      {getStatusText(transfer.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {transfer.status === 'pending_approval' && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {transfer.status === 'approved' && (
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <Truck className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الطلب:</p>
                    <p className="font-medium">{transfer.requestDate}</p>
                  </div>
                  {transfer.approvalDate && (
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الموافقة:</p>
                      <p className="font-medium">{transfer.approvalDate}</p>
                    </div>
                  )}
                  {transfer.transferDate && (
                    <div>
                      <p className="text-sm text-gray-600">تاريخ النقل:</p>
                      <p className="font-medium">{transfer.transferDate}</p>
                    </div>
                  )}
                  {transfer.completedDate && (
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الإكمال:</p>
                      <p className="font-medium">{transfer.completedDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">طلب بواسطة:</p>
                    <p className="font-medium">{transfer.requestedBy}</p>
                  </div>
                  {transfer.approvedBy && (
                    <div>
                      <p className="text-sm text-gray-600">اعتمد بواسطة:</p>
                      <p className="font-medium">{transfer.approvedBy}</p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">المنتجات ({transfer.items.length})</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-2 px-3 font-medium text-gray-600">المنتج</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">الكمية المطلوبة</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">الكمية المنقولة</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">مخزون المصدر</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">رقم الدفعة</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">القيمة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfer.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-2 px-3">
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-gray-600 text-xs">{item.sku}</p>
                                {item.lotNumber && (
                                  <p className="text-blue-600 text-xs flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    {item.lotNumber}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3">{item.quantityRequested} {item.unit}</td>
                            <td className="py-2 px-3">
                              <span className={item.quantityTransferred > 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                {item.quantityTransferred} {item.unit}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <div>
                                <span>{item.fromStock} {item.unit}</span>
                                {item.reservedQuantity > 0 && (
                                  <p className="text-xs text-orange-600">محجوز: {item.reservedQuantity}</p>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              {item.batches && item.batches.length > 0 ? (
                                <div className="space-y-1">
                                  {item.batches.map((batch, index) => (
                                    <div key={index} className="text-xs">
                                      <span className="font-medium text-blue-600">{batch.batchNumber}</span>
                                      <p className="text-gray-500">انتهاء: {batch.expiryDate}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              <div>
                                <span className="font-medium">{item.totalCost.toLocaleString()} ريال</span>
                                <p className="text-xs text-gray-500">{item.unitCost} ريال/وحدة</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Serial Numbers Section */}
                  {transfer.items.some(item => item.serialNumbers && item.serialNumbers.length > 0) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Barcode className="h-4 w-4" />
                        الأرقام التسلسلية
                      </h5>
                      {transfer.items.map((item) => (
                        item.serialNumbers && item.serialNumbers.length > 0 && (
                          <div key={item.id} className="mb-2">
                            <p className="text-sm font-medium text-gray-700">{item.productName}:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.serialNumbers.map((serial, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                                  {serial}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {transfer.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">ملاحظات:</span> {transfer.notes}
                    </p>
                  </div>
                )}

                {/* Approval Workflow Section */}
                {transfer.requiresApproval && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      سير العمل للموافقة
                    </h5>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${transfer.status === 'pending_approval' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                          <span className="text-sm">طلب الموافقة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${transfer.status === 'approved' || transfer.status === 'in_transit' || transfer.status === 'completed' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <span className="text-sm">الموافقة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${transfer.status === 'in_transit' || transfer.status === 'completed' ? 'bg-blue-400' : 'bg-gray-300'}`}></div>
                          <span className="text-sm">النقل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${transfer.status === 'completed' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <span className="text-sm">الإكمال</span>
                        </div>
                      </div>
                      {transfer.rejectionReason && (
                        <div className="text-sm text-red-600">
                          <span className="font-medium">سبب الرفض:</span> {transfer.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إنشاء طلب نقل جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">من الموقع</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر الموقع المصدر</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">إلى الموقع</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر الموقع الهدف</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">أولوية النقل</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="normal">عادي</option>
                  <option value="high">عاجل</option>
                  <option value="urgent">عاجل جداً</option>
                  <option value="low">منخفض</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ النقل المطلوب</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المنتج</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>اختر المنتج</option>
                <option>لابتوب HP EliteBook</option>
                <option>ماوس لوجيتك</option>
                <option>كيبورد ميكانيكي</option>
                <option>شاشة 4K Dell</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية المطلوبة</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوحدة</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>قطعة</option>
                  <option>كيلو</option>
                  <option>لتر</option>
                  <option>متر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المخزون المتاح</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="--"
                  readOnly
                />
              </div>
            </div>

            {/* Batch Selection */}
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                اختيار الدفعة
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الدفعة</label>
                  <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>اختر الدفعة</option>
                    <option>HP-B001 (متاح: 20 قطعة)</option>
                    <option>HP-B002 (متاح: 15 قطعة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                    placeholder="سيتم تحديده تلقائياً"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Approval Requirements */}
            <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4 text-orange-600" />
                <h4 className="font-medium text-orange-900">متطلبات الموافقة</h4>
              </div>
              <div className="text-sm text-orange-800">
                <p>• النقل بين المستودعات يتطلب موافقة مدير المستودع</p>
                <p>• النقل بقيمة أكثر من 5,000 ريال يتطلب موافقة مدير العمليات</p>
                <p>• النقل العاجل يتطلب موافقة فورية خلال ساعة واحدة</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ملاحظات إضافية..."
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Timer className="h-4 w-4 mr-2" />
                حفظ كمسودة
              </Button>
              <Button className="flex-1">
                <CheckSquare className="h-4 w-4 mr-2" />
                إرسال للموافقة
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات النقل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-blue-900 font-medium">النقل هذا الشهر</p>
                  <p className="text-2xl font-bold text-blue-600">15 عملية</p>
                </div>
                <ArrowRightLeft className="h-8 w-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-green-900 font-medium">معدل الإنجاز</p>
                  <p className="text-2xl font-bold text-green-600">87%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-yellow-900 font-medium">متوسط وقت النقل</p>
                  <p className="text-2xl font-bold text-yellow-600">2.5 يوم</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">أكثر المواقع نشاطاً</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المستودع الرئيسي</span>
                    <span className="font-medium">8 عمليات</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">فرع الرياض</span>
                    <span className="font-medium">5 عمليات</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">فرع جدة</span>
                    <span className="font-medium">3 عمليات</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
