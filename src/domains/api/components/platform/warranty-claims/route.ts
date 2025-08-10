// API route for warranty claims
import { NextRequest, NextResponse } from 'next/server';
import { WarrantyClaim } from '@/core/shared/types/platform-types';

// In-memory storage for demo (replace with real database)
let warrantyClaims: WarrantyClaim[] = [
  {
    id: '1',
    orderId: '1',
    productId: '1',
    productName: 'خرسانة عالية الجودة',
    userId: 'user1',
    userName: 'أحمد محمد',
    storeId: 'store1',
    storeName: 'متجر بِنّا للمواد',
    description: 'ظهور تشققات في الخرسانة بعد أسبوع من الصب',
    issueType: 'defect',
    images: ['/warranty/crack1.jpg'],
    status: 'under_review',
    submittedAt: new Date('2025-01-20'),
    adminNotes: 'تتطلب فحص فني'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const storeId = searchParams.get('storeId');
    const status = searchParams.get('status');

    let filteredClaims = [...warrantyClaims];

    if (userId) {
      filteredClaims = filteredClaims.filter(c => c.userId === userId);
    }

    if (storeId) {
      filteredClaims = filteredClaims.filter(c => c.storeId === storeId);
    }

    if (status) {
      filteredClaims = filteredClaims.filter(c => c.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredClaims
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch warranty claims'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const claimData = await request.json();
    
    const newClaim: WarrantyClaim = {
      id: Date.now().toString(),
      status: 'submitted',
      submittedAt: new Date(),
      images: claimData.images || [],
      ...claimData
    };

    warrantyClaims.push(newClaim);

    return NextResponse.json({
      success: true,
      data: newClaim,
      message: 'Warranty claim submitted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create warranty claim'
    }, { status: 500 });
  }
}



