'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Construction,
  Calendar,
  Hash,
  TrendingUp,
  Package,
  Clock,
  Navigation,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  projectType: string;
  projectLocation: string;
  projectAddress: string;
  projectCoordinates?: {
    lat: number;
    lng: number;
  };
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  notes?: string;
  deliveryInstructions?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  projectBudget?: number;
  contactPerson?: string;
  alternativePhone?: string;
}

interface CustomerSearchWidgetProps {
  onCustomerSelect: (customer: Customer) => void;
  showProjectDetails?: boolean;
  compact?: boolean;
  placeholder?: string;
  showDeliveryInfo?: boolean;
}

export function CustomerSearchWidget({ 
  onCustomerSelect, 
  showProjectDetails = true,
  compact = false,
  placeholder = "البحث عن العملاء (الاسم، الهاتف، الموقع، رقم العميل)...",
  showDeliveryInfo = false
}: CustomerSearchWidgetProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Mock customer data - in real app, this would come from API/database
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      customerCode: 'CUST-001',
      name: 'أحمد محمد السعد',
      email: 'ahmed.alsaad@email.com',
      phone: '+966501234567',
      address: 'شارع الملك فهد، حي العليا',
      city: 'الرياض',
      region: 'منطقة الرياض',
      projectType: 'فيلا سكنية',
      projectLocation: 'شمال الرياض',
      projectAddress: 'حي النرجس، شارع الورد، قطعة رقم 245',
      projectCoordinates: { lat: 24.7741, lng: 46.7390 },
      registrationDate: '2024-01-10',
      totalOrders: 15,
      totalSpent: 125000,
      lastOrderDate: '2024-07-20',
      status: 'active',
      loyaltyTier: 'gold',
      notes: 'عميل مميز - مشاريع متعددة',
      deliveryInstructions: 'التسليم صباحاً من 8-12، توجد حراسة',
      projectStartDate: '2024-02-01',
      projectEndDate: '2024-08-31',
      projectBudget: 500000,
      contactPerson: 'أحمد السعد',
      alternativePhone: '+966512345678'
    },
    {
      id: '2',
      customerCode: 'CUST-002', 
      name: 'فاطمة أحمد الخليل',
      email: 'fatima.alkhaleel@email.com',
      phone: '+966507654321',
      address: 'شارع التحلية، حي الحمراء',
      city: 'جدة',
      region: 'منطقة مكة المكرمة',
      projectType: 'عمارة تجارية',
      projectLocation: 'وسط جدة',
      projectAddress: 'شارع فلسطين، حي الحمراء، قطعة رقم 89',
      projectCoordinates: { lat: 21.5433, lng: 39.1728 },
      registrationDate: '2024-02-15',
      totalOrders: 8,
      totalSpent: 85000,
      lastOrderDate: '2024-07-18',
      status: 'active',
      loyaltyTier: 'silver',
      notes: 'مشروع عمارة 6 أدوار',
      deliveryInstructions: 'التسليم مساءً بعد 4 عصراً، يرجى الاتصال قبل الوصول',
      projectStartDate: '2024-03-01',
      projectEndDate: '2024-12-31',
      projectBudget: 800000,
      contactPerson: 'فاطمة الخليل',
      alternativePhone: '+966509876543'
    },
    {
      id: '3',
      customerCode: 'CUST-003',
      name: 'محمد عبدالله النهدي',
      email: 'mohammed.alnahdi@email.com', 
      phone: '+966551234567',
      address: 'طريق الدمام السريع',
      city: 'الخبر',
      region: 'المنطقة الشرقية',
      projectType: 'مجمع سكني',
      projectLocation: 'شرق الخبر',
      projectAddress: 'حي الجسر، طريق الملك فهد، مجمع الواحة السكني',
      projectCoordinates: { lat: 26.2172, lng: 50.1971 },
      registrationDate: '2024-03-01',
      totalOrders: 12,
      totalSpent: 95000,
      lastOrderDate: '2024-07-15',
      status: 'active',
      loyaltyTier: 'gold',
      deliveryInstructions: 'التسليم في موقع المشروع، البوابة الرئيسية',
      projectStartDate: '2024-04-01',
      projectEndDate: '2025-03-31',
      projectBudget: 1200000,
      contactPerson: 'محمد النهدي',
      alternativePhone: '+966556789012'
    }
  ]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    const searchTimeout = setTimeout(() => {
      const filtered = customers.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return customer.name.toLowerCase().includes(searchLower) ||
               customer.phone.includes(searchTerm) ||
               customer.email.toLowerCase().includes(searchLower) ||
               customer.city.toLowerCase().includes(searchLower) ||
               customer.projectLocation.toLowerCase().includes(searchLower) ||
               customer.customerCode.toLowerCase().includes(searchLower) ||
               customer.projectType.toLowerCase().includes(searchLower) ||
               customer.projectAddress.toLowerCase().includes(searchLower);
      });
      
      setSearchResults(filtered);
      setShowResults(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, customers]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.name);
    setShowResults(false);
    onCustomerSelect(customer);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      default: return status;
    }
  };

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoyaltyText = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'برونزي';
      case 'silver': return 'فضي';
      case 'gold': return 'ذهبي';
      case 'platinum': return 'بلاتيني';
      default: return tier;
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="pr-10"
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
        />
        {isSearching && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-2">
            {searchResults.map((customer) => (
              <div
                key={customer.id}
                className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg border-b border-gray-100 last:border-b-0"
                onClick={() => handleCustomerSelect(customer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{customer.name}</h4>
                        <Badge className={getLoyaltyColor(customer.loyaltyTier)} variant="secondary">
                          {getLoyaltyText(customer.loyaltyTier)}
                        </Badge>
                        <Badge className={getStatusColor(customer.status)} variant="secondary">
                          {getStatusText(customer.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {customer.customerCode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {customer.city}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left text-xs">
                    <p className="text-gray-600">إجمالي الطلبات</p>
                    <p className="font-medium">{customer.totalOrders}</p>
                  </div>
                </div>

                {showProjectDetails && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Construction className="h-3 w-3 text-gray-400" />
                        <span>{customer.projectType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span>{customer.projectLocation}</span>
                      </div>
                    </div>
                    
                    {showDeliveryInfo && customer.projectAddress && (
                      <div className="mt-1 p-2 bg-blue-50 rounded text-xs">
                        <div className="flex items-center gap-1 mb-1">
                          <Navigation className="h-3 w-3 text-blue-600" />
                          <span className="font-medium text-blue-900">عنوان المشروع:</span>
                        </div>
                        <p className="text-blue-800">{customer.projectAddress}</p>
                        {customer.deliveryInstructions && (
                          <p className="text-blue-700 mt-1">
                            <span className="font-medium">تعليمات التسليم:</span> {customer.deliveryInstructions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Selected Customer Details (Compact View) */}
      {selectedCustomer && compact && (
        <Card className="mt-2">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">{selectedCustomer.name}</span>
                <Badge className={getLoyaltyColor(selectedCustomer.loyaltyTier)} variant="secondary">
                  {getLoyaltyText(selectedCustomer.loyaltyTier)}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedCustomer(null);
                  setSearchTerm('');
                }}
              >
                ✕
              </Button>
            </div>
            
            {showProjectDetails && (
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Construction className="h-3 w-3" />
                  <span>{selectedCustomer.projectType} - {selectedCustomer.projectLocation}</span>
                </div>
                {showDeliveryInfo && selectedCustomer.projectAddress && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedCustomer.projectAddress}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {showResults && searchResults.length === 0 && searchTerm.length >= 2 && !isSearching && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500">
            <Search className="h-6 w-6 mx-auto mb-2" />
            <p>لم يتم العثور على عملاء</p>
            <p className="text-xs mt-1">جرب البحث باستخدام الاسم أو رقم الهاتف أو رقم العميل</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Enhanced Customer Detail Modal Component
export function CustomerDetailModal({ 
  customer, 
  onClose, 
  showDeliveryInfo = true 
}: { 
  customer: Customer; 
  onClose: () => void;
  showDeliveryInfo?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              تفاصيل العميل والمشروع
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Customer Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">معلومات العميل</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span>{customer.customerCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{customer.phone}</span>
                  {customer.alternativePhone && (
                    <span className="text-gray-500">| {customer.alternativePhone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{customer.address}, {customer.city}, {customer.region}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">إحصائيات العميل</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span>إجمالي الطلبات: {customer.totalOrders}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span>إجمالي الإنفاق: {customer.totalSpent.toLocaleString()} ريال</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>آخر طلب: {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('ar-SA') : 'لا يوجد'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <Badge className={getStatusColor(customer.status)}>
                    {getStatusText(customer.status)}
                  </Badge>
                  <Badge className={getLoyaltyColor(customer.loyaltyTier)}>
                    {getLoyaltyText(customer.loyaltyTier)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Construction className="h-4 w-4" />
              معلومات المشروع
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span><strong>نوع المشروع:</strong> {customer.projectType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span><strong>موقع المشروع:</strong> {customer.projectLocation}</span>
                </div>
                {customer.projectBudget && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span><strong>ميزانية المشروع:</strong> {customer.projectBudget.toLocaleString()} ريال</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {customer.projectStartDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span><strong>تاريخ البداية:</strong> {new Date(customer.projectStartDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
                {customer.projectEndDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span><strong>تاريخ الانتهاء:</strong> {new Date(customer.projectEndDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
                {customer.contactPerson && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span><strong>الشخص المسؤول:</strong> {customer.contactPerson}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {showDeliveryInfo && (customer.projectAddress || customer.deliveryInstructions) && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                معلومات التسليم
              </h3>
              
              {customer.projectAddress && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">عنوان المشروع:</span>
                  </div>
                  <p className="text-blue-800">{customer.projectAddress}</p>
                  
                  {customer.projectCoordinates && (
                    <div className="mt-2 flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700 text-sm">
                        الإحداثيات: {customer.projectCoordinates.lat}, {customer.projectCoordinates.lng}
                      </span>
                      <Button size="sm" variant="outline" className="text-xs">
                        فتح في الخرائط
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {customer.deliveryInstructions && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">تعليمات التسليم:</span>
                  </div>
                  <p className="text-yellow-800">{customer.deliveryInstructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">ملاحظات</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{customer.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  function getStatusColor(status: string) {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      default: return status;
    }
  }

  function getLoyaltyColor(tier: string) {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getLoyaltyText(tier: string) {
    switch (tier) {
      case 'bronze': return 'برونزي';
      case 'silver': return 'فضي';
      case 'gold': return 'ذهبي';
      case 'platinum': return 'بلاتيني';
      default: return tier;
    }
  }
}
