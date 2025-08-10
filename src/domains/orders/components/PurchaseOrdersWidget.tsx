// @ts-nocheck
// PurchaseOrdersWidget.tsx
// Open source (Ever Gauzy-inspired) Purchase Orders widget for the store dashboard
'use client';

import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { ClientIcon } from '@/components/icons';
import { usePermissions } from '@/core/shared/hooks/usePermissions';
import { useState as useToastState } from 'react';

interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  status: string;
  total: number;
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

export const PurchaseOrdersWidget: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useToastState('');
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  // Polling for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchOrders() {
      setError(null);
      try {
        setOrders([
          { id: 'PO-001', supplier: 'شركة المورد الأول', date: '2025-06-10', status: 'مكتمل', total: 5000 },
          { id: 'PO-002', supplier: 'مؤسسة التوريد الحديثة', date: '2025-06-12', status: 'قيد التنفيذ', total: 3200 },
        ]);
      } catch (err) {
        setError('تعذر تحميل أوامر الشراء');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
    interval = setInterval(fetchOrders, 20000); // 20s polling
    return () => clearInterval(interval);
  }, []);

  // Export selected to CSV
  const exportCSV = () => {
    const rows = orders.filter(o => selected.includes(o.id));
    if (!rows.length) return;
    const header = 'رقم الأمر,المورد,التاريخ,الحالة,الإجمالي';
    const csv = [header, ...rows.map(o => `${o.id},${o.supplier},${o.date},${o.status},${o.total}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase_orders.csv';
    a.click();
    URL.revokeObjectURL(url);
    setToast('تم تصدير أوامر الشراء المحددة بنجاح');
    // Analytics event: export
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'export_purchase_orders' } }));
  };

  // Confirm cancel
  const handleCancel = (id: string) => setConfirmCancel(id);
  const confirmCancelAction = () => {
    setOrders(orders => orders.map(o => o.id === confirmCancel ? { ...o, status: 'ملغي' } : o));
    setToast('تم إلغاء أمر الشراء بنجاح');
    setConfirmCancel(null);
    // Analytics event: cancel
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'cancel_purchase_order', id: confirmCancel } }));
  };

  return (
    <Card className="mb-6">
      <Toast message={toast} onClose={() => setToast('')} />
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-bold mb-2">تأكيد الإلغاء</h3>
            <p className="mb-4">هل أنت متأكد أنك تريد إلغاء أمر الشراء؟</p>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setConfirmCancel(null)}>إلغاء</button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={confirmCancelAction}>إلغاء الأمر</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center">
          <ClientIcon type="ai" size={24} className="text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">أوامر الشراء</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            onClick={exportCSV}
            disabled={!selected.length}
            aria-label="تصدير المحدد إلى CSV"
            title="تصدير أوامر الشراء المحددة إلى ملف CSV"
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
          <table className="min-w-full text-sm rtl text-right" aria-label="جدول أوامر الشراء">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selected.length === orders.length && orders.length > 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? orders.map(o => o.id) : [])}
                    aria-label="تحديد الكل"
                  />
                </th>
                <th className="px-3 py-2 text-right">رقم الأمر</th>
                <th className="px-3 py-2 text-right">المورد</th>
                <th className="px-3 py-2 text-right">التاريخ</th>
                <th className="px-3 py-2 text-right">الحالة</th>
                <th className="px-3 py-2 text-right">الإجمالي</th>
                {hasPermission('edit_purchase_orders') && <th className="px-3 py-2 text-right">إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-500">لا توجد أوامر شراء</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(order.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? [...selected, order.id] : selected.filter(id => id !== order.id))}
                        aria-label={`تحديد أمر الشراء ${order.id}`}
                      />
                    </td>
                    <td className="px-3 py-2">{order.id}</td>
                    <td className="px-3 py-2">{order.supplier}</td>
                    <td className="px-3 py-2">{order.date}</td>
                    <td className="px-3 py-2">
                      {order.status}
                      {order.status === 'قيد التنفيذ' && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 animate-pulse" title="متأخر">متأخر</span>
                      )}
                      {order.status === 'ملغي' && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">ملغي</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{order.total.toLocaleString('en-US')} ر.س</td>
                    {hasPermission('edit_purchase_orders') && (
                      <td className="px-3 py-2">
                        <button className="text-blue-600 hover:underline text-xs mr-2" aria-label={`تعديل أمر الشراء ${order.id}`} title="تعديل أمر الشراء" onClick={() => alert('Button clicked')}>تعديل</button>
                        <button className="text-red-600 hover:underline text-xs" aria-label={`إلغاء أمر الشراء ${order.id}`} title="إلغاء أمر الشراء" onClick={() => handleCancel(order.id)}>إلغاء</button>
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






