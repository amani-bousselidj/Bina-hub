'use client';

import React, { useState, useEffect } from 'react';
import { StorefrontLayout } from '@/components/storefront/StorefrontLayout';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui';

interface StorePageProps {
  params: {
    storeId: string;
  };
}

export default function StorePage({ params }: StorePageProps) {
  const router = useRouter();
  const { storeId } = params;
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock store data
      const mockStore = {
        id: storeId,
        name: 'متجر البناء الحديث',
        description: 'متخصصون في مواد البناء والتشطيب عالية الجودة منذ 1995. نوفر أفضل المنتجات بأسعار تنافسية مع خدمة عملاء متميزة.',
        logo: '/api/placeholder/100/100',
        coverImage: '/api/placeholder/1200/400',
        theme: {
          primaryColor: '#2563eb',
          secondaryColor: '#eff6ff',
        },
        contactInfo: {
          email: 'info@modern-construction.com',
          phone: '+966 50 123 4567',
          address: 'طريق الملك فهد، الرياض 12345، المملكة العربية السعودية',
        },
        rating: 4.8,
        productCount: 156,
      };

      // Mock products data
      const mockProducts = [
        {
          id: '1',
          name: 'بلاط سيراميك فاخر 60x60',
          description: 'بلاط سيراميك عالي الجودة مناسب للأرضيات والجدران، مقاوم للخدش والماء',
          price: 45,
          imageUrl: '/api/placeholder/300/200',
          storeName: mockStore.name,
          storeId: mockStore.id,
          category: 'building-materials',
          stock: 150,
          warranty: { duration: 2, type: 'years' },
          featured: true,
          onSale: false,
        },
        {
          id: '2',
          name: 'دهان أكريليك داخلي',
          description: 'دهان أكريليك عالي الجودة للجدران الداخلية، متوفر بألوان متعددة',
          price: 68,
          originalPrice: 85,
          imageUrl: '/api/placeholder/300/200',
          storeName: mockStore.name,
          storeId: mockStore.id,
          category: 'building-materials',
          stock: 75,
          warranty: { duration: 6, type: 'months' },
          featured: false,
          onSale: true,
        },
        {
          id: '3',
          name: 'أسمنت بورتلاندي',
          description: 'أسمنت بورتلاندي عالي الجودة مناسب لجميع أعمال البناء والخرسانة',
          price: 25,
          imageUrl: '/api/placeholder/300/200',
          storeName: mockStore.name,
          storeId: mockStore.id,
          category: 'building-materials',
          stock: 200,
          warranty: { duration: 1, type: 'years' },
          featured: true,
          onSale: false,
        },
        {
          id: '4',
          name: 'طوب أحمر عازل',
          description: 'طوب أحمر عازل للحرارة والرطوبة، مناسب للجدران الخارجية والداخلية',
          price: 0.8,
          imageUrl: '/api/placeholder/300/200',
          storeName: mockStore.name,
          storeId: mockStore.id,
          category: 'building-materials',
          stock: 5000,
          warranty: { duration: 5, type: 'years' },
          featured: false,
          onSale: false,
        },
      ] as any;

      setStore(mockStore);
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchStoreData();
  }, [storeId]);

  const handleAddToProject = (productId: string) => {
    console.log('Adding product to project:', productId);
    toast({
      title: 'تم إضافة المنتج',
      description: 'يرجى تسجيل الدخول أو اختيار مشروع لإضافة المنتجات',
    });
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/marketplace/product/${productId}`);
  };

  const handleContactStore = () => {
    // Open contact modal or redirect to contact page
    toast({
      title: 'التواصل مع المتجر',
      description: 'سيتم التواصل معك قريباً',
    });
  };

  const handleFollowStore = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? 'تم إلغاء المتابعة' : 'تم متابعة المتجر',
      description: isFollowing ? 'لن تتلقى تحديثات من هذا المتجر' : 'ستتلقى تحديثات عن المنتجات الجديدة والعروض',
    });
  };

  if (loading || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المتجر...</p>
        </div>
      </div>
    );
  }

  return (
    <StorefrontLayout
      store={store}
      products={products}
      loading={loading}
      onAddToProject={handleAddToProject}
      onViewProduct={handleViewProduct}
      onContactStore={handleContactStore}
      onFollowStore={handleFollowStore}
      isFollowing={isFollowing}
      showAddToProject={true}
    />
  );
}

