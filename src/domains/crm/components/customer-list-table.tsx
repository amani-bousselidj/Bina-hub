"use client";

import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Search, Plus, Edit, Eye, Mail, Phone } from "lucide-react";

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  has_account: boolean;
  orders_count: number;
  created_at: string;
}

export const CustomerListTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
        const supabase = createClientComponentClient();
        
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching customers:', error);
          return;
        }
        
        setCustomers(data || []);
      } catch (error) {
        console.error('Error setting up Supabase client:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();

    // Set data immediately - no setTimeout
  }, []); // Empty dependency array

  // Memoize filtered customers to prevent unnecessary re-calculations
  const filteredCustomers = useMemo(() => 
    customers.filter(customer =>
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [customers, searchTerm]
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>قائمة العملاء</CardTitle>
          <Button onClick={() => alert('Button clicked')}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة عميل جديد
          </Button>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="البحث عن العملاء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الهاتف</TableHead>
              <TableHead className="text-right">الحساب</TableHead>
              <TableHead className="text-right">عدد الطلبات</TableHead>
              <TableHead className="text-right">تاريخ التسجيل</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-right">
                  {customer.first_name} {customer.last_name}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {customer.email}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {customer.phone}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={customer.has_account ? "default" : "secondary"}>
                    {customer.has_account ? "لديه حساب" : "ضيف"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{customer.orders_count}</TableCell>
                <TableCell className="text-right">
                  {new Date(customer.created_at).toLocaleDateString('ar-SA')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد عملاء مطابقين لمعايير البحث
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerListTable;




