// API route for orders management
import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/core/shared/types/platform-types';

// In-memory storage for demo (replace with real database)
let orders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'أحمد محمد',
    userEmail: 'user@binna.com',
    storeId: 'store1',
    storeName: 'متجر بِنّا للمواد',
    products: [
      {
        productId: '1',
        productName: 'خرسانة عالية الجودة',
        quantity: 10,
        unitPrice: 250,
        totalPrice: 2500
      }
    ],
    items: [
      {
        id: '1',
        name: 'خرسانة عالية الجودة',
        quantity: 10,
        price: 250
      }
    ],
    total_amount: 2500,
    status: 'confirmed',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'شارع الملك فهد',
      city: 'الرياض',
      district: 'النرجس',
      postalCode: '12345',
      phone: '+966501234567'
    },
    createdAt: new Date('2025-01-15T10:00:00Z'),
    updatedAt: new Date('2025-01-15T10:00:00Z')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const storeId = searchParams.get('storeId');
    const status = searchParams.get('status');

    let filteredOrders = [...orders];

    if (userId) {
      filteredOrders = filteredOrders.filter(o => o.userId === userId);
    }

    if (storeId) {
      filteredOrders = filteredOrders.filter(o => o.storeId === storeId);
    }

    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredOrders
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    };

    orders.push(newOrder);

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create order'
    }, { status: 500 });
  }
}




