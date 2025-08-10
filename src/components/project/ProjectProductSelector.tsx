import React, { useState, useEffect } from 'react';
import { ProductGrid } from '@/domains/marketplace/components/ProductGrid';
import { CategoryFilter } from '@/domains/marketplace/components/CategoryFilter';
import { ProductSearch } from '@/domains/marketplace/components/ProductSearch';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui';

interface ProjectProductSelectorProps {
  projectId: string;
  phaseId?: string;
  phaseName?: string;
  onClose?: () => void;
  onProductsSelected?: (products: SelectedProduct[]) => void;
}

interface SelectedProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
}

export const ProjectProductSelector: React.FC<ProjectProductSelectorProps> = ({
  projectId,
  phaseId,
  phaseName = 'المرحلة الحالية',
  onClose,
  onProductsSelected,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleAddToProject = (productId: string, productData: any) => {
    const existingProduct = selectedProducts.find(p => p.productId === productId);
    
    if (existingProduct) {
      setSelectedProducts(prev => 
        prev.map(p => 
          p.productId === productId 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setSelectedProducts(prev => [...prev, {
        productId,
        name: productData.name,
        price: productData.price,
        quantity: 1,
        storeId: productData.storeId,
        storeName: productData.storeName,
      }]);
    }
    
    toast({
      title: 'تم إضافة المنتج',
      description: `تم إضافة ${productData.name} إلى ${phaseName}`,
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    
    setSelectedProducts(prev => 
      prev.map(p => 
        p.productId === productId 
          ? { ...p, quantity: newQuantity }
          : p
      )
    );
  };

  const handleConfirmSelection = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: 'لا توجد منتجات مختارة',
        description: 'يرجى اختيار منتج واحد على الأقل',
        variant: 'destructive',
      });
      return;
    }

    onProductsSelected?.(selectedProducts);
    toast({
      title: 'تم حفظ المنتجات',
      description: `تم إضافة ${selectedProducts.length} منتج إلى ${phaseName}`,
    });
  };

  const totalCost = selectedProducts.reduce(
    (sum, product) => sum + (product.price * product.quantity), 
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للمشروع
              </Button>
              <div>
                <h1 className="text-xl font-semibold">اختيار المنتجات</h1>
                <p className="text-sm text-gray-600">{phaseName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                {selectedProducts.length} منتج مختار
              </Badge>
              {selectedProducts.length > 0 && (
                <span className="font-semibold text-blue-600">
                  {totalCost.toLocaleString()} ريال
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold mb-4">البحث والتصفية</h3>
              
              <div className="space-y-6">
                <ProductSearch 
                  value={searchQuery}
                  onSearch={setSearchQuery}
                  placeholder="البحث عن المنتجات..."
                />
                
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid 
              searchQuery={searchQuery}
              category={selectedCategory || undefined}
              projectContext={true}
            />
          </div>
        </div>
      </div>

      {/* Selected Products Summary - Fixed Bottom Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  المنتجات المختارة ({selectedProducts.length})
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {totalCost.toLocaleString()} ريال
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProducts([])}
                >
                  إلغاء الكل
                </Button>
                <Button 
                  onClick={handleConfirmSelection}
                  className="gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  إضافة إلى المشروع
                </Button>
              </div>
            </div>
            
            {/* Selected Products List */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedProducts.map((product) => (
                <div 
                  key={product.productId}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.storeName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuantityChange(product.productId, product.quantity - 1)}
                        className="w-6 h-6 rounded border bg-white flex items-center justify-center text-sm hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{product.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product.productId, product.quantity + 1)}
                        className="w-6 h-6 rounded border bg-white flex items-center justify-center text-sm hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(product.productId)}
                      className="text-red-500 hover:text-red-700 text-sm px-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


