import { NextRequest, NextResponse } from 'next/server';

// Mock data for stores
const mockStores = [
  {
    id: 'store-1',
    name: 'متجر مواد البناء الحديث',
    description: 'متخصصون في مواد البناء والخرسانة عالية الجودة منذ 1995. نوفر أفضل المنتجات بأسعار تنافسية مع خدمة عملاء متميزة.',
    logo: '/api/placeholder/150/150',
    coverImage: '/api/placeholder/1200/400',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#eff6ff',
      fontFamily: 'Cairo',
    },
    contactInfo: {
      email: 'info@modern-construction.com',
      phone: '+966 50 123 4567',
      whatsapp: '+966 50 123 4567',
      address: 'طريق الملك فهد، الرياض 12345، المملكة العربية السعودية',
      location: {
        lat: 24.7136,
        lng: 46.6753,
      },
    },
    businessHours: {
      sunday: '8:00 AM - 6:00 PM',
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: 'مغلق',
      saturday: '10:00 AM - 4:00 PM',
    },
    categories: ['خرسانة ومواد بناء', 'عزل وحماية', 'مواد أساسية'],
    specialties: ['الخرسانة الجاهزة', 'مواد العزل', 'المواد الأساسية للبناء'],
    features: [
      'توصيل مجاني للطلبات أكثر من 1000 ريال',
      'ضمان الجودة والمطابقة للمواصفات',
      'خدمة عملاء 24/7',
      'دفع آمن ومتعدد الطرق',
    ],
    paymentMethods: ['كاش', 'فيزا', 'ماستركارد', 'STC Pay', 'البنك الأهلي'],
    deliveryAreas: ['الرياض', 'الدمام', 'جدة', 'المدينة المنورة'],
    rating: 4.8,
    reviewsCount: 245,
    productCount: 156,
    isVerified: true,
    isActive: true,
    joinedDate: new Date('2020-03-15'),
    lastActive: new Date('2024-08-05'),
    badges: ['متجر موثق', 'خدمة ممتازة', 'سرعة في التسليم'],
    socialMedia: {
      twitter: '@modern_construction',
      instagram: '@modern_construction_sa',
      linkedin: 'modern-construction-sa',
    },
    ownerId: 'owner-1',
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2024-08-05'),
  },
  {
    id: 'store-2',
    name: 'شركة الحديد المتين',
    description: 'شركة رائدة في توريد الحديد والصلب عالي الجودة. نوفر جميع أنواع الحديد المطابق للمواصفات السعودية والدولية.',
    logo: '/api/placeholder/150/150',
    coverImage: '/api/placeholder/1200/400',
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#fef2f2',
      fontFamily: 'Cairo',
    },
    contactInfo: {
      email: 'sales@steel-strong.com',
      phone: '+966 50 987 6543',
      whatsapp: '+966 50 987 6543',
      address: 'المنطقة الصناعية الثانية، الدمام 31421، المملكة العربية السعودية',
      location: {
        lat: 26.4207,
        lng: 50.0888,
      },
    },
    businessHours: {
      sunday: '7:00 AM - 5:00 PM',
      monday: '7:00 AM - 5:00 PM',
      tuesday: '7:00 AM - 5:00 PM',
      wednesday: '7:00 AM - 5:00 PM',
      thursday: '7:00 AM - 5:00 PM',
      friday: 'مغلق',
      saturday: '9:00 AM - 3:00 PM',
    },
    categories: ['حديد وصلب', 'مواد معدنية'],
    specialties: ['حديد التسليح', 'الصلب الإنشائي', 'المعادن المختلفة'],
    features: [
      'جودة مضمونة 100%',
      'مطابقة للمواصفات السعودية SASO',
      'توصيل سريع لجميع المناطق',
      'أسعار تنافسية بالجملة',
    ],
    paymentMethods: ['كاش', 'فيزا', 'ماستركارد', 'تحويل بنكي'],
    deliveryAreas: ['الدمام', 'الخبر', 'الجبيل', 'الرياض', 'جدة'],
    rating: 4.9,
    reviewsCount: 189,
    productCount: 89,
    isVerified: true,
    isActive: true,
    joinedDate: new Date('2019-08-20'),
    lastActive: new Date('2024-08-05'),
    badges: ['متجر موثق', 'أفضل جودة', 'توصيل سريع'],
    socialMedia: {
      twitter: '@steel_strong_sa',
      instagram: '@steel_strong',
    },
    ownerId: 'owner-2',
    createdAt: new Date('2019-08-20'),
    updatedAt: new Date('2024-08-04'),
  },
  {
    id: 'store-3',
    name: 'معرض الرخام الملكي',
    description: 'معرض متخصص في الرخام والجرانيت الطبيعي المستورد من أفضل المحاجر العالمية. نوفر تشكيلة واسعة من الرخام الفاخر.',
    logo: '/api/placeholder/150/150',
    coverImage: '/api/placeholder/1200/400',
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#f3f4f6',
      fontFamily: 'Cairo',
    },
    contactInfo: {
      email: 'info@royal-marble.com',
      phone: '+966 50 555 7777',
      whatsapp: '+966 50 555 7777',
      address: 'شارع التخصصي، الرياض 11564، المملكة العربية السعودية',
      location: {
        lat: 24.7136,
        lng: 46.6753,
      },
    },
    businessHours: {
      sunday: '9:00 AM - 9:00 PM',
      monday: '9:00 AM - 9:00 PM',
      tuesday: '9:00 AM - 9:00 PM',
      wednesday: '9:00 AM - 9:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '2:00 PM - 9:00 PM',
      saturday: '9:00 AM - 9:00 PM',
    },
    categories: ['أرضيات وتبليط', 'رخام وجرانيت'],
    specialties: ['الرخام الإيطالي', 'الجرانيت التركي', 'الحجر الطبيعي'],
    features: [
      'رخام مستورد من أفضل المحاجر',
      'تقطيع وتشكيل حسب الطلب',
      'استشارة مجانية في التصميم',
      'ضمان التركيب والجودة',
    ],
    paymentMethods: ['كاش', 'فيزا', 'ماستركارد', 'تقسيط بدون فوائد'],
    deliveryAreas: ['الرياض', 'الخرج', 'المزاحمية'],
    rating: 4.7,
    reviewsCount: 156,
    productCount: 234,
    isVerified: true,
    isActive: true,
    joinedDate: new Date('2021-01-10'),
    lastActive: new Date('2024-08-05'),
    badges: ['متجر موثق', 'تصميم مميز', 'رخام فاخر'],
    socialMedia: {
      instagram: '@royal_marble_sa',
      linkedin: 'royal-marble',
    },
    ownerId: 'owner-3',
    createdAt: new Date('2021-01-10'),
    updatedAt: new Date('2024-08-05'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredStores = [...mockStores];

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(searchLower) ||
        store.description.toLowerCase().includes(searchLower) ||
        store.categories.some(cat => cat.toLowerCase().includes(searchLower)) ||
        store.specialties.some(spec => spec.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category) {
      filteredStores = filteredStores.filter(store => 
        store.categories.includes(category) ||
        store.specialties.some(spec => spec.toLowerCase().includes(category.toLowerCase()))
      );
    }

    // Apply pagination
    const total = filteredStores.length;
    const paginatedStores = filteredStores.slice(offset, offset + limit);

    return NextResponse.json({
      stores: paginatedStores,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      success: true,
    });

  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'فشل في جلب المتاجر',
        success: false,
      },
      { status: 500 }
    );
  }
}



