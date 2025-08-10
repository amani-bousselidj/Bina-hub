import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { AddToCart } from './AddToCart';
import { Store, Star, Shield } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeName: string;
  storeId: string;
  category?: string;
  stock?: number;
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
  warranty,
  onAddToProject,
  onViewStore,
  onViewProduct,
  showAddToProject = true,
}) => {
  const isOutOfStock = stock !== undefined && stock <= 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const product = {
    id,
    name,
    price,
    store_id: storeId,
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
            {warranty.duration} {warranty.type === 'years' ? 'yr' : 'mo'}
          </Badge>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
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
            {stock !== undefined && stock > 0 && (
              <p className="text-xs text-gray-500">
                {stock} in stock
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs text-gray-600">4.5</span>
          </div>
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
              Add to Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


