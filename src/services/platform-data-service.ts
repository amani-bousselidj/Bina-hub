// Local Notification interface
type Notification = {
  id?: string;
  userId: string;
  userType: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  isRead?: boolean;
  createdAt?: Date;
};

// ApiResponse supports data or error
interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Unified data service for real platform connections
import { 
  Product, Order, WarrantyClaim, ServiceBooking,
  StoreDashboardData, UserDashboardData, ServiceProviderDashboardData, AdminDashboardData
} from '@/core/shared/types/platform-types';

class PlatformDataService {
  private baseUrl = '/api/platform';

  // =====================
  // PRODUCT MANAGEMENT
  // =====================
  
  async createProduct(storeId: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, ...productData })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to create product' };
    }
  }

  async getProducts(filters?: { category?: string; storeId?: string; search?: string }): Promise<ApiResponse<Product[]>> {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`${this.baseUrl}/products?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch products' };
    }
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to update product' };
    }
  }

  // =====================
  // ORDER MANAGEMENT
  // =====================

  async createOrder(userId: string, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...orderData })
      });
      const result = await response.json();
      
      // Create notifications for all parties
      if (result.success) {
        await this.createNotification({
          userId: orderData.storeId!,
          userType: 'store',
          title: 'طلبية جديدة',
          message: `طلبية جديدة من ${orderData.userName}`,
          type: 'order',
          relatedId: result.data.id
        });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to create order' };
    }
  }

  async getOrders(filters?: { userId?: string; storeId?: string; status?: string }): Promise<ApiResponse<Order[]>> {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`${this.baseUrl}/orders?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch orders' };
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status'], updatedBy: string): Promise<ApiResponse<Order>> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, updatedBy })
      });
      const result = await response.json();

      // Create notifications for status updates
      if (result.success) {
        const order = result.data;
        await this.createNotification({
          userId: order.userId,
          userType: 'user',
          title: 'تحديث حالة الطلبية',
          message: `تم تحديث حالة طلبيتك إلى: ${this.getStatusText(status)}`,
          type: 'order',
          relatedId: orderId
        });
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to update order status' };
    }
  }

  // =====================
  // WARRANTY CLAIMS
  // =====================

  async createWarrantyClaim(claimData: Partial<WarrantyClaim>): Promise<ApiResponse<WarrantyClaim>> {
    try {
      const response = await fetch(`${this.baseUrl}/warranty-claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      });
      const result = await response.json();

      // Notify store and admin
      if (result.success) {
        await Promise.all([
          this.createNotification({
            userId: claimData.storeId!,
            userType: 'store',
            title: 'مطالبة ضمان جديدة',
            message: `مطالبة ضمان جديدة للمنتج: ${claimData.productName}`,
            type: 'warranty',
            relatedId: result.data.id
          }),
          this.createNotification({
            userId: 'admin',
            userType: 'admin',
            title: 'مطالبة ضمان جديدة',
            message: `مطالبة ضمان جديدة تتطلب المراجعة`,
            type: 'warranty',
            relatedId: result.data.id
          })
        ]);
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to create warranty claim' };
    }
  }

  async getWarrantyClaims(filters?: { userId?: string; storeId?: string; status?: string }): Promise<ApiResponse<WarrantyClaim[]>> {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`${this.baseUrl}/warranty-claims?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch warranty claims' };
    }
  }

  async updateWarrantyClaimStatus(claimId: string, status: WarrantyClaim['status'], notes?: string): Promise<ApiResponse<WarrantyClaim>> {
    try {
      const response = await fetch(`${this.baseUrl}/warranty-claims/${claimId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to update warranty claim' };
    }
  }

  // =====================
  // SERVICE BOOKINGS
  // =====================

  async createServiceBooking(bookingData: Partial<ServiceBooking>): Promise<ApiResponse<ServiceBooking>> {
    try {
      const response = await fetch(`${this.baseUrl}/service-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const result = await response.json();

      // Notify service provider
      if (result.success) {
        await this.createNotification({
          userId: bookingData.serviceProviderId!,
          userType: 'service_provider',
          title: 'طلب خدمة جديد',
          message: `طلب خدمة جديد من ${bookingData.userName}`,
          type: 'booking',
          relatedId: result.data.id
        });
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Failed to create service booking' };
    }
  }

  async getServiceBookings(filters?: { userId?: string; serviceProviderId?: string; status?: string }): Promise<ApiResponse<ServiceBooking[]>> {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`${this.baseUrl}/service-bookings?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch service bookings' };
    }
  }

  async updateBookingStatus(bookingId: string, status: string, notes?: string): Promise<ApiResponse<ServiceBooking>> {
    try {
      const response = await fetch(`${this.baseUrl}/service-bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to update booking status' };
    }
  }

  // =====================
  // DASHBOARD DATA
  // =====================

  async getStoreDashboard(storeId: string): Promise<ApiResponse<StoreDashboardData>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/store/${storeId}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch store dashboard data' };
    }
  }

  async getUserDashboard(userId: string): Promise<ApiResponse<UserDashboardData>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/user/${userId}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch user dashboard data' };
    }
  }

  async getServiceProviderDashboard(providerId: string): Promise<ApiResponse<ServiceProviderDashboardData>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/service-provider/${providerId}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch service provider dashboard data' };
    }
  }

  async getAdminDashboard(): Promise<ApiResponse<AdminDashboardData>> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/admin`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch admin dashboard data' };
    }
  }

  // =====================
  // NOTIFICATIONS
  // =====================

  async createNotification(notificationData: Partial<Notification>): Promise<ApiResponse<Notification>> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notificationData,
          isRead: false,
          createdAt: new Date()
        })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to create notification' };
    }
  }

  async getNotifications(userId: string, userType: string): Promise<ApiResponse<Notification[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications?userId=${userId}&userType=${userType}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch notifications' };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to mark notification as read' };
    }
  }

  // =====================
  // UTILITY METHODS
  // =====================

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'قيد الانتظار',
      'confirmed': 'مؤكد',
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن',
      'delivered': 'تم التسليم',
      'cancelled': 'ملغي',
      'completed': 'مكتمل'
    };
    return statusMap[status] || status;
  }

  // Calendar availability for service providers
  async getProviderAvailability(providerId: string, date: string): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/service-providers/${providerId}/availability?date=${date}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to fetch provider availability' };
    }
  }

  // Search functionality
  async searchProducts(query: string, filters?: any): Promise<ApiResponse<Product[]>> {
    try {
      const params = new URLSearchParams({ q: query, ...filters });
      const response = await fetch(`${this.baseUrl}/search/products?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to search products' };
    }
  }

  async searchServiceProviders(serviceType: string, location?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams({ serviceType, location: location || '' });
      const response = await fetch(`${this.baseUrl}/search/service-providers?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to search service providers' };
    }
  }
}

export const platformDataService = new PlatformDataService();
export default platformDataService;



