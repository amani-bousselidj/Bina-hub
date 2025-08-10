'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Vendor {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  joinDate: string;
  lastActive: string;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  commissionRate: number;
  rating: number;
  reviewCount: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents: {
    commercialLicense: string;
    taxCertificate: string;
    bankAccount: string;
  };
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVendors(mockVendors);
      setLoading(false);
    }, 1000);
  }, []);

  const mockVendors: Vendor[] = [
    {
      id: '1',
      storeName: 'متجر البناء الحديث',
      ownerName: 'أحمد محمد السالم',
      email: 'ahmed@modernbuild.sa',
      phone: '+966501234567',
      location: 'الرياض',
      category: 'مواد البناء',
      status: 'approved',
      joinDate: '2024-01-15',
      lastActive: '2024-12-20',
      totalProducts: 234,
      totalOrders: 1567,
      totalRevenue: 125000,
      commissionRate: 5.5,
      rating: 4.5,
      reviewCount: 234,
      verificationStatus: 'verified',
      documents: {
        commercialLicense: 'license_123.pdf',
        taxCertificate: 'tax_cert_123.pdf',
        bankAccount: 'bank_details_123.pdf'
      }
    },
    {
      id: '2',
      storeName: 'متجر الأدوات المتقدمة',
      ownerName: 'محمد عبدالله الرشيد',
      email: 'mohammed@advancedtools.sa',
      phone: '+966507654321',
      location: 'جدة',
      category: 'أدوات وآلات',
      status: 'pending',
      joinDate: '2024-12-18',
      lastActive: '2024-12-21',
      totalProducts: 89,
      totalOrders: 45,
      totalRevenue: 15500,
      commissionRate: 6.0,
      rating: 4.2,
      reviewCount: 28,
      verificationStatus: 'pending',
      documents: {
        commercialLicense: 'license_456.pdf',
        taxCertificate: 'tax_cert_456.pdf',
        bankAccount: 'bank_details_456.pdf'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'موافق عليه';
      case 'pending': return 'في الانتظار';
      case 'rejected': return 'مرفوض';
      case 'suspended': return 'معلق';
      default: return 'غير معروف';
    }
  };

  const approveVendor = async (vendorId: string) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId 
        ? { ...vendor, status: 'approved' as const, verificationStatus: 'verified' as const }
        : vendor
    ));
  };

  const rejectVendor = async (vendorId: string) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId 
        ? { ...vendor, status: 'rejected' as const, verificationStatus: 'rejected' as const }
        : vendor
    ));
  };

  const suspendVendor = async (vendorId: string) => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId 
        ? { ...vendor, status: 'suspended' as const }
        : vendor
    ));
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const VendorModal = ({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">تفاصيل المتجر</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">المعلومات الأساسية</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">اسم المتجر</label>
                  <p className="text-gray-900">{vendor.storeName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">اسم المالك</label>
                  <p className="text-gray-900">{vendor.ownerName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {vendor.email}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {vendor.phone}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">الموقع</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {vendor.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">إحصائيات العمل</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-sm font-medium">المنتجات</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{vendor.totalProducts}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">الطلبات</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{vendor.totalOrders}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-600">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">الإيرادات</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{vendor.totalRevenue.toLocaleString('en-US')} ر.س</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Star className="w-5 h-5" />
                    <span className="text-sm font-medium">التقييم</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">{vendor.rating}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => approveVendor(vendor.id)}
              disabled={vendor.status === 'approved'}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              <CheckCircle className="w-4 h-4" />
              موافقة
            </button>
            
            <button
              onClick={() => rejectVendor(vendor.id)}
              disabled={vendor.status === 'rejected'}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              <XCircle className="w-4 h-4" />
              رفض
            </button>
            
            <button
              onClick={() => suspendVendor(vendor.id)}
              disabled={vendor.status === 'suspended'}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
            >
              <XCircle className="w-4 h-4" />
              تعليق
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إدارة المتاجر</h1>
          <p className="text-gray-600 mt-2">إدارة المتاجر المسجلة في المنصة</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المتاجر</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {vendors.filter(v => v.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">موافق عليها</p>
                <p className="text-2xl font-bold text-green-600">
                  {vendors.filter(v => v.status === 'approved').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط التقييم</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن المتاجر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="approved">موافق عليه</option>
              <option value="rejected">مرفوض</option>
              <option value="suspended">معلق</option>
            </select>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المتجر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المالك
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتجات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإيرادات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التقييم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.storeName}</div>
                        <div className="text-sm text-gray-500">{vendor.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.ownerName}</div>
                      <div className="text-sm text-gray-500">{vendor.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                        {getStatusText(vendor.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.totalProducts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.totalRevenue.toLocaleString('en-US')} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-900">{vendor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" onClick={() => alert('Button clicked')}>
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedVendor && (
          <VendorModal
            vendor={selectedVendor}
            onClose={() => {
              setShowModal(false);
              setSelectedVendor(null);
            }}
          />
        )}
      </div>
    </div>
  );
}



