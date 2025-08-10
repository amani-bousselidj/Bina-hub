import { NextRequest, NextResponse } from 'next/server';

interface Params {
  storeId: string;
}

// Mock data for individual store details (using the same stores from stores/route.ts)
const mockStores = {
  'store-1': {
    id: 'store-1',
    name: 'متجر مواد البناء الحديث',
    description: 'متخصصون في مواد البناء والخرسانة عالية الجودة منذ 1995. نوفر أفضل المنتجات بأسعار تنافسية مع خدمة عملاء متميزة.',
    longDescription: `
      متجر مواد البناء الحديث هو واحد من أعرق المتاجر في المملكة العربية السعودية، حيث نخدم قطاع البناء والتشييد منذ أكثر من 25 عاماً.
      
      نقدم مجموعة شاملة من مواد البناء عالية الجودة بما في ذلك:
      • الخرسانة الجاهزة بجميع أنواعها
      • مواد العزل المائي والحراري
      • المواد الأساسية للبناء والتشييد
      
      رؤيتنا:
      أن نكون الخيار الأول لمقاولي البناء في المملكة من خلال تقديم منتجات عالية الجودة وخدمة عملاء استثنائية.
      
      مهمتنا:
      توفير مواد بناء عالية الجودة بأسعار تنافسية مع ضمان سرعة التسليم والمطابقة للمواصفات السعودية والدولية.
    `,
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
      website: 'https://modern-construction.com',
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
      'استشارة هندسية مجانية',
      'خدمة ما بعد البيع',
    ],
    certifications: [
      'شهادة الأيزو 9001:2015',
      'شهادة المطابقة SASO',
      'عضوية غرفة التجارة الرياض',
      'ترخيص وزارة التجارة',
    ],
    paymentMethods: ['كاش', 'فيزا', 'ماستركارد', 'STC Pay', 'البنك الأهلي', 'تحويل بنكي'],
    deliveryAreas: ['الرياض', 'الدمام', 'جدة', 'المدينة المنورة', 'الطائف', 'الخبر'],
    deliveryFees: {
      'الرياض': 50,
      'باقي المناطق': 100,
      'مجاني': 'للطلبات أكثر من 1000 ريال',
    },
    rating: 4.8,
    reviewsCount: 245,
    productCount: 156,
    ordersCount: 1250,
    yearsInBusiness: 28,
    employees: 45,
    isVerified: true,
    isActive: true,
    isPremium: true,
    joinedDate: new Date('2020-03-15'),
    lastActive: new Date('2024-08-05'),
    badges: ['متجر موثق', 'خدمة ممتازة', 'سرعة في التسليم', 'جودة مضمونة'],
    awards: [
      'أفضل متجر مواد بناء 2023',
      'جائزة التميز في خدمة العملاء 2022',
      'شهادة الجودة الذهبية 2021',
    ],
    socialMedia: {
      twitter: '@modern_construction',
      instagram: '@modern_construction_sa',
      linkedin: 'modern-construction-sa',
      youtube: 'ModernConstructionSA',
    },
    team: [
      {
        name: 'أحمد المحمد',
        position: 'مدير المبيعات',
        phone: '+966 50 123 4567',
        email: 'ahmed@modern-construction.com',
      },
      {
        name: 'محمد العلي',
        position: 'مهندس استشاري',
        phone: '+966 50 123 4568',
        email: 'mohammed@modern-construction.com',
      },
    ],
    policies: {
      returnPolicy: 'إمكانية الإرجاع خلال 7 أيام من تاريخ الاستلام',
      warrantyPolicy: 'ضمان الجودة حسب نوع المنتج',
      shippingPolicy: 'التوصيل خلال 2-3 أيام عمل داخل الرياض',
      privacyPolicy: 'نحن نحترم خصوصية عملائنا ولا نشارك بياناتهم مع أطراف ثالثة',
    },
    announcement: 'عرض خاص: خصم 15% على جميع مواد الخرسانة حتى نهاية الشهر!',
    ownerId: 'owner-1',
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2024-08-05'),
  },
  // Add more stores as needed
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { storeId } = params;

    // Simulate database lookup
    await new Promise(resolve => setTimeout(resolve, 100));

    const store = mockStores[storeId as keyof typeof mockStores];

    if (!store) {
      return NextResponse.json(
        { 
          error: 'Store not found',
          message: 'المتجر غير موجود',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      store,
      success: true,
    });

  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'فشل في جلب بيانات المتجر',
        success: false,
      },
      { status: 500 }
    );
  }
}

