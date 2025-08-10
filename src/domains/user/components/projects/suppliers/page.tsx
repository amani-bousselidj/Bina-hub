'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Phone, MessageCircle, Users } from 'lucide-react';

export default function SuppliersPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('supplier');
  const [searchQuery, setSearchQuery] = useState('');

  const suppliers = [
    {
      id: '1',
      name: 'شركة الخليج للمواد',
      specialty: 'مواد البناء',
      phone: '+966501234567',
      whatsapp: '+966501234567'
    },
    {
      id: '2',
      name: 'مؤسسة البناء المتقدم',
      specialty: 'أدوات السباكة',
      phone: '+966507654321',
      whatsapp: '+966507654321'
    }
  ];

  const contractors = [
    {
      id: '1',
      name: 'مقاول محمد العلي',
      specialty: 'البناء العام',
      phone: '+966551234567',
      whatsapp: '+966551234567'
    },
    {
      id: '2',
      name: 'مقاولات الرياض',
      specialty: 'التشطيبات',
      phone: '+966557654321',
      whatsapp: '+966557654321'
    }
  ];

  const currentData = activeTab === 'supplier' ? suppliers : contractors;

  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
              دليل الموردين
            </Typography>
            <Typography variant="body" className="text-gray-600">
              دليل شامل للموردين والمقاولين
            </Typography>
          </div>
        </div>

        {/* Search Bar */}
        <EnhancedCard variant="elevated" className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث عن مورد أو مقاول..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </EnhancedCard>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('supplier')}
            className={`px-6 py-3 rounded-lg transition-colors font-medium ${
              activeTab === 'supplier'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            مورد
          </button>
          <button
            onClick={() => setActiveTab('contractor')}
            className={`px-6 py-3 rounded-lg transition-colors font-medium ${
              activeTab === 'contractor'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            مقاول
          </button>
        </div>

        {/* Add New Button */}
        <div className="mb-6">
          <Button 
            variant="filled"
            className="flex items-center gap-2"
           onClick={() => alert('Button clicked')}>
            <Plus className="w-4 h-4" />
            {activeTab === 'supplier' ? 'إضافة مورد جديد' : 'إضافة مقاول جديد'}
          </Button>
        </div>

        {/* List */}
        {currentData.length === 0 ? (
          <EnhancedCard variant="elevated" className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-2">
              لا توجد {activeTab === 'supplier' ? 'موردين' : 'مقاولين'} بعد
            </Typography>
            <Typography variant="body" size="md" className="text-gray-600">
              ابدأ بإضافة {activeTab === 'supplier' ? 'الموردين' : 'المقاولين'} المفضلين لديك
            </Typography>
          </EnhancedCard>
        ) : (
          <div className="space-y-4">
            {currentData
              .filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.specialty.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <EnhancedCard key={item.id} variant="elevated" hover className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-1">
                          {item.name}
                        </Typography>
                        <Typography variant="body" size="sm" className="text-gray-600">
                          {item.specialty}
                        </Typography>
                        <Typography variant="caption" size="xs" className="text-gray-500">
                          {item.phone}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        className="bg-green-100 text-green-600 p-3 rounded-lg hover:bg-green-200 transition-colors"
                        title="اتصال"
                       onClick={() => alert('Button clicked')}>
                        <Phone className="w-5 h-5" />
                      </button>
                      <button 
                        className="bg-green-100 text-green-600 p-3 rounded-lg hover:bg-green-200 transition-colors"
                        title="واتساب"
                       onClick={() => alert('Button clicked')}>
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </EnhancedCard>
              ))
            }
          </div>
        )}
      </div>
    </main>
  );
}



