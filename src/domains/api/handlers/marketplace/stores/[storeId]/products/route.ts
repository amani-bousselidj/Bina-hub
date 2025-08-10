import { NextRequest, NextResponse } from 'next/server';

interface Params {
  storeId: string;
}

// Mock products for each store
const storeProducts = {
  'store-1': [
    {
      id: '1',
      name: 'خرسانة عالية الجودة C30',
      description: 'خرسانة مقاومة للضغط 30 نيوتن/مم² مناسبة للأساسات والهياكل الخرسانية',
      price: 450,
      images: ['/api/placeholder/400/300'],
      category: 'خرسانة ومواد بناء',
      subcategory: 'خرسانة جاهزة',
      storeId: 'store-1',
      storeName: 'متجر مواد البناء الحديث',
      warranty: {
        duration: 5,
        type: 'years',
        details: 'ضمان ضد العيوب في التصنيع والجودة',
      },
      stock: 100,
      rating: 4.8,
      reviewsCount: 45,
      isAvailable: true,
      isFeatured: true,
    },
    {
      id: '6',
      name: 'عازل مائي للأسطح والخزانات',
      description: 'عازل مائي عالي الكفاءة للأسطح والخزانات مع مقاومة للأشعة فوق البنفسجية',
      price: 320,
      images: ['/api/placeholder/400/300'],
      category: 'عزل وحماية',
      subcategory: 'عزل مائي',
      storeId: 'store-1',
      storeName: 'متجر مواد البناء الحديث',
      warranty: {
        duration: 8,
        type: 'years',
        details: 'ضمان ضد التسرب والتشقق',
      },
      stock: 200,
      rating: 4.8,
      reviewsCount: 76,
      isAvailable: true,
      isFeatured: false,
    },
  ],
  'store-2': [
    {
      id: '2',
      name: 'حديد تسليح عالي الكربون 12مم',
      description: 'حديد تسليح مطابق للمواصفات السعودية SASO مع شهادة جودة معتمدة',
      price: 2800,
      images: ['/api/placeholder/400/300'],
      category: 'حديد وصلب',
      subcategory: 'حديد تسليح',
      storeId: 'store-2',
      storeName: 'شركة الحديد المتين',
      warranty: {
        duration: 10,
        type: 'years',
        details: 'ضمان ضد الصدأ والتآكل في الظروف العادية',
      },
      stock: 500,
      rating: 4.9,
      reviewsCount: 67,
      isAvailable: true,
      isFeatured: true,
    },
  ],
  'store-3': [
    {
      id: '3',
      name: 'بلاط الأرضيات الرخامي الفاخر',
      description: 'بلاط رخامي إيطالي فاخر للأرضيات والحوائط مع تشطيب لامع',
      price: 180,
      images: ['/api/placeholder/400/300'],
      category: 'أرضيات وتبليط',
      subcategory: 'بلاط رخامي',
      storeId: 'store-3',
      storeName: 'معرض الرخام الملكي',
      warranty: {
        duration: 3,
        type: 'years',
        details: 'ضمان ضد الكسر والخدش في الاستخدام العادي',
      },
      stock: 800,
      rating: 4.7,
      reviewsCount: 123,
      isAvailable: true,
      isFeatured: true,
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { storeId } = params;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';

    // Simulate database lookup
    await new Promise(resolve => setTimeout(resolve, 100));

    let products = storeProducts[storeId as keyof typeof storeProducts] || [];

    // Filter by category
    if (category && category !== '') {
      products = products.filter(product => 
        product.category === category || product.subcategory === category
      );
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by featured
    if (featured) {
      products = products.filter(product => product.isFeatured);
    }

    // Apply pagination
    const total = products.length;
    const paginatedProducts = products.slice(offset, offset + limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      success: true,
    });

  } catch (error) {
    console.error('Error fetching store products:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'فشل في جلب منتجات المتجر',
        success: false,
      },
      { status: 500 }
    );
  }
}

