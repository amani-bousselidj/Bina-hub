// API route for admin dashboard data
import { NextRequest, NextResponse } from 'next/server';
import { AdminDashboardData } from '@/core/shared/types/platform-types';

export async function GET(request: NextRequest) {
  try {
    // Fetch data from all endpoints
    const [productsRes, ordersRes, warrantyRes, bookingsRes] = await Promise.all([
      fetch(`${request.nextUrl.origin}/api/platform/products`),
      fetch(`${request.nextUrl.origin}/api/platform/orders`),
      fetch(`${request.nextUrl.origin}/api/platform/warranty-claims`),
      fetch(`${request.nextUrl.origin}/api/platform/service-bookings`)
    ]);

    const products = (await productsRes.json()).data || [];
    const orders = (await ordersRes.json()).data || [];
    const warrantyClaims = (await warrantyRes.json()).data || [];
    const serviceBookings = (await bookingsRes.json()).data || [];

    // Calculate platform-wide statistics
    const totalRevenue = orders
      .filter((o: any) => o.paymentStatus === 'paid')
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const serviceRevenue = serviceBookings
      .filter((b: any) => b.status === 'completed')
      .reduce((sum: number, b: any) => sum + (b.serviceDetails.estimatedCost || 0), 0);

    const platformRevenue = totalRevenue + serviceRevenue;

    // Get unique users, stores, and service providers
    const uniqueUsers = new Set([
      ...orders.map((o: any) => o.userId),
      ...warrantyClaims.map((w: any) => w.userId),
      ...serviceBookings.map((b: any) => b.userId)
    ]).size;

    const uniqueStores = new Set([
      ...products.map((p: any) => p.storeId),
      ...orders.map((o: any) => o.storeId)
    ]).size;

    const uniqueServiceProviders = new Set(
      serviceBookings.map((b: any) => b.serviceProviderId)
    ).size;

    // Calculate monthly growth
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthRevenue = orders
      .filter((o: any) => 
        o.paymentStatus === 'paid' && 
        new Date(o.createdAt).getMonth() === currentMonth
      )
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const lastMonthRevenue = orders
      .filter((o: any) => 
        o.paymentStatus === 'paid' && 
        new Date(o.createdAt).getMonth() === lastMonth
      )
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Top categories
    const categoryCount: Record<string, number> = {};
    products.forEach((p: any) => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const dashboardData: AdminDashboardData = {
      users: { 
        total: uniqueUsers, 
        active: uniqueUsers, // For demo, assume all are active
        new: Math.floor(uniqueUsers * 0.1) // 10% as new users
      },
      stores: { 
        total: uniqueStores, 
        active: uniqueStores,
        new: Math.floor(uniqueStores * 0.05) // 5% as new stores
      },
      serviceProviders: { 
        total: uniqueServiceProviders, 
        active: uniqueServiceProviders,
        new: Math.floor(uniqueServiceProviders * 0.08) // 8% as new providers
      },
      orders: { 
        total: orders.length, 
        pending: orders.filter((o: any) => o.status === 'pending').length,
        completed: orders.filter((o: any) => o.status === 'delivered').length
      },
      warrantyClaims: { 
        total: warrantyClaims.length, 
        pending: warrantyClaims.filter((w: any) => w.status === 'submitted').length,
        resolved: warrantyClaims.filter((w: any) => w.status === 'resolved').length
      },
      serviceBookings: { 
        total: serviceBookings.length, 
        pending: serviceBookings.filter((b: any) => b.status === 'requested').length,
        completed: serviceBookings.filter((b: any) => b.status === 'completed').length
      },
      platformStats: {
        totalRevenue: platformRevenue,
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
        activeUsers: uniqueUsers,
        topCategories
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admin dashboard data'
    }, { status: 500 });
  }
}



