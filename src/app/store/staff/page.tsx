'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  UserCheck,
  UserX,
  Settings,
  Download,
  Upload,
  Eye,
  Key,
  Award,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock staff data
  const staff = [
    {
      id: 1,
      name: 'أحمد محمد السعيد',
      email: 'ahmed.mohammed@store.com',
      phone: '+966 50 123 4567',
      role: 'admin',
      department: 'الإدارة',
      status: 'active',
      joinDate: '2023-01-15',
      lastLogin: '2025-01-30T09:30:00',
      avatar: '/avatars/ahmed.jpg',
      permissions: ['إدارة المنتجات', 'إدارة الطلبات', 'إدارة المستخدمين', 'التقارير'],
      salary: 8500,
      workSchedule: 'دوام كامل',
      emergencyContact: '+966 50 999 8888'
    },
    {
      id: 2,
      name: 'فاطمة علي الأحمد',
      email: 'fatima.ali@store.com',
      phone: '+966 55 234 5678',
      role: 'manager',
      department: 'المبيعات',
      status: 'active',
      joinDate: '2023-03-20',
      lastLogin: '2025-01-30T08:45:00',
      avatar: '/avatars/fatima.jpg',
      permissions: ['إدارة المنتجات', 'إدارة الطلبات', 'إدارة العملاء'],
      salary: 6500,
      workSchedule: 'دوام كامل',
      emergencyContact: '+966 50 777 6666'
    },
    {
      id: 3,
      name: 'خالد عبدالله النصر',
      email: 'khalid.nasr@store.com',
      phone: '+966 56 345 6789',
      role: 'employee',
      department: 'المستودعات',
      status: 'active',
      joinDate: '2023-06-10',
      lastLogin: '2025-01-29T16:20:00',
      avatar: '/avatars/khalid.jpg',
      permissions: ['إدارة المخزون', 'تتبع الشحنات'],
      salary: 4500,
      workSchedule: 'دوام كامل',
      emergencyContact: '+966 50 555 4444'
    },
    {
      id: 4,
      name: 'سارة محمد الزهراني',
      email: 'sara.zahrani@store.com',
      phone: '+966 54 456 7890',
      role: 'employee',
      department: 'خدمة العملاء',
      status: 'active',
      joinDate: '2023-08-15',
      lastLogin: '2025-01-30T10:15:00',
      avatar: '/avatars/sara.jpg',
      permissions: ['إدارة العملاء', 'الدردشة المباشرة'],
      salary: 4000,
      workSchedule: 'دوام جزئي',
      emergencyContact: '+966 50 333 2222'
    },
    {
      id: 5,
      name: 'محمد عبدالعزيز القحطاني',
      email: 'mohammed.qahtani@store.com',
      phone: '+966 53 567 8901',
      role: 'employee',
      department: 'التسويق',
      status: 'inactive',
      joinDate: '2023-04-01',
      lastLogin: '2025-01-25T14:30:00',
      avatar: '/avatars/mohammed.jpg',
      permissions: ['إدارة الحملات الإعلانية'],
      salary: 5000,
      workSchedule: 'دوام كامل',
      emergencyContact: '+966 50 111 9999'
    }
  ];

  const departments = [
    { name: 'الإدارة', count: 1, color: 'bg-purple-100 text-purple-800' },
    { name: 'المبيعات', count: 1, color: 'bg-blue-100 text-blue-800' },
    { name: 'المستودعات', count: 1, color: 'bg-green-100 text-green-800' },
    { name: 'خدمة العملاء', count: 1, color: 'bg-orange-100 text-orange-800' },
    { name: 'التسويق', count: 1, color: 'bg-pink-100 text-pink-800' }
  ];

  const roles = [
    { value: 'admin', label: 'مدير عام', color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: 'مدير قسم', color: 'bg-blue-100 text-blue-800' },
    { value: 'employee', label: 'موظف', color: 'bg-green-100 text-green-800' },
    { value: 'contractor', label: 'متعاقد', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'موقوف';
      case 'on_leave': return 'في إجازة';
      default: return status;
    }
  };

  const getRoleColor = (role: string) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800';
  };

  const getRoleText = (role: string) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesTab = activeTab === 'all' || member.status === activeTab;
    
    return matchesSearch && matchesRole && matchesTab;
  });

  const handleAddStaff = () => {
    toast.success('سيتم توجيهك لصفحة إضافة موظف جديد');
  };

  const handleEditStaff = (id: number) => {
    toast.success(`سيتم توجيهك لتعديل بيانات الموظف ${id}`);
  };

  const handleDeleteStaff = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      toast.success('تم حذف الموظف بنجاح');
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast.success(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} الموظف`);
  };

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    departments: departments.length,
    totalSalary: staff.filter(s => s.status === 'active').reduce((sum, s) => sum + s.salary, 0)
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الموظفين</h1>
          <p className="text-gray-600">إدارة فريق العمل والأذونات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button onClick={handleAddStaff}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة موظف
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الموظفين</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الموظفون النشطون</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الأقسام</p>
                <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الرواتب</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalSalary.toLocaleString()} ر.س</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الموظفين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="تصفية حسب المنصب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المناصب</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              مرشحات متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Departments Overview */}
      <Card>
        <CardHeader>
          <CardTitle>نظرة عامة على الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {departments.map((dept) => (
              <div key={dept.name} className="text-center p-4 border rounded-lg">
                <Building className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <h3 className="font-medium">{dept.name}</h3>
                <Badge className={dept.color}>
                  {dept.count} موظف
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">نشط ({stats.active})</TabsTrigger>
          <TabsTrigger value="inactive">غير نشط ({staff.filter(s => s.status === 'inactive').length})</TabsTrigger>
          <TabsTrigger value="on_leave">في إجازة (0)</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredStaff.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد موظفون</h3>
                <p className="text-gray-600 mb-4">لم يتم العثور على موظفين مطابقين للمعايير المحددة</p>
                <Button onClick={handleAddStaff}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة موظف جديد
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredStaff.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{member.name}</h3>
                          <p className="text-gray-600">{member.department}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className={getStatusColor(member.status)}>
                              {getStatusText(member.status)}
                            </Badge>
                            <Badge className={getRoleColor(member.role)}>
                              {getRoleText(member.role)}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {member.workSchedule}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStaff(member.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStaff(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{member.email}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{member.phone}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>انضم: {new Date(member.joinDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>آخر دخول: {new Date(member.lastLogin).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">الصلاحيات:</p>
                        <div className="flex flex-wrap gap-2">
                          {member.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline">
                              <Shield className="h-3 w-3 mr-1" />
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            الراتب: <span className="font-medium">{member.salary.toLocaleString()} ر.س</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            طوارئ: <span className="font-medium">{member.emergencyContact}</span>
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(member.id, member.status)}
                          >
                            {member.status === 'active' ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                إلغاء التفعيل
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                تفعيل
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4 mr-2" />
                            إعادة تعيين كلمة المرور
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              إضافة موظف
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              استيراد موظفين
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              إدارة الأذونات
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Award className="h-6 w-6 mb-2" />
              تقرير الرواتب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
