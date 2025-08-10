import { NextRequest, NextResponse } from 'next/server';

interface Params {
  productId: string;
}

// Mock data for individual product details
const mockProducts = {
  '1': {
    id: '1',
    name: 'خرسانة عالية الجودة C30',
    description: 'خرسانة مقاومة للضغط 30 نيوتن/مم² مناسبة للأساسات والهياكل الخرسانية. تم تصنيعها وفقاً لأعلى المعايير الدولية مع ضمان الجودة والمتانة.',
    longDescription: `
      خرسانة C30 عالية الجودة مثالية للمشاريع الإنشائية الكبرى. تتميز بمقاومة عالية للضغط تصل إلى 30 نيوتن/مم² بعد 28 يوماً من الصب.
      
      المميزات:
      • مقاومة عالية للضغط والشد
      • سهولة في التشكيل والصب
      • مقاومة للعوامل الجوية
      • مطابقة للمواصفات السعودية والدولية
      
      الاستخدامات:
      • الأساسات العميقة
      • الأعمدة والجسور
      • الأسقف الخرسانية
      • الهياكل الإنشائية المختلفة
    `,
    price: 450,
    originalPrice: 500,
    discount: 10,
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
    ],
    category: 'خرسانة ومواد بناء',
    subcategory: 'خرسانة جاهزة',
    storeId: 'store-1',
    storeName: 'متجر مواد البناء الحديث',
    storeRating: 4.8,
    storeReviewsCount: 245,
    specifications: {
      'نوع الخرسانة': 'C30',
      'المقاومة': '30 نيوتن/مم²',
      'وقت التصلب': '28 يوم',
      'الحد الأقصى للركام': '20 مم',
      'نسبة الماء إلى الإسمنت': '0.45',
      'درجة الانسيابية': 'S3',
      'المقاومة للتجمد': 'F2',
    },
    warranty: {
      duration: 5,
      type: 'years',
      details: 'ضمان ضد العيوب في التصنيع والجودة مع استبدال مجاني في حالة وجود عيوب',
    },
    stock: 100,
    minOrderQuantity: 5,
    unit: 'متر مكعب',
    weight: '2400 كغ/م³',
    deliveryTime: '2-3 أيام عمل',
    rating: 4.8,
    reviewsCount: 45,
    reviews: [
      {
        id: 1,
        userName: 'أحمد محمد',
        rating: 5,
        comment: 'خرسانة ممتازة الجودة، استخدمتها في مشروع فيلا والنتيجة رائعة',
        date: '2024-07-15',
      },
      {
        id: 2,
        userName: 'محمد العلي',
        rating: 4,
        comment: 'جودة جيدة والسعر مناسب، ولكن التسليم تأخر قليلاً',
        date: '2024-07-10',
      },
    ],
    relatedProducts: ['2', '6'],
    tags: ['خرسانة', 'بناء', 'أساسات', 'C30', 'جودة عالية'],
    features: [
      'مقاومة عالية للضغط',
      'سهولة في التطبيق',
      'مطابقة للمواصفات',
      'ضمان لمدة 5 سنوات',
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-08-01'),
  },
  // Add more detailed products as needed
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { productId } = params;

    // Simulate database lookup
    await new Promise(resolve => setTimeout(resolve, 100));

    const product = mockProducts[productId as keyof typeof mockProducts];

    if (!product) {
      return NextResponse.json(
        { 
          error: 'Product not found',
          message: 'المنتج غير موجود',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
      success: true,
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'فشل في جلب بيانات المنتج',
        success: false,
      },
      { status: 500 }
    );
  }
}

