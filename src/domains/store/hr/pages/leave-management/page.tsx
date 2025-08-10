'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  User,
  Plus,
  Download,
  Filter,
  Search,
  Info,
  CalendarDays,
  FileText
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function LeaveManagementPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Leave data will be loaded from Supabase
  const leaveStats = {
    totalRequests: 28,
    pendingRequests: 8,
    approvedRequests: 18,
    rejectedRequests: 2,
    totalLeaveDays: 156,
    averageLeaveDays: 5.6
  };

  const leaveRequests = [
    {
      id: 1,
      employeeName: 'أحمد محمد',
      leaveType: 'إجازة سنوية',
      startDate: '2025-02-01',
      endDate: '2025-02-05',
      days: 5,
      status: 'معلق',
      reason: 'سفر عائلي',
      submittedDate: '2025-01-25'
    },
    {
      id: 2,
      employeeName: 'فاطمة علي',
      leaveType: 'إجازة مرضية',
      startDate: '2025-01-26',
      endDate: '2025-01-27',
      days: 2,
      status: 'موافق',
      reason: 'إجازة مرضية',
      submittedDate: '2025-01-24'
    },
    {
      id: 3,
      employeeName: 'محمد حسن',
      leaveType: 'إجازة طارئة',
      startDate: '2025-01-23',
      endDate: '2025-01-23',
      days: 1,
      status: 'مرفوض',
      reason: 'ظروف شخصية',
      submittedDate: '2025-01-22'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة الإجازات والعطل</h1>
              <p className="text-blue-100 text-lg">نظام شامل لإدارة طلبات الإجازات والموافقات</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقرير
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                طلب إجازة جديد
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-purple-700">البحث عن معلومات العملاء والمشاريع</CardTitle>
              <p className="text-sm text-purple-600 mt-1">
                يمكن للمتاجر رؤية معلومات المشاريع لتحديد أو تعريف المشروع للتسليم
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CustomerSearchWidget
            onCustomerSelect={(customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name} للإجازات`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{leaveStats.totalRequests}</span>
                <p className="text-xs text-blue-600 mt-1">طلب</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">في الانتظار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-800">{leaveStats.pendingRequests}</span>
                <p className="text-xs text-yellow-600 mt-1">معلق</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">موافق عليها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{leaveStats.approvedRequests}</span>
                <p className="text-xs text-green-600 mt-1">طلب</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-700">مرفوضة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-red-800">{leaveStats.rejectedRequests}</span>
                <p className="text-xs text-red-600 mt-1">مرفوض</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">إجمالي أيام الإجازة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{leaveStats.totalLeaveDays}</span>
                <p className="text-xs text-purple-600 mt-1">يوم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-700">متوسط أيام الإجازة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-indigo-800">{leaveStats.averageLeaveDays}</span>
                <p className="text-xs text-indigo-600 mt-1">يوم</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>طلبات الإجازات</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في طلبات الإجازات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{request.employeeName}</div>
                    <div className="text-sm text-gray-600">{request.leaveType}</div>
                    <div className="text-xs text-gray-500 mt-1">{request.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">من</div>
                    <div className="text-sm text-gray-600">{request.startDate}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">إلى</div>
                    <div className="text-sm text-gray-600">{request.endDate}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">الأيام</div>
                    <div className="text-sm text-gray-600">{request.days} يوم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">تاريخ الطلب</div>
                    <div className="text-sm text-gray-600">{request.submittedDate}</div>
                  </div>
                  <Badge 
                    variant={
                      request.status === 'موافق' ? 'default' : 
                      request.status === 'معلق' ? 'secondary' : 'destructive'
                    }
                  >
                    {request.status}
                  </Badge>
                  {request.status === 'معلق' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                        موافقة
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                        رفض
                      </Button>
                    </div>
                  )}
                  <Button size="sm" variant="outline">
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




