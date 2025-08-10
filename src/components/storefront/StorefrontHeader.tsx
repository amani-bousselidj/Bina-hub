import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Separator } from '@/components/ui/separator';

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

interface StorefrontHeaderProps {
  store: Store;
  onContactStore?: () => void;
  onFollowStore?: () => void;
  isFollowing?: boolean;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  store,
  onContactStore,
  onFollowStore,
  isFollowing = false,
}) => {
  return (
    <>
      {/* Cover Image Section */}
      <div 
        className="relative h-64 w-full mb-16"
        style={{ backgroundColor: store.theme.secondaryColor }}
      >
        {store.coverImage && (
          <div className="absolute inset-0">
            <Image
              src={store.coverImage}
              alt={`${store.name} cover`}
              fill
              className="object-cover opacity-80"
            />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Store Logo */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image
                src={store.logo}
                alt={store.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center pb-16">
          <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">{store.description}</p>
          
          {/* Rating and Product Count */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-medium">{store.rating}</span>
            </div>
            <Separator orientation="vertical" className="h-4 bg-white/30" />
            <span>{store.productCount} منتج</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="container mx-auto px-4 -mt-8 mb-8">
        <div className="flex justify-center gap-4">
          <Button
            onClick={onFollowStore}
            variant={isFollowing ? "outline" : "default"}
            size="lg"
            className="min-w-32"
            style={{ 
              backgroundColor: !isFollowing ? store.theme.primaryColor : 'transparent',
              borderColor: store.theme.primaryColor,
              color: !isFollowing ? 'white' : store.theme.primaryColor
            }}
          >
            {isFollowing ? 'إلغاء المتابعة' : 'متابعة المتجر'}
          </Button>
          
          <Button
            onClick={onContactStore}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            تواصل معنا
          </Button>
        </div>
      </div>

      {/* Store Information */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-lg mb-4">معلومات المتجر</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">بيانات التواصل</h4>
              <div className="space-y-2 text-sm text-gray-600">
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

            {/* Store Stats */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">إحصائيات المتجر</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">عدد المنتجات</span>
                  <Badge variant="outline">{store.productCount}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">التقييم</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{store.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">المتابعون</span>
                  <Badge variant="outline">1.2k متابع</Badge>
                </div>
              </div>
            </div>

            {/* Store Features */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">مميزات المتجر</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  توصيل مجاني
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  ضمان شامل
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  أسعار تنافسية
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


