// API route for service bookings
import { NextRequest, NextResponse } from 'next/server';
import { ServiceBooking } from '@/core/shared/types/platform-types';

// In-memory storage for demo (replace with real database)
let serviceBookings: ServiceBooking[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'أحمد محمد',
    userEmail: 'user@binna.com',
    userPhone: '+966501234567',
    serviceProviderId: 'provider1',
    serviceProviderName: 'شركة البناء المتطور',
    serviceType: 'concrete_supply',
    serviceDetails: {
      title: 'توريد خرسانة جاهزة',
      description: 'توريد 50 متر مكعب خرسانة C30',
      requirements: ['موقع البناء جاهز', 'فريق العمل متوفر'],
      estimatedDuration: '4 ساعات',
      estimatedCost: 12500
    },
    scheduledDate: '2025-02-01',
    scheduledTime: '08:00',
    location: {
      address: 'شارع الملك عبدالعزيز، حي الملز',
      city: 'الرياض',
      district: 'الملز',
      coordinates: { lat: 24.7136, lng: 46.6753 }
    },
    status: 'confirmed',
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-25'),
    providerNotes: 'سيتم التواصل قبل الموعد بـ 24 ساعة'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const serviceProviderId = searchParams.get('serviceProviderId');
    const status = searchParams.get('status');

    let filteredBookings = [...serviceBookings];

    if (userId) {
      filteredBookings = filteredBookings.filter(b => b.userId === userId);
    }

    if (serviceProviderId) {
      filteredBookings = filteredBookings.filter(b => b.serviceProviderId === serviceProviderId);
    }

    if (status) {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredBookings
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch service bookings'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    const newBooking: ServiceBooking = {
      id: Date.now().toString(),
      status: 'requested',
      createdAt: new Date(),
      updatedAt: new Date(),
      scheduledDate: new Date(bookingData.scheduledDate),
      ...bookingData
    };

    serviceBookings.push(newBooking);

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Service booking created successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create service booking'
    }, { status: 500 });
  }
}




