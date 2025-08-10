'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Package, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  products_count: number;
  created_at: string;
  status: 'published' | 'draft';
}

export default function CollectionList() {
const supabase = createClientComponentClient();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading collections
    const timer = setTimeout(() => {
      setCollections([]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredCollections = useMemo(() => {
    if (!searchTerm) return collections;
    
    return collections.filter(collection =>
      collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  const totalProducts = collections.reduce((sum, col) => sum + col.products_count, 0);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مجموعات المنتجات</h1>
            <p className="text-gray-600 mt-2">إدارة وتنظيم مجموعات المنتجات في متجرك</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <Plus size={16} />
            إضافة مجموعة جديدة
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المجموعات</p>
                  <p className="text-2xl font-bold">{collections.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">المجموعات المنشورة</p>
                  <p className="text-2xl font-bold">
                    {collections.filter(c => c.status === 'published').length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="البحث في المجموعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Collections Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المجموعات</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCollections.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'لا توجد نتائج' : 'لا توجد مجموعات'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'جرب مصطلح بحث مختلف' : 'ابدأ بإنشاء مجموعة جديدة'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المجموعة</TableHead>
                    <TableHead>المعرف</TableHead>
                    <TableHead>عدد المنتجات</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{collection.title}</div>
                          {collection.description && (
                            <div className="text-sm text-gray-500">
                              {collection.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {collection.handle}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {collection.products_count} منتج
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={collection.status === 'published' ? 'default' : 'secondary'}
                        >
                          {collection.status === 'published' ? 'منشور' : 'مسودة'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(collection.created_at).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
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
