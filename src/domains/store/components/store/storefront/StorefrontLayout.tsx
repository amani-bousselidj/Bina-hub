import React from 'react';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontProducts } from './StorefrontProducts';

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  rating: number;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeName: string;
  storeId: string;
  category: string;
  stock?: number;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
  };
  featured?: boolean;
  onSale?: boolean;
  originalPrice?: number;
}

interface StorefrontLayoutProps {
  store: Store;
  products: Product[];
  loading?: boolean;
  onAddToProject?: (productId: string) => void;
  onViewProduct?: (productId: string) => void;
  onContactStore?: () => void;
  onFollowStore?: () => void;
  isFollowing?: boolean;
  showAddToProject?: boolean;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({
  store,
  products,
  loading = false,
  onAddToProject,
  onViewProduct,
  onContactStore,
  onFollowStore,
  isFollowing = false,
  showAddToProject = true,
}) => {
  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ 
        '--store-primary': store.theme.primaryColor,
        '--store-secondary': store.theme.secondaryColor,
      } as React.CSSProperties}
    >
      {/* Store Header */}
      <StorefrontHeader
        store={store}
        onContactStore={onContactStore}
        onFollowStore={onFollowStore}
        isFollowing={isFollowing}
      />

      {/* Store Products */}
      <StorefrontProducts
        storeId={store.id}
        storeName={store.name}
        products={products}
        loading={loading}
        onAddToProject={onAddToProject}
        onViewProduct={onViewProduct}
        showAddToProject={showAddToProject}
      />

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h3 className="font-bold text-lg">{store.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{store.description}</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{store.rating}</span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-gray-600">{store.productCount} منتج</span>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">بيانات التواصل</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{store.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{store.contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{store.contactInfo.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">روابط سريعة</h4>
              <div className="space-y-2 text-sm">
                <button className="block text-gray-600 hover:text-gray-900 transition-colors">
                  عن المتجر
                </button>
                <button className="block text-gray-600 hover:text-gray-900 transition-colors">
                  سياسة الإرجاع
                </button>
                <button className="block text-gray-600 hover:text-gray-900 transition-colors">
                  شروط الاستخدام
                </button>
                <button className="block text-gray-600 hover:text-gray-900 transition-colors">
                  اتصل بنا
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-8 text-center text-sm text-gray-500">
            <p>© 2025 {store.name}. جميع الحقوق محفوظة.</p>
            <p className="mt-1">مدعوم بواسطة منصة binaaHub</p>
          </div>
        </div>
      </footer>
    </div>
  );
};



