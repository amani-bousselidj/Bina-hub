// @ts-nocheck
// CRMWidget.tsx
// Open source (Ever Gauzy-inspired) CRM widget for the store dashboard
'use client';

import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { ClientIcon } from '@/components/ui';
import { usePermissions } from '@/core/shared/hooks/usePermissions';
import { useState as useToastState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastPurchase: string;
  totalSpent: number;
}

// Simple toast component for feedback
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose} aria-label="إغلاق التنبيه">×</button>
    </div>
  );
}

// Skeleton loader for table rows
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td colSpan={8} className="h-8 bg-gray-100 rounded my-1" />
        </tr>
      ))}
    </tbody>
  );
}

export const CRMWidget: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useToastState('');
  const [confirmDisable, setConfirmDisable] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  // Polling for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchCustomers() {
      setError(null);
      try {
        setCustomers([
          { id: '1', name: 'أحمد علي', email: 'ahmed@email.com', phone: '0501112233', lastPurchase: '2025-06-12', totalSpent: 3500 },
          { id: '2', name: 'سارة محمد', email: 'sara@email.com', phone: '0502223344', lastPurchase: '2025-06-10', totalSpent: 2200 },
        ]);
      } catch (err) {
        setError('تعذر تحميل بيانات العملاء');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
    interval = setInterval(fetchCustomers, 20000); // 20s polling
    return () => clearInterval(interval);
  }, []);

  // Export selected to CSV
  const exportCSV = () => {
    const rows = customers.filter(c => selected.includes(c.id));
    if (!rows.length) return;
    const header = 'الاسم,البريد الإلكتروني,رقم الجوال,آخر عملية شراء,إجمالي الإنفاق';
    const csv = [header, ...rows.map(c => `${c.name},${c.email},${c.phone},${c.lastPurchase},${c.totalSpent}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
    setToast('تم تصدير العملاء المحددين بنجاح');
    // Analytics event: export
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'export_customers' } }));
  };

  // Confirm disable
  const handleDisable = (id: string) => setConfirmDisable(id);
  const confirmDisableAction = () => {
    setCustomers(customers => customers.map(c => c.id === confirmDisable ? { ...c, enabled: false } : c));
    setToast('تم تعطيل العميل بنجاح');
    setConfirmDisable(null);
    // Analytics event: disable
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'disable_customer', id: confirmDisable } }));
  };

  // Find top customer
  const topCustomerId = customers.reduce((maxId, c) => c.totalSpent > (customers.find(x => x.id === maxId)?.totalSpent ?? 0) ? c.id : maxId, customers[0]?.id || '');

  return (
    <Card className="mb-6">
      <Toast message={toast} onClose={() => setToast('')} />
      {confirmDisable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-bold mb-2">تأكيد التعطيل</h3>
            <p className="mb-4">هل أنت متأكد أنك تريد تعطيل هذا العميل؟</p>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setConfirmDisable(null)}>إلغاء</button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={confirmDisableAction}>تعطيل</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center">
          <ClientIcon type="ai" size={24} className="text-pink-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">إدارة العملاء (CRM)</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            onClick={exportCSV}
            disabled={!selected.length}
            aria-label="تصدير المحدد إلى CSV"
            title="تصدير العملاء المحددين إلى ملف CSV"
          >
            تصدير المحدد إلى CSV
          </button>
        </div>
      </div>
      {loading ? (
        <table className="min-w-full text-sm rtl text-right"><TableSkeleton rows={5} /></table>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded" role="alert">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rtl text-right" aria-label="جدول العملاء">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selected.length === customers.length && customers.length > 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? customers.map(c => c.id) : [])}
                    aria-label="تحديد الكل"
                  />
                </th>
                <th className="px-3 py-2 text-right">الاسم</th>
                <th className="px-3 py-2 text-right">البريد الإلكتروني</th>
                <th className="px-3 py-2 text-right">رقم الجوال</th>
                <th className="px-3 py-2 text-right">آخر عملية شراء</th>
                <th className="px-3 py-2 text-right">إجمالي الإنفاق</th>
                {hasPermission('edit_customers') && <th className="px-3 py-2 text-right">إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-500">لا يوجد عملاء</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(customer.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? [...selected, customer.id] : selected.filter(id => id !== customer.id))}
                        aria-label={`تحديد العميل ${customer.name}`}
                      />
                    </td>
                    <td className="px-3 py-2">
                      {customer.name}
                      {customer.id === topCustomerId && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 animate-pulse" title="الأفضل">الأفضل</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{customer.email}</td>
                    <td className="px-3 py-2">{customer.phone}</td>
                    <td className="px-3 py-2">{customer.lastPurchase}</td>
                    <td className="px-3 py-2">{customer.totalSpent.toLocaleString('en-US')} ر.س</td>
                    {hasPermission('edit_customers') && (
                      <td className="px-3 py-2">
                        <button className="text-blue-600 hover:underline text-xs mr-2" aria-label={`تعديل العميل ${customer.name}`} title="تعديل العميل" onClick={() => alert('Button clicked')}>تعديل</button>
                        <button className="text-green-600 hover:underline text-xs mr-2" aria-label={`مراسلة العميل ${customer.name}`} title="مراسلة العميل" onClick={() => alert('Button clicked')}>مراسلة</button>
                        <button className="text-red-600 hover:underline text-xs" aria-label={`تعطيل العميل ${customer.name}`} title="تعطيل العميل" onClick={() => handleDisable(customer.id)}>تعطيل</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};






