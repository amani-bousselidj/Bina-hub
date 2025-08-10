// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, BarChart3, Package, AlertTriangle, Eye } from 'lucide-react';
import { ConstructionProduct, ConstructionCategory } from '@/core/shared/types/construction';

interface ProductCatalogProps {
  language?: 'ar' | 'en';
  onProductSelect?: (product: ConstructionProduct) => void;
  showAddButton?: boolean;
}

export const ConstructionProductCatalog: React.FC<ProductCatalogProps> = ({
  language = 'en',
  onProductSelect,
  showAddButton = true
}) => {
  const [products, setProducts] = useState<ConstructionProduct[]>([]);
  const [categories, setCategories] = useState<ConstructionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const isRTL = language === 'ar';

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [language]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, stockFilter, pagination.page, language]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories/construction?language=${language}&include_products_count=true`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        language,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
        ...(stockFilter && { stock_status: stockFilter })
      });

      const response = await fetch(`/api/products/construction?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStockStatusColor = (status?: string) => {
    switch (status) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'out': return 'text-red-600 bg-red-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStockStatusText = (status?: string) => {
    const texts = {
      ar: { normal: 'متوفر', low: 'كمية قليلة', out: 'نفدت الكمية' },
      en: { normal: 'In Stock', low: 'Low Stock', out: 'Out of Stock' }
    };
    return texts[language][(status || 'normal') as keyof typeof texts[typeof language]] || (status || 'normal');
  };

  const formatPrice = (price: number, currency: string) => {
    const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
    return formatted;
  };

  return (
    <div className={`construction-catalog ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="catalog-header bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-2xl font-bold text-gray-800">
            {language === 'ar' ? 'كتالوج مواد البناء' : 'Construction Materials Catalog'}
          </h2>
          
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} />
              {language === 'ar' ? 'الفلاتر' : 'Filters'}
            </button>
            
            {showAddButton && (
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => alert('Button clicked')}>
                <Plus size={20} />
                {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'البحث عن المنتجات...' : 'Search products...'}
              className={`w-full py-3 ${isRTL ? 'pr-10 text-right' : 'pl-10'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'الفئة' : 'Category'}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {language === 'ar' ? category.name_ar : category.name_en}
                      {category.products_count && ` (${category.products_count})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'حالة المخزون' : 'Stock Status'}
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="normal">{getStockStatusText('normal')}</option>
                  <option value="low">{getStockStatusText('low')}</option>
                  <option value="out">{getStockStatusText('out')}</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setStockFilter('');
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {language === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                onSelect={onProductSelect}
                formatPrice={formatPrice}
                getStockStatusColor={getStockStatusColor}
                getStockStatusText={getStockStatusText}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'ar' ? 'السابق' : 'Previous'}
            </button>
            
            <span className="px-4 py-2">
              {language === 'ar' ? 
                `صفحة ${pagination.page} من ${pagination.totalPages}` :
                `Page ${pagination.page} of ${pagination.totalPages}`
              }
            </span>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: ConstructionProduct;
  language: 'ar' | 'en';
  onSelect?: (product: ConstructionProduct) => void;
  formatPrice: (price: number, currency: string) => string;  getStockStatusColor: (status?: string) => string;
  getStockStatusText: (status?: string) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onSelect,
  formatPrice,
  getStockStatusColor,
  getStockStatusText
}) => {
  const isRTL = language === 'ar';
  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productDescription = language === 'ar' ? product.description_ar : product.description_en;

  return (
    <div 
      className="product-card bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(product)}
    >
      {/* Product Image */}
      <div className="relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={productName}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-lg">
            <Package size={48} className="text-gray-400" />
          </div>
        )}

        {/* Stock Status Badge */}
        <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'}`}>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
            {getStockStatusText(product.stock_status)}
          </span>
        </div>

        {/* Hazardous Badge */}
        {product.is_hazardous && (
          <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'}`}>
            <AlertTriangle size={20} className="text-orange-500" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className={`font-semibold text-gray-800 line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {productName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {product.category_name}
          </p>
        </div>

        {productDescription && (
          <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {productDescription}
          </p>
        )}

        {/* SKU and Barcode */}
        <div className="mb-3 text-xs text-gray-500">
          <div>{language === 'ar' ? 'رمز المنتج:' : 'SKU:'} {product.sku}</div>
          {product.barcode && (
            <div>{language === 'ar' ? 'الباركود:' : 'Barcode:'} {product.barcode}</div>
          )}
        </div>

        {/* Stock Info */}
        <div className="mb-3">
          <div className={`flex justify-between items-center text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-gray-600">
              {language === 'ar' ? 'المخزون:' : 'Stock:'}
            </span>
            <span className="font-medium">
              {product.current_stock || 0} {product.unit_of_measure}
            </span>
          </div>
          
          {/* Stock Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${
                product.stock_status === 'out' ? 'bg-red-500' :
                product.stock_status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min(((product.current_stock || 0) / ((product.minimum_stock || 1) * 2)) * 100, 100)}%`
              }}
            />
          </div>
        </div>

        {/* Price */}
        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm text-gray-600">
            {language === 'ar' ? 'السعر:' : 'Price:'}
          </span>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.selling_price || 0, product.currency || 'SAR')}
          </span>
        </div>

        {/* Specifications Preview */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className={`flex items-center gap-1 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Eye size={14} />
              <span>{language === 'ar' ? 'المواصفات متاحة' : 'Specifications available'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstructionProductCatalog;





