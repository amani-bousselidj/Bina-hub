'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  storeId: string;
  storeName: string;
  images: string[];
  specifications: Record<string, string>;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
    details: string;
  };
  stock: number;
  created_at: string;
  updated_at: string;
}

interface SelectedProduct extends Product {
  quantity: number;
  phaseId?: string;
}

interface MarketplaceContextType {
  projectId?: string;
  phaseId?: string;
  isProjectContext: boolean;
  selectedProducts: SelectedProduct[];
  addProductToSelection: (product: Product, quantity: number) => void;
  removeProductFromSelection: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearSelection: () => void;
  getTotalAmount: () => number;
  getProductCount: () => number;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface MarketplaceProviderProps {
  children: ReactNode;
  projectId?: string;
  phaseId?: string;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({ 
  children, 
  projectId = undefined, 
  phaseId = undefined 
}) => {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  
  const addProductToSelection = (product: Product, quantity: number) => {
    setSelectedProducts(prev => {
      const existingProduct = prev.find(p => p.id === product.id);
      if (existingProduct) {
        return prev.map(p => 
          p.id === product.id 
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prev, { ...product, quantity, phaseId }];
    });
  };
  
  const removeProductFromSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.filter(product => product.id !== productId)
    );
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromSelection(productId);
      return;
    }
    
    setSelectedProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, quantity }
          : product
      )
    );
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((total, product) => 
      total + (product.price * product.quantity), 0
    );
  };

  const getProductCount = () => {
    return selectedProducts.reduce((count, product) => 
      count + product.quantity, 0
    );
  };
  
  const contextValue: MarketplaceContextType = {
    projectId,
    phaseId,
    isProjectContext: !!projectId,
    selectedProducts,
    addProductToSelection,
    removeProductFromSelection,
    updateProductQuantity,
    clearSelection,
    getTotalAmount,
    getProductCount
  };

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

export type { Product, SelectedProduct, MarketplaceContextType };



