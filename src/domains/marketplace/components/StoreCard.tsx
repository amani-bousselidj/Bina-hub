import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage?: string;
  rating: number;
  productCount: number;
  categories: string[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

interface StoreCardProps {
  store: Store;
  onViewStore?: (storeId: string) => void;
  compact?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onViewStore,
  compact = false,
}) => {
  if (compact) {
    return (
      <div 
        className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
        onClick={() => onViewStore?.(store.id)}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={store.logo}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{store.name}</h3>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-xs text-gray-600">{store.rating}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-600">{store.productCount} منتج</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={() => onViewStore?.(store.id)}
    >
      {/* Cover Image */}
      {store.coverImage && (
        <div className="relative h-32 w-full">
          <Image
            src={store.coverImage}
            alt={`${store.name} cover`}
            fill
            className="object-cover"
            style={{ backgroundColor: store.theme.secondaryColor }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      )}

      <div className="p-6">
        {/* Store Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <Image
              src={store.logo}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{store.name}</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600">{store.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{store.productCount} منتج</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{store.description}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {store.categories.slice(0, 3).map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
          {store.categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{store.categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Contact Info Preview */}
        <div className="text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{store.contactInfo.address}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          style={{ 
            borderColor: store.theme.primaryColor,
            color: store.theme.primaryColor 
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = store.theme.primaryColor;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = store.theme.primaryColor;
          }}
        >
          زيارة المتجر
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Button>
      </div>
    </div>
  );
};



