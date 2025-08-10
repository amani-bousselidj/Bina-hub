import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/core/shared/currency/format';
import { Badge } from '@/components/ui';
import { AddToCart } from './AddToCart';
import { Store, Star, Shield } from 'lucide-react';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeName: string;
  storeId: string;
  category?: string;
  stock?: number;
  freeShipping?: boolean;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
  };
  onAddToProject?: (productId: string) => void;
  onViewStore?: (storeId: string) => void;
  onViewProduct?: (productId: string) => void;
  showAddToProject?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  storeName,
  storeId,
  category,
  stock,
  freeShipping,
  warranty,
  onAddToProject,
  onViewStore,
  onViewProduct,
  showAddToProject = true,
}) => {
  const isOutOfStock = stock !== undefined && stock <= 0;

  const formatPrice = (price: number) => formatCurrency(price);

  const product = {
    id,
    name,
    price,
    storeId: storeId,
    storeName: storeName,
    stock
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white group">
      <div className="relative h-48 w-full cursor-pointer" onClick={() => onViewProduct?.(id)}>
        <Image
          src={imageUrl || '/placeholder-product.jpg'}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {category && (
          <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs">
            {category}
          </Badge>
        )}
        {warranty && (
            <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {warranty.duration} {warranty.type === 'years' ? 'سنة' : 'شهر'}
          </Badge>
        )}
        {freeShipping && (
          <Badge className="absolute top-10 right-2 bg-emerald-100 text-emerald-700 text-xs">
            شحن مجاني
          </Badge>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">غير متوفر</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 
            className="font-semibold text-lg mb-1 cursor-pointer hover:text-blue-600 line-clamp-2 leading-tight"
            onClick={() => onViewProduct?.(id)}
            title={name}
          >
            {name}
          </h3>
          
          <button 
            className="text-sm text-gray-600 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors" 
            onClick={() => onViewStore?.(storeId)}
          >
            <Store className="h-3 w-3" />
            {storeName}
          </button>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg text-gray-900">{formatPrice(price)}</span>
            {typeof stock === 'number' && stock >= 0 && (
              <p className="text-xs text-gray-500">
                المتوفر: {stock}
              </p>
            )}
          </div>
          
          {/* Rating removed until real data is provided */}
        </div>
        
        <div className="space-y-2">
          <AddToCart 
            product={product}
            variant="compact"
            size="sm"
          />
          
          {showAddToProject && (
            <Button 
              onClick={() => onAddToProject?.(id)} 
              variant="outline" 
              size="sm"
              className="w-full text-xs"
              disabled={isOutOfStock}
            >
              إضافة إلى المشروع
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};



