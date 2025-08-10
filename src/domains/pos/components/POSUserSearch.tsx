// @ts-nocheck
// Store POS User Search Component
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, User, Phone, MapPin, Package, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CustomerSearchResult {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  region?: string;
  projects_count: number;
  total_orders: number;
  recent_order_date?: string;
  total_spent: number;
  projects: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

interface POSUserSearchProps {
  onCustomerSelect: (customer: CustomerSearchResult) => void;
  selectedCustomer?: CustomerSearchResult | null;
}

export default function POSUserSearch({ onCustomerSelect, selectedCustomer }: POSUserSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<CustomerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const supabase = createClientComponentClient();

  // Load recent customers on component mount
  useEffect(() => {
    loadRecentCustomers();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.length >= 2) {
        searchCustomers(term);
      } else {
        setSearchResults([]);
        setSelectedIndex(-1);
      }
    }, 300),
    []
  );

  // Search customers by name, phone, or email
  const searchCustomers = async (term: string) => {
    try {
      setIsSearching(true);
      
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          phone,
          city,
          region,
          projects:projects(id, name, status),
          orders:orders(id, total_amount, created_at)
        `)
        .or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`)
        .eq('account_type', 'user')
        .limit(10);

      if (error) throw error;

      const searchResults: CustomerSearchResult[] = users?.map(user => {
        const orders = user.orders || [];
        const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const recentOrder = orders.length > 0 ? 
          orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null;
        
        return {
          id: user.id,
          name: user.name || user.email || 'مستخدم غير معروف',
          email: user.email,
          phone: user.phone,
          city: user.city,
          region: user.region,
          projects_count: user.projects?.length || 0,
          total_orders: orders.length,
          recent_order_date: recentOrder?.created_at,
          total_spent: totalSpent,
          projects: user.projects?.map(p => ({
            id: p.id,
            name: p.name,
            status: p.status
          })) || []
        };
      }) || [];

      setSearchResults(searchResults);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching customers:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Load recent customers
  const loadRecentCustomers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get recent customers based on recent orders
      const { data: recentOrders, error } = await supabase
        .from('orders')
        .select(`
          user_id,
          created_at,
          total_amount,
          users:user_id (
            id,
            name,
            email,
            phone,
            city,
            region
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const uniqueCustomers = new Map();
      recentOrders?.forEach(order => {
        if (order.users && !uniqueCustomers.has(order.user_id)) {
          uniqueCustomers.set(order.user_id, {
            id: order.users.id,
            name: order.users.name || order.users.email || 'مستخدم غير معروف',
            email: order.users.email,
            phone: order.users.phone,
            city: order.users.city,
            region: order.users.region,
            projects_count: 0,
            total_orders: 1,
            recent_order_date: order.created_at,
            total_spent: order.total_amount || 0,
            projects: []
          });
        }
      });

      setRecentCustomers(Array.from(uniqueCustomers.values()));
    } catch (error) {
      console.error('Error loading recent customers:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const results = searchResults.length > 0 ? searchResults : recentCustomers;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      onCustomerSelect(results[selectedIndex]);
    }
  };

  // Customer card component
  const CustomerCard = ({ customer, index, isSelected }: { 
    customer: CustomerSearchResult; 
    index: number; 
    isSelected: boolean;
  }) => (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onCustomerSelect(customer)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-600">{customer.email}</p>
            {customer.phone && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Phone className="w-3 h-3" />
                <span>{customer.phone}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Package className="w-3 h-3" />
            <span>{customer.total_orders} طلبات</span>
          </div>
          {customer.total_spent > 0 && (
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="w-3 h-3" />
              <span>{customer.total_spent.toLocaleString('en-US')} ريال</span>
            </div>
          )}
        </div>
      </div>
      
      {customer.projects_count > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            {customer.projects_count} مشروع نشط
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold">البحث عن العملاء</h2>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Input
            type="text"
            placeholder="ابحث بالاسم، الإيميل، أو رقم الهاتف..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Selected Customer Display */}
        {selectedCustomer && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-900">العميل المحدد</h3>
                <p className="text-green-700">{selectedCustomer.name}</p>
                <p className="text-sm text-green-600">{selectedCustomer.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCustomerSelect(null as any)}
              >
                إلغاء التحديد
              </Button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm.length >= 2 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">نتائج البحث</h3>
            {searchResults.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((customer, index) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    index={index}
                    isSelected={selectedIndex === index}
                  />
                ))}
              </div>
            ) : (
              !isSearching && (
                <div className="text-center py-4 text-gray-500">
                  لم يتم العثور على عملاء
                </div>
              )
            )}
          </div>
        )}

        {/* Recent Customers */}
        {searchTerm.length === 0 && recentCustomers.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">العملاء الأخيرون</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recentCustomers.map((customer, index) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  index={index}
                  isSelected={selectedIndex === index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}









