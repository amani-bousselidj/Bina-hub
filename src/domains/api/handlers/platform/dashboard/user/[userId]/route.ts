// API route for user dashboard data
import { NextRequest, NextResponse } from 'next/server';
import { UserDashboardData } from '@/core/shared/types/platform-types';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;

    // Fetch data from other API endpoints
    const [ordersRes, warrantyRes, bookingsRes] = await Promise.all([
      fetch(`${request.nextUrl.origin}/api/platform/orders?userId=${userId}`),
      fetch(`${request.nextUrl.origin}/api/platform/warranty-claims?userId=${userId}`),
      fetch(`${request.nextUrl.origin}/api/platform/service-bookings?userId=${userId}`)
    ]);

    const orders = (await ordersRes.json()).data || [];
    const warrantyClaims = (await warrantyRes.json()).data || [];
    const serviceBookings = (await bookingsRes.json()).data || [];

    // Calculate analytics
    const totalSpent = orders
      .filter((o: any) => o.paymentStatus === 'paid')
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const activeWarranties = warrantyClaims.filter((w: any) => 
      ['submitted', 'under_review', 'approved'].includes(w.status)
    ).length;

    const upcomingBookings = serviceBookings.filter((b: any) => 
      new Date(b.scheduledDate) > new Date() && b.status === 'confirmed'
    ).length;

    const dashboardData: UserDashboardData = {
      orders,
      warrantyClaims,
      serviceBookings,
      analytics: {
        totalOrders: orders.length,
        activeWarranties,
        upcomingBookings,
        totalSpent
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user dashboard data'
    }, { status: 500 });
  }
}

