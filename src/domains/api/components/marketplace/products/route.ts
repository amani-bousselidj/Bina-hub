import { NextRequest, NextResponse } from 'next/server';

// Mock data for products
const mockProducts = [
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
    specifications: {
      'نوع الخرسانة': 'C30',
      'المقاومة': '30 نيوتن/مم²',
      'وقت التصلب': '28 يوم',
      'الحد الأقصى للركام': '20 مم',
    },
    warranty: {
      duration: 5,
      type: 'years',
      details: 'ضمان ضد العيوب في التصنيع والجودة',
    },
    stock: 100,
    rating: 4.8,
    reviewsCount: 45,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-08-01'),
  },
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
    specifications: {
      'القطر': '12 مم',
      'النوع': 'عالي الكربون',
      'الطول': '12 متر',
      'المعيار': 'SASO 1500',
    },
    warranty: {
      duration: 10,
      type: 'years',
      details: 'ضمان ضد الصدأ والتآكل في الظروف العادية',
    },
    stock: 500,
    rating: 4.9,
    reviewsCount: 67,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-07-30'),
  },
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
    specifications: {
      'المقاس': '60×60 سم',
      'السماكة': '12 مم',
      'اللون': 'أبيض كراري',
      'المنشأ': 'إيطاليا',
      'التشطيب': 'لامع',
    },
    warranty: {
      duration: 3,
      type: 'years',
      details: 'ضمان ضد الكسر والخدش في الاستخدام العادي',
    },
    stock: 800,
    rating: 4.7,
    reviewsCount: 123,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-08-02'),
  },
  {
    id: '4',
    name: 'دهان خارجي مقاوم للعوامل الجوية',
    description: 'دهان أكريليك عالي الجودة للواجهات الخارجية مقاوم للأشعة فوق البنفسجية',
    price: 95,
    images: ['/api/placeholder/400/300'],
    category: 'دهانات وتشطيبات',
    subcategory: 'دهان خارجي',
    storeId: 'store-4',
    storeName: 'مستودع الدهانات الحديث',
    specifications: {
      'الحجم': '20 لتر',
      'النوع': 'أكريليك',
      'التطبيق': 'خارجي',
      'التغطية': '15-20 م²/لتر',
      'وقت الجفاف': '4-6 ساعات',
    },
    warranty: {
      duration: 2,
      type: 'years',
      details: 'ضمان ضد التقشر والبهتان',
    },
    stock: 150,
    rating: 4.6,
    reviewsCount: 89,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-07-28'),
  },
  {
    id: '5',
    name: 'نوافذ الألمنيوم الحرارية',
    description: 'نوافذ ألمنيوم عازلة للحرارة والصوت مع زجاج مزدوج وفتح متعدد الاتجاهات',
    price: 1200,
    images: ['/api/placeholder/400/300'],
    category: 'نوافذ وأبواب',
    subcategory: 'نوافذ ألمنيوم',
    storeId: 'store-5',
    storeName: 'مصنع النوافذ الذكية',
    specifications: {
      'المقاس': '120×150 سم',
      'النوع': 'ألمنيوم حراري',
      'العزل': 'زجاج مزدوج',
      'سماكة الزجاج': '6+12+6 مم',
      'نوع الفتح': 'متعدد الاتجاهات',
    },
    warranty: {
      duration: 7,
      type: 'years',
      details: 'ضمان شامل ضد العيوب والتآكل مع صيانة دورية',
    },
    stock: 50,
    rating: 4.9,
    reviewsCount: 34,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-08-03'),
  },
  {
    id: '6',
    name: 'عازل مائي للأسطح والخزانات',
    description: 'عازل مائي عالي الكفاءة للأسطح والخزانات مع مقاومة للأشعة فوق البنفسجية',
    price: 320,
    images: ['/api/placeholder/400/300'],
    category: 'عزل وحماية',
    subcategory: 'عزل مائي',
    storeId: 'store-6',
    storeName: 'شركة العزل المتقدم',
    specifications: {
      'النوع': 'بولي يوريثان',
      'السماكة': '2-3 مم',
      'المقاومة': 'UV مقاوم',
      'التطبيق': 'فرشاة أو رولر',
      'التغطية': '4-6 م²/كغ',
    },
    warranty: {
      duration: 8,
      type: 'years',
      details: 'ضمان ضد التسرب والتشقق',
    },
    stock: 200,
    rating: 4.8,
    reviewsCount: 76,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-08-01'),
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const storeId = searchParams.get('storeId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredProducts = [...mockProducts];

    // Filter by category
    if (category && category !== '') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === category || product.subcategory === category
      );
    }

    // Filter by store
    if (storeId) {
      filteredProducts = filteredProducts.filter(product => 
        product.storeId === storeId
      );
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.storeName.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'فشل في جلب المنتجات',
        success: false,
      },
      { status: 500 }
    );
  }
}



