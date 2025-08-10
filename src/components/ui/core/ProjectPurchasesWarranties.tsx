'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjectPurchase, Warranty, Order } from '@/core/shared/types/types';
import { ProjectPurchaseService } from '@/services/project-purchase';
import { 
  Package, 
  Shield, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface ProjectPurchasesWarrantiesProps {
  projectId: string;
  projectName: string;
}

export default function ProjectPurchasesWarranties({ 
  projectId, 
  projectName 
}: ProjectPurchasesWarrantiesProps) {
  const [purchases, setPurchases] = useState<ProjectPurchase[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [activeTab, setActiveTab] = useState<'purchases' | 'warranties'>('purchases');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [purchasesData, warrantiesData] = await Promise.all([
        ProjectPurchaseService.getProjectPurchasesWithWarranty(projectId),
        ProjectPurchaseService.getProjectWarranties(projectId)
      ]);
      
      setPurchases(purchasesData);
      setWarranties(warrantiesData);
    } catch (error) {
      console.error('Error loading project purchases and warranties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ordered': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'received': return <Package className="w-4 h-4 text-blue-500" />;
      case 'installed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'returned': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ordered': return 'مطلوب';
      case 'received': return 'مستلم';
      case 'installed': return 'مركب';
      case 'returned': return 'مرتجع';
      default: return status;
    }
  };

  const getWarrantyStatus = (warranty: Warranty) => {
    const now = new Date();
    const expiryDate = new Date(warranty.expiry_date);
    const monthsLeft = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    if (monthsLeft === 0) return { status: 'expired', label: 'منتهي', color: 'text-red-600' };
    if (monthsLeft <= 3) return { status: 'expiring', label: `ينتهي خلال ${monthsLeft} شهر`, color: 'text-orange-600' };
    return { status: 'active', label: `متبقي ${monthsLeft} شهر`, color: 'text-green-600' };
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.vendor || 'Unknown'.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.order_status || 'pending' === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = warranty.name || 'Unknown Item'.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warranty.vendor || 'Unknown Store'.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const calculatePurchasesSummary = () => {
    const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);
    const totalItems = purchases.length;
    const installedItems = purchases.filter(p => (p.order_status || 'pending') === 'installed').length;
    const pendingItems = purchases.filter(p => (p.order_status || 'pending') === 'ordered').length;
    
    return {
      totalCost,
      totalItems,
      installedItems,
      pendingItems,
      installationProgress: totalItems > 0 ? Math.round((installedItems / totalItems) * 100) : 0
    };
  };

  const summary = calculatePurchasesSummary();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                <p className="text-2xl font-bold">{summary.totalCost.toLocaleString('en-US')} ر.س</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">عدد المنتجات</p>
                <p className="text-2xl font-bold">{summary.totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مركب</p>
                <p className="text-2xl font-bold">{summary.installedItems}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold">{summary.pendingItems}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installation Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">تقدم التركيب</h3>
            <span className="text-sm text-gray-600">{summary.installationProgress}%</span>
          </div>
          <Progress value={summary.installationProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'purchases' ? 'default' : 'outline'}
          onClick={() => setActiveTab('purchases')}
          className="flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          المشتريات ({purchases.length})
        </Button>
        <Button
          variant={activeTab === 'warranties' ? 'default' : 'outline'}
          onClick={() => setActiveTab('warranties')}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          الضمانات ({warranties.length})
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {activeTab === 'purchases' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">كل الحالات</option>
            <option value="ordered">مطلوب</option>
            <option value="received">مستلم</option>
            <option value="installed">مركب</option>
            <option value="returned">مرتجع</option>
          </select>
        )}
      </div>

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{purchase.materialName}</h4>
                      {purchase.warranty_id ? true : false && (
                        <Badge variant="outline" className="text-green-600">
                          <Shield className="w-3 h-3 mr-1" />
                          يوجد ضمان
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">الكمية</p>
                        <p className="font-medium">{purchase.quantity || 0} {purchase.unit || 'pcs'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">السعر</p>
                        <p className="font-medium">{(purchase.price || 0).toLocaleString('en-US')} ر.س</p>
                      </div>
                      <div>
                        <p className="text-gray-600">المجموع</p>
                        <p className="font-medium">{purchase.totalCost.toLocaleString('en-US')} ر.س</p>
                      </div>
                      <div>
                        <p className="text-gray-600">المورد</p>
                        <p className="font-medium">{purchase.vendor || 'Unknown'}</p>
                      </div>
                    </div>

                    {purchase.description && (
                      <p className="text-sm text-gray-600 mt-2">{purchase.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(purchase.order_status || 'pending')}
                      <span className="text-sm">{getStatusLabel(purchase.order_status || 'pending')}</span>
                    </div>
                    <span className="text-xs text-gray-500">{purchase.purchase_date}</span>
                    {purchase.receipt_number && (
                      <span className="text-xs text-gray-500">#{purchase.receipt_number}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredPurchases.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">لا توجد مشتريات مطابقة للبحث</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Warranties Tab */}
      {activeTab === 'warranties' && (
        <div className="space-y-4">
          {filteredWarranties.map((warranty) => {
            const warrantyStatus = getWarrantyStatus(warranty);
            
            return (
              <Card key={warranty.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{warranty.name || 'Unknown Item'}</h4>
                        <Badge 
                          variant={warrantyStatus.status === 'expired' ? 'destructive' : 'outline'}
                          className={warrantyStatus.color}
                        >
                          {warrantyStatus.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">المتجر</p>
                          <p className="font-medium">{warranty.vendor || 'Unknown Store'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">تاريخ الشراء</p>
                          <p className="font-medium">{new Date(warranty.purchase_date).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">مدة الضمان</p>
                          <p className="font-medium">{warranty.warranty_period || 1} سنة</p>
                        </div>
                        <div>
                          <p className="text-gray-600">تاريخ الانتهاء</p>
                          <p className="font-medium">{new Date(warranty.expiry_date).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>

                      {warranty.serial_number && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">الرقم التسلسلي: {warranty.serial_number}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Shield className={`w-6 h-6 ${warranty.is_active !== false ? 'text-green-500' : 'text-gray-400'}`} />
                      {warranty.warranty_document && (
                        <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                          <FileText className="w-3 h-3 mr-1" />
                          عرض الوثيقة
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredWarranties.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">لا توجد ضمانات مطابقة للبحث</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}



