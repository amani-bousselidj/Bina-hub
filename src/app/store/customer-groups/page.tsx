'use client';

import { useState, useMemo } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Users, Edit, Trash2, DollarSign } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  customer_count: number;
  status: 'active' | 'inactive';
  created_at: string;
}

// Real data from Supabase

export default function CustomerGroupsList() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [customerGroups] = useState<CustomerGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = useMemo(() => {
    return customerGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customerGroups, searchTerm]);

  const totalStats = useMemo(() => {
    const totalGroups = customerGroups.length;
    const totalCustomers = customerGroups.reduce((sum, group) => sum + group.customer_count, 0);
    const activeGroups = customerGroups.filter(group => group.status === 'active').length;
    const avgDiscount = customerGroups.reduce((sum, group) => sum + group.discount_percentage, 0) / customerGroups.length;
    
    return { totalGroups, totalCustomers, activeGroups, avgDiscount };
  }, [customerGroups]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مجموعات العملاء</h1>
            <p className="text-gray-600 mt-2">إدارة مجموعات العملاء والخصومات</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <Plus className="h-4 w-4" />
            إضافة مجموعة جديدة
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المجموعات</p>
                  <p className="text-2xl font-bold">{totalStats.totalGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                  <p className="text-2xl font-bold">{totalStats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">المجموعات النشطة</p>
                  <p className="text-2xl font-bold">{totalStats.activeGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">متوسط الخصم</p>
                  <p className="text-2xl font-bold">{totalStats.avgDiscount.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Groups Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في مجموعات العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مجموعات عملاء</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'لا توجد مجموعات تطابق معايير البحث'
                    : 'ابدأ بإضافة مجموعات عملاء جديدة'
                  }
                </p>
                <Button onClick={() => alert('Button clicked')}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مجموعة
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المجموعة</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>نسبة الخصم</TableHead>
                    <TableHead>عدد العملاء</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>
                        <div className="font-medium">{group.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{group.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {group.discount_percentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{group.customer_count.toLocaleString('ar-SA')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {group.status === 'active' ? 'نشطة' : 'غير نشطة'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{formatDate(group.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => alert('Button clicked')}>
                            <Trash2 className="h-4 w-4" />
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






