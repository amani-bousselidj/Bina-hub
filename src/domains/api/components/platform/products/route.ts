// API route for products management
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/core/shared/types/platform-types';

// In-memory storage for demo (replace with real database)
let products: Product[] = [
  {
    id: '1',
    storeId: 'store1',
    storeName: 'متجر بِنّا للمواد',
    name: 'خرسانة عالية الجودة',
    description: 'خرسانة مسلحة عالية الجودة مناسبة لجميع أنواع البناء',
    price: 250,
    category: 'مواد البناء',
    images: ['/products/concrete1.jpg'],
    inStock: true,
    stockQuantity: 100,
    warrantyPeriod: "12",
    warranty: {
      duration: 12,
      type: "manufacturer"
    },
    specifications: {
      'نوع الخرسانة': 'C30',
      'المقاومة': '30 ميجا باسكال',
      'الاستخدام': 'البناء العام'
    },
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '2',
    storeId: 'store1',
    storeName: 'متجر بِنّا للمواد',
    name: 'حديد تسليح عالي الجودة',
    description: 'حديد تسليح مطابق للمواصفات السعودية',
    price: 3200,
    category: 'حديد التسليح',
    images: ['/products/rebar1.jpg'],
    inStock: true,
    stockQuantity: 50,
    warrantyPeriod: "24",
    warranty: {
      duration: 24,
      type: "manufacturer"
    },
    specifications: {
      'القطر': '12 مم',
      'الطول': '12 متر',
      'المعيار': 'SASO'
    },
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const storeId = searchParams.get('storeId');
    const search = searchParams.get('search');

    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (storeId) {
      filteredProducts = filteredProducts.filter(p => p.storeId === storeId);
    }

    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    const newProduct: Product = {
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      inStock: true,
      stockQuantity: productData.stockQuantity || 0,
      images: productData.images || [],
      specifications: productData.specifications || {},
      ...productData
    };

    products.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 });
  }
}



