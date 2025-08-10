'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Shield, 
  Calendar, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Eye, 
  MessageSquare, 
  User, 
  Phone, 
  Mail,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Award,
  Star,
  Edit,
  FileText,
  DollarSign,
  Tag,
  Building,
  CreditCard,
  Receipt,
  Truck,
  Archive
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface StoreWarrantyClaim {
  id: string;
  warrantyId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  claimDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  issueType: string;
  issueDescription: string;
  quantityAffected: number;
  totalQuantity: number;
  quantityUsedPreviously: number;
  quantityRemaining: number;
  preferredResolution: string;
  storeResponse?: string;
  estimatedCompletion?: string;
  trackingNumber?: string;
  damagePhotos: string[];
  priority: 'low' | 'medium' | 'high';
  value: number;
  resolutionCost?: number;
}

export default function StoreWarrantyManagementPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<StoreWarrantyClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<StoreWarrantyClaim | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadWarrantyClaims = async () => {
      try {
        const supabase = createClientComponentClient();
        
        // Load warranty claims from Supabase
        const { data: claimsData, error: claimsError } = await supabase
          .from('warranty_claims')
          .select(`
            id,
            claim_number,
            warranty_id,
            customer_name,
            customer_email,
            customer_phone,
            claim_date,
            issue_type,
            issue_description,
            quantity_affected,
            total_quantity,
            quantity_used_previously,
            quantity_remaining,
            preferred_resolution,
            damage_photos,
            priority,
            status,
            store_response,
            estimated_completion,
            tracking_number,
            value,
            resolution_cost,
            warranties!inner(
              warranty_number,
              product_name
            )
          `)
          .order('claim_date', { ascending: false });

        if (claimsError) {
          throw new Error(`Failed to load warranty claims: ${claimsError.message}`);
        }

        // Transform database data to match expected format
        const transformedClaims: StoreWarrantyClaim[] = claimsData?.map((claim: any) => ({
          id: claim.claim_number,
          warrantyId: claim.warranties.warranty_number,
          productName: claim.warranties.product_name,
          customerName: claim.customer_name,
          customerEmail: claim.customer_email,
          customerPhone: claim.customer_phone,
          claimDate: new Date(claim.claim_date).toISOString().split('T')[0],
          status: claim.status,
          issueType: claim.issue_type,
          issueDescription: claim.issue_description,
          quantityAffected: claim.quantity_affected,
          totalQuantity: claim.total_quantity,
          quantityUsedPreviously: claim.quantity_used_previously,
          quantityRemaining: claim.quantity_remaining,
          preferredResolution: claim.preferred_resolution,
          storeResponse: claim.store_response,
          estimatedCompletion: claim.estimated_completion ? new Date(claim.estimated_completion).toISOString().split('T')[0] : undefined,
          trackingNumber: claim.tracking_number,
          damagePhotos: claim.damage_photos || [],
          priority: claim.priority,
          value: claim.value,
          resolutionCost: claim.resolution_cost
        })) || [];

        setClaims(transformedClaims);
      } catch (error) {
        console.error('Error loading warranty claims:', error);
        // Fallback to empty array if there's an error
        setClaims([]);
      }
    };

    loadWarrantyClaims();
  }, []);

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = searchTerm === '' || 
      claim.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || claim.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'approved': return 'مُوافق عليها';
      case 'in_progress': return 'قيد المعالجة';
      case 'completed': return 'مكتملة';
      case 'rejected': return 'مرفوضة';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Package className="h-4 w-4" />;
      case 'completed': return <Award className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفضة';
      case 'medium': return 'متوسطة';
      case 'high': return 'عالية';
      default: return priority;
    }
  };

  const getIssueTypeText = (issueType: string) => {
    switch (issueType) {
      case 'manufacturing_defect': return 'عيب تصنيع';
      case 'wear_and_tear': return 'تآكل وتلف';
      case 'performance_issue': return 'مشكلة في الأداء';
      case 'calibration_issue': return 'مشكلة معايرة';
      default: return issueType;
    }
  };

  // Calculate statistics
  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === 'pending').length;
  const inProgressClaims = claims.filter(c => c.status === 'in_progress').length;
  const completedClaims = claims.filter(c => c.status === 'completed').length;
  const approvedClaims = claims.filter(c => c.status === 'approved').length;
  const totalValue = claims.reduce((sum, c) => sum + c.value, 0);
  const totalResolutionCost = claims.reduce((sum, c) => sum + (c.resolutionCost || 0), 0);
  const averageResolutionTime = 4.2; // days

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة مطالبات الضمان المتقدمة</h1>
          <p className="text-gray-600">نظام إدارة شامل لمطالبات الضمان مع تتبع الحالة والأولوية</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقارير
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            استيراد مطالبات
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            مطالبة جديدة
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المطالبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalClaims}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مطالبة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">في الانتظار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{pendingClaims}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مطالبة منتظرة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">قيد المعالجة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{inProgressClaims}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مطالبة قيد المعالجة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">مكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{completedClaims}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">مطالبة مكتملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">القيمة الإجمالية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{totalValue.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">تكلفة الحلول</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{totalResolutionCost.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>
      </div>

      {/* Claims Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة مطالبات الضمان</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المطالبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="approved">مُوافق عليها</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="completed">مكتملة</option>
                <option value="rejected">مرفوضة</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأولويات</option>
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية متقدمة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClaims.map((claim) => (
              <div 
                key={claim.id} 
                className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  selectedClaim?.id === claim.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedClaim(claim)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{claim.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(claim.status)}`}>
                          {getStatusIcon(claim.status)}
                          {getStatusText(claim.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(claim.priority)}`}>
                          {getPriorityText(claim.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{claim.productName}</p>
                      <p className="text-sm text-blue-600">{claim.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>تاريخ المطالبة: {new Date(claim.claimDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="h-4 w-4" />
                      <span>نوع المشكلة: {getIssueTypeText(claim.issueType)}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الكمية المتأثرة:</span>
                      <span className="font-medium">{claim.quantityAffected} من {claim.totalQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">قيمة المنتج:</span>
                      <span className="font-medium">{claim.value.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{claim.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{claim.customerEmail}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحل المطلوب:</span>
                      <span className="font-medium text-blue-600">{claim.preferredResolution}</span>
                    </div>
                    {claim.resolutionCost && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">تكلفة الحل:</span>
                        <span className="font-medium text-red-600">{claim.resolutionCost.toLocaleString()} ريال</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Issue Description */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    وصف المشكلة
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {claim.issueDescription}
                  </p>
                </div>

                {/* Store Response */}
                {claim.storeResponse && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      رد المتجر
                    </h4>
                    <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                      {claim.storeResponse}
                    </p>
                  </div>
                )}

                {/* Tracking Number */}
                {claim.trackingNumber && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">رقم التتبع: {claim.trackingNumber}</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    الموافقة
                  </Button>
                  <Button size="sm" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    بدء المعالجة
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    إضافة تعليق
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    اتصال بالعميل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Claim Details Panel */}
      {selectedClaim && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تفاصيل المطالبة {selectedClaim.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Claim Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">تفاصيل المطالبة</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">رقم المطالبة:</span>
                      <p className="font-medium">{selectedClaim.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">رقم الضمان:</span>
                      <p className="font-medium">{selectedClaim.warrantyId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">المنتج:</span>
                    <p className="font-medium">{selectedClaim.productName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">الحالة:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)}`}>
                        {getStatusText(selectedClaim.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">الأولوية:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedClaim.priority)}`}>
                        {getPriorityText(selectedClaim.priority)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">معلومات العميل</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">الاسم:</span>
                    <p className="font-medium">{selectedClaim.customerName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">البريد الإلكتروني:</span>
                    <p className="font-medium">{selectedClaim.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">الهاتف:</span>
                    <p className="font-medium">{selectedClaim.customerPhone}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="font-medium text-gray-900">ملخص الكميات</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">إجمالي القطع:</span>
                      <p className="text-xl font-bold text-blue-600">{selectedClaim.totalQuantity}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">المطالبة الحالية:</span>
                      <p className="text-xl font-bold text-orange-600">{selectedClaim.quantityAffected}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
