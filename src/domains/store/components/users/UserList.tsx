'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Users, UserCheck, UserX, Shield, Mail, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'employee' | 'viewer';
  status: 'active' | 'inactive' | 'invited';
  phone?: string;
  last_login?: string;
  created_at: string;
  permissions: string[];
}

const []: User[] = [
  {
    id: 'user_001',
    email: 'admin@binna.com',
    first_name: 'أحمد',
    last_name: 'المدير',
    role: 'admin',
    status: 'active',
    phone: '+966501234567',
    last_login: '2024-01-15T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    permissions: ['all']
  },
  {
    id: 'user_002',
    email: 'manager@binna.com',
    first_name: 'سارة',
    last_name: 'المدير التنفيذي',
    role: 'manager',
    status: 'active',
    phone: '+966502345678',
    last_login: '2024-01-15T09:15:00Z',
    created_at: '2024-01-05T00:00:00Z',
    permissions: ['store.manage', 'products.manage', 'orders.view']
  },
  {
    id: 'user_003',
    email: 'employee@binna.com',
    first_name: 'محمد',
    last_name: 'الموظف',
    role: 'employee',
    status: 'active',
    phone: '+966503456789',
    last_login: '2024-01-14T16:45:00Z',
    created_at: '2024-01-10T00:00:00Z',
    permissions: ['products.view', 'orders.view']
  },
  {
    id: 'user_004',
    email: 'viewer@binna.com',
    first_name: 'فاطمة',
    last_name: 'المراقب',
    role: 'viewer',
    status: 'invited',
    created_at: '2024-01-15T00:00:00Z',
    permissions: ['dashboard.view']
  }
];

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const supabase = createClientComponentClient();
        
        // Load users from Supabase
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) {
          throw new Error(`Failed to load users: ${usersError.message}`);
        }

        // Transform database data to match expected format
        const transformedUsers: User[] = usersData?.map((user: any) => ({
          id: user.id,
          email: user.email,
          first_name: user.name.split(' ')[0] || 'غير محدد',
          last_name: user.name.split(' ').slice(1).join(' ') || '',
          role: user.role,
          status: user.status,
          phone: user.phone,
          last_login: user.last_login,
          created_at: user.created_at,
          permissions: user.role === 'admin' ? ['all'] : 
                      user.role === 'store_owner' ? ['store.manage', 'products.manage', 'orders.manage'] :
                      ['orders.view', 'profile.edit']
        })) || [];

        setUsers(transformedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدير النظام';
      case 'manager':
        return 'مدير';
      case 'employee':
        return 'موظف';
      case 'viewer':
        return 'مراقب';
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'employee':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'invited':
        return 'مدعو';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <UserX className="h-4 w-4 text-red-500" />;
      case 'invited':
        return <Mail className="h-4 w-4 text-yellow-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as const }
        : user
    ));
  };

  const userStats = useMemo(() => {
    return users.reduce((acc, user) => {
      acc.total += 1;
      acc[user.status] = (acc[user.status] || 0) + 1;
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [users]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
              <p className="text-gray-600">إدارة مستخدمي النظام والصلاحيات</p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
              <Plus size={16} />
              إضافة مستخدم جديد
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold">{userStats.total || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">المستخدمين النشطين</p>
                  <p className="text-2xl font-bold text-green-600">{userStats.active || 0}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">المدراء</p>
                  <p className="text-2xl font-bold text-purple-600">{(userStats.admin || 0) + (userStats.manager || 0)}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">دعوات معلقة</p>
                  <p className="text-2xl font-bold text-yellow-600">{userStats.invited || 0}</p>
                </div>
                <Mail className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="البحث في المستخدمين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الأدوار</option>
                <option value="admin">مدير النظام</option>
                <option value="manager">مدير</option>
                <option value="employee">موظف</option>
                <option value="viewer">مراقب</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="invited">مدعو</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد مستخدمين</h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                    ? 'لا توجد نتائج تطابق المرشحات' 
                    : 'ابدأ بإضافة مستخدم جديد'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>آخر تسجيل دخول</TableHead>
                    <TableHead>تاريخ الإنضمام</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span className="text-sm">
                            {getStatusLabel(user.status)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.last_login ? (
                          <span className="text-sm">
                            {formatDateTime(user.last_login)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">لم يسجل دخول</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDateTime(user.created_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                          >
                            {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === 'admin'}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




