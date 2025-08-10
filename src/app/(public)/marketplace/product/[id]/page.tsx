import React from 'react';
import { ArrowRightIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

// Following strategic vision: All data from Supabase (no hardcoded data)
async function getProduct(productId: string) {
  // TODO: Replace with actual Supabase query
  // const { data: product } = await supabase
  //   .from('products')
  //   .select(`
  //     *,
  //     stores(name, logo, rating),
  //     reviews(rating, comment, user_name, created_at)
  //   `)
  //   .eq('id', productId)
  //   .single();
  
  // Mock product data for now - will be replaced with Supabase data
  return {
    id: productId,
    name: 'أسمنت بورتلاندي عالي الجودة',
    description: 'أسمنت بورتلاندي مقاوم للكبريتات ومناسب لجميع أنواع البناء والخرسانة المسلحة. يتميز بقوة الضغط العالية ومقاومة العوامل الجوية.',
    price: 45.50,
    originalPrice: 52.00,
    category: 'cement',
    subcategory: 'portland',
    images: [
      '/api/placeholder/500/400',
      '/api/placeholder/500/400',
      '/api/placeholder/500/400'
    ],
    specifications: {
      'الوزن': '50 كيلو',
      'النوع': 'بورتلاندي مقاوم للكبريتات',
      'المقاومة': '42.5 MPa',
      'وقت الشك': '45 دقيقة',
      'المواصفات': 'ASTM C150',
      'بلد المنشأ': 'المملكة العربية السعودية'
    },
    features: [
      'مقاوم للكبريتات والأملاح',
      'قوة ضغط عالية',
      'سهولة في الخلط والاستخدام',
      'مناسب للمناخ الصحراوي',
      'جودة مضمونة ومعتمدة'
    ],
    warranty: {
      duration: 2,
      type: 'years' as const,
      details: 'ضمان الجودة والمطابقة للمواصفات لمدة سنتين من تاريخ الشراء'
    },
    stock: 100,
    store: {
      id: 'store1',
      name: 'مؤسسة البناء المتقدم',
      logo: '/api/placeholder/80/80',
      rating: 4.8,
      reviewCount: 234
    },
    rating: 4.6,
    reviewCount: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const product = await getProduct(id);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarSolidIcon key={star} className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="h-5 w-5 text-gray-300" />
          )
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-4" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/marketplace" className="hover:text-blue-600">السوق</Link>
        <span>/</span>
        <Link href={`/marketplace/${product.category}`} className="hover:text-blue-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {product.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${product.name} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600">
              ({product.reviewCount} تقييم)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Store Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 relative rounded-full overflow-hidden">
              <Image
                src={product.store.logo}
                alt={product.store.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{product.store.name}</h3>
              <div className="flex items-center gap-2">
                {renderStars(product.store.rating)}
                <span className="text-sm text-gray-600">
                  ({product.store.reviewCount} تقييم)
                </span>
              </div>
            </div>
            <Link
              href={`/store/${product.store.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              عرض المتجر
            </Link>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Badge variant={product.stock > 0 ? "success" : "destructive"}>
              {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'غير متوفر'}
            </Badge>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              disabled={product.stock === 0}
            >
              <ShoppingCartIcon className="h-5 w-5 ml-2" />
              إضافة إلى السلة
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                إضافة للمفضلة
              </Button>
              <Button variant="outline" size="sm">
                مشاركة المنتج
              </Button>
            </div>
          </div>

          {/* Warranty */}
          {product.warranty && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-1">ضمان المنتج</h3>
              <p className="text-sm text-green-700">{product.warranty.details}</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Specifications */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المواصفات التقنية</h2>
          <div className="space-y-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المميزات</h2>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

