'use client';

export const dynamic = 'force-dynamic';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Plus, 
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  FileText,
  TrendingUp
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
  bankAccount: string;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  basicSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  payDate?: string;
}

export default function PayrollManagementPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);;

  const [payrollRecords] = useState<PayrollRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'أحمد محمد العلي',
      month: 'يناير',
      year: '2025',
      basicSalary: 15000,
      allowances: 2000,
      overtime: 500,
      deductions: 500,
      netSalary: 17000,
      status: 'paid',
      payDate: '2025-01-31'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'سارة أحمد الخالدي',
      month: 'يناير',
      year: '2025',
      basicSalary: 12000,
      allowances: 1500,
      overtime: 200,
      deductions: 400,
      netSalary: 13300,
      status: 'paid',
      payDate: '2025-01-31'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'محمد علي السالم',
      month: 'يناير',
      year: '2025',
      basicSalary: 8000,
      allowances: 1000,
      overtime: 0,
      deductions: 800,
      netSalary: 8200,
      status: 'approved'
    }
  ]);

  const [selectedMonth, setSelectedMonth] = useState('يناير');
  const [selectedYear, setSelectedYear] = useState('2025');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'on_leave': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'paid': return 'مدفوع';
      case 'approved': return 'معتمد';
      case 'draft': return 'مسودة';
      case 'inactive': return 'غير نشط';
      case 'on_leave': return 'في إجازة';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'approved':
        return <Upload className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'on_leave':
        return <Clock className="h-4 w-4" />;
      case 'inactive':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalPayroll = payrollRecords
    .filter(record => record.month === selectedMonth && record.year === selectedYear)
    .reduce((sum, record) => sum + record.netSalary, 0);
  const paidPayroll = payrollRecords
    .filter(record => record.month === selectedMonth && record.year === selectedYear && record.status === 'paid')
    .reduce((sum, record) => sum + record.netSalary, 0);

  // Fetch employees from Supabase
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching employees:', error);
        return;
      }
      
      if (data) {
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">نظام إدارة الرواتب المتقدم</h1>
              <p className="text-blue-100 text-lg">إدارة شاملة لرواتب الموظفين والحسابات الشهرية</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير البيانات
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                موظف جديد
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <span className="text-2xl font-bold text-blue-800">{totalEmployees}</span>
                <p className="text-xs text-blue-600 mt-1">موظف مسجل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">الموظفون النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{activeEmployees}</span>
                <p className="text-xs text-green-600 mt-1">موظف نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">إجمالي الرواتب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">
                  {totalPayroll.toLocaleString()} ريال
                </span>
                <p className="text-xs text-purple-600 mt-1">{selectedMonth} {selectedYear}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-700">المدفوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-800">
                  {paidPayroll.toLocaleString()} ريال
                </span>
                <p className="text-xs text-emerald-600 mt-1">تم الدفع</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>قائمة الموظفين</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث..."
                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.map((employee) => (
                <div key={employee.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{employee.name}</h3>
                          <p className="text-sm text-gray-600">{employee.position} - {employee.department}</p>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">الراتب الأساسي:</span>
                          <span className="font-medium"> {employee.basicSalary.toLocaleString()} ريال</span>
                        </div>
                        <div>
                          <span className="text-gray-600">الراتب الصافي:</span>
                          <span className="font-medium text-green-600"> {employee.netSalary.toLocaleString()} ريال</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        {getStatusText(employee.status)}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ملخص الرواتب الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="يناير">يناير</option>
                  <option value="فبراير">فبراير</option>
                  <option value="مارس">مارس</option>
                  <option value="أبريل">أبريل</option>
                  <option value="مايو">مايو</option>
                  <option value="يونيو">يونيو</option>
                </select>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-900 font-medium">إجمالي الرواتب الأساسية</span>
                  <span className="text-blue-600 font-bold">35,000 ريال</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-900 font-medium">إجمالي البدلات</span>
                  <span className="text-green-600 font-bold">4,500 ريال</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-900 font-medium">الساعات الإضافية</span>
                  <span className="text-orange-600 font-bold">700 ريال</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-900 font-medium">إجمالي الاستقطاعات</span>
                  <span className="text-red-600 font-bold">1,700 ريال</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <span className="text-purple-900 font-bold">صافي الرواتب</span>
                  <span className="text-purple-600 font-bold text-xl">38,500 ريال</span>
                </div>
              </div>

              <Button className="w-full mt-4">
                <CreditCard className="h-4 w-4 mr-2" />
                دفع الرواتب
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>سجل الرواتب - {selectedMonth} {selectedYear}</CardTitle>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الموظف</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الراتب الأساسي</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">البدلات</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الساعات الإضافية</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الاستقطاعات</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الراتب الصافي</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {payrollRecords
                  .filter(record => record.month === selectedMonth && record.year === selectedYear)
                  .map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{record.employeeName}</p>
                        <p className="text-sm text-gray-600">{record.month} {record.year}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{record.basicSalary.toLocaleString()} ريال</td>
                    <td className="py-3 px-4 text-green-600">{record.allowances.toLocaleString()} ريال</td>
                    <td className="py-3 px-4 text-orange-600">{record.overtime.toLocaleString()} ريال</td>
                    <td className="py-3 px-4 text-red-600">{record.deductions.toLocaleString()} ريال</td>
                    <td className="py-3 px-4 font-bold text-purple-600">{record.netSalary.toLocaleString()} ريال</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {record.status === 'draft' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {record.status === 'approved' && (
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إضافة موظف جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الموظف</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل اسم الموظف"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموظف</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="EMP004"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنصب</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="المنصب الوظيفي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>اختر القسم</option>
                  <option>المبيعات</option>
                  <option>المالية</option>
                  <option>التقنية</option>
                  <option>الموارد البشرية</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الراتب الأساسي (ريال)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ التوظيف</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الحساب البنكي</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SA1234567890123456789"
              />
            </div>

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              إضافة الموظف
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الإحصائيات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-blue-900 font-medium">متوسط الراتب</p>
                  <p className="text-2xl font-bold text-blue-600">12,833 ريال</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-green-900 font-medium">أعلى راتب</p>
                  <p className="text-2xl font-bold text-green-600">17,000 ريال</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-purple-900 font-medium">إجمالي البدلات</p>
                  <p className="text-2xl font-bold text-purple-600">4,500 ريال</p>
                </div>
                <Plus className="h-8 w-8 text-purple-600" />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">توزيع الموظفين حسب القسم</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المبيعات</span>
                    <span className="font-medium">1 موظف</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المالية</span>
                    <span className="font-medium">1 موظف</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">التقنية</span>
                    <span className="font-medium">1 موظف</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



