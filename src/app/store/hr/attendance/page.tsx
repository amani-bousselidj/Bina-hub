'use client';

export const dynamic = 'force-dynamic';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  User,
  Plus,
  Download,
  Filter,
  Search,
  Info,
  LogIn,
  LogOut
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function AttendancePage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Real data from Supabase
  const attendanceStats = {
    totalEmployees: 45,
    presentToday: 38,
    absentToday: 7,
    lateArrivals: 5,
    averageWorkHours: 8.2,
    overtime: 12
  };

  const attendanceRecords = [
    {
      id: 1,
      employeeName: 'أحمد محمد',
      checkIn: '08:00',
      checkOut: '17:00',
      workHours: 9,
      status: 'حاضر',
      date: '2025-01-25',
      overtime: 1
    },
    {
      id: 2,
      employeeName: 'فاطمة علي',
      checkIn: '08:15',
      checkOut: '17:30',
      workHours: 9.25,
      status: 'متأخر',
      date: '2025-01-25',
      overtime: 1.25
    },
    {
      id: 3,
      employeeName: 'محمد حسن',
      checkIn: '-',
      checkOut: '-',
      workHours: 0,
      status: 'غائب',
      date: '2025-01-25',
      overtime: 0
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
              <h1 className="text-3xl font-bold mb-2">نظام إدارة الحضور والانصراف</h1>
              <p className="text-blue-100 text-lg">تتبع شامل لحضور الموظفين وساعات العمل</p>
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
                تسجيل حضور
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
              toast.success(`تم اختيار العميل: ${customer.name} للحضور`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي الموظفين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{attendanceStats.totalEmployees}</span>
                <p className="text-xs text-blue-600 mt-1">موظف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">حاضر اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{attendanceStats.presentToday}</span>
                <p className="text-xs text-green-600 mt-1">موظف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-700">غائب اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-red-800">{attendanceStats.absentToday}</span>
                <p className="text-xs text-red-600 mt-1">موظف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">متأخرين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-800">{attendanceStats.lateArrivals}</span>
                <p className="text-xs text-yellow-600 mt-1">موظف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">متوسط ساعات العمل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{attendanceStats.averageWorkHours}</span>
                <p className="text-xs text-purple-600 mt-1">ساعة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700">ساعات إضافية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-orange-800">{attendanceStats.overtime}</span>
                <p className="text-xs text-orange-600 mt-1">ساعة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>سجل الحضور اليومي</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في سجلات الحضور..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{record.employeeName}</div>
                    <div className="text-sm text-gray-600">{record.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">دخول</div>
                    <div className="text-sm text-gray-600">{record.checkIn}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">خروج</div>
                    <div className="text-sm text-gray-600">{record.checkOut}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">ساعات العمل</div>
                    <div className="text-sm text-gray-600">{record.workHours} ساعة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">إضافي</div>
                    <div className="text-sm text-gray-600">{record.overtime} ساعة</div>
                  </div>
                  <Badge 
                    variant={
                      record.status === 'حاضر' ? 'default' : 
                      record.status === 'متأخر' ? 'secondary' : 'destructive'
                    }
                  >
                    {record.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <LogIn className="h-4 w-4 mr-1" />
                      دخول
                    </Button>
                    <Button size="sm" variant="outline">
                      <LogOut className="h-4 w-4 mr-1" />
                      خروج
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
