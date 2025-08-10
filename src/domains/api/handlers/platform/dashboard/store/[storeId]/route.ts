// API route for store dashboard data
import { NextRequest, NextResponse } from 'next/server';
import { StoreDashboardData } from '@/core/shared/types/platform-types';

export async function GET(request: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const storeId = params.storeId;

    // Fetch data from other API endpoints (in real app, from database)
    const [productsRes, ordersRes, warrantyRes] = await Promise.all([
      fetch(`${request.nextUrl.origin}/api/platform/products?storeId=${storeId}`),
      fetch(`${request.nextUrl.origin}/api/platform/orders?storeId=${storeId}`),
      fetch(`${request.nextUrl.origin}/api/platform/warranty-claims?storeId=${storeId}`)
    ]);

    const products = (await productsRes.json()).data || [];
    const orders = (await ordersRes.json()).data || [];
    const warrantyClaims = (await warrantyRes.json()).data || [];

    // Calculate analytics
    const totalRevenue = orders
      .filter((o: any) => o.status === 'delivered')
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const currentMonth = new Date().getMonth();
    const monthlyOrders = orders.filter((o: any) => 
      new Date(o.createdAt).getMonth() === currentMonth
    );

    const monthlyRevenue = monthlyOrders
      .filter((o: any) => o.status === 'delivered')
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

    const dashboardData: StoreDashboardData = {
      products,
      orders,
      warrantyClaims,
      analytics: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingWarranties: warrantyClaims.filter((w: any) => w.status === 'submitted').length,
        monthlyStats: {
          orders: monthlyOrders.length,
          revenue: monthlyRevenue,
          newCustomers: new Set(monthlyOrders.map((o: any) => o.userId)).size
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch store dashboard data'
    }, { status: 500 });
  }
}

