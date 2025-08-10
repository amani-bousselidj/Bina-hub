// @ts-nocheck
// InventoryWidget.tsx
'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePermissions } from '@/core/shared/hooks/usePermissions';
import { useState as useToastState } from 'react';

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
          <td colSpan={9} className="h-8 bg-gray-100 rounded my-1" />
        </tr>
      ))}
    </tbody>
  );
}

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  type: string;
  quantity: number;
  price: number;
  enabled: boolean;
}

export function InventoryWidget() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useToastState('');
  const [confirmDisable, setConfirmDisable] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  // Polling for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchInventory() {
      setError(null);
      try {
        const res = await fetch('/api/inventory');
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data = await res.json();
        setItems(data.items || []);
      } catch (err: any) {
        setError(err.message || 'Error loading inventory');
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
    interval = setInterval(fetchInventory, 15000); // 15s polling
    return () => clearInterval(interval);
  }, []);

  // Export selected to CSV
  const exportCSV = () => {
    const rows = items.filter(i => selected.includes(i.id));
    if (!rows.length) return;
    const header = 'الاسم,الكود,التصنيف,النوع,الكمية,السعر,الحالة';
    const csv = [header, ...rows.map(i => `${i.name},${i.code},${i.category},${i.type},${i.quantity},${i.price},${i.enabled ? 'نشط' : 'غير نشط'}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
    setToast('تم تصدير المنتجات المحددة بنجاح');
    // Analytics event: export
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'export_inventory' } }));
  };

  // Confirm disable
  const handleDisable = (id: string) => setConfirmDisable(id);
  const confirmDisableAction = () => {
    setItems(items => items.map(i => i.id === confirmDisable ? { ...i, enabled: false } : i));
    setToast('تم تعطيل المنتج بنجاح');
    setConfirmDisable(null);
    // Analytics event: disable
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'disable_inventory', id: confirmDisable } }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <Toast message={toast} onClose={() => setToast('')} />
      {confirmDisable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-bold mb-2">تأكيد التعطيل</h3>
            <p className="mb-4">هل أنت متأكد أنك تريد تعطيل هذا المنتج؟</p>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setConfirmDisable(null)}>إلغاء</button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={confirmDisableAction}>تعطيل</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-800">إدارة المخزون</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            onClick={exportCSV}
            disabled={!selected.length}
            aria-label="تصدير المحدد إلى CSV"
            title="تصدير المنتجات المحددة إلى ملف CSV"
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
          <table className="min-w-full text-sm rtl text-right" aria-label="جدول المخزون">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selected.length === items.length && items.length > 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? items.map(i => i.id) : [])}
                    aria-label="تحديد الكل"
                  />
                </th>
                <th className="px-3 py-2 font-bold">الاسم</th>
                <th className="px-3 py-2 font-bold">الكود</th>
                <th className="px-3 py-2 font-bold">التصنيف</th>
                <th className="px-3 py-2 font-bold">النوع</th>
                <th className="px-3 py-2 font-bold">الكمية</th>
                <th className="px-3 py-2 font-bold">السعر</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
                {hasPermission('edit_inventory') && <th className="px-3 py-2 font-bold">إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-500">لا توجد منتجات في المخزون</td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? [...selected, item.id] : selected.filter(id => id !== item.id))}
                        aria-label={`تحديد المنتج ${item.name}`}
                      />
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">{item.name}</td>
                    <td className="px-3 py-2 text-gray-700">{item.code}</td>
                    <td className="px-3 py-2 text-gray-700">{item.category}</td>
                    <td className="px-3 py-2 text-gray-700">{item.type}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {item.quantity}
                      {item.quantity < 10 && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 animate-pulse" title="كمية منخفضة">منخفض</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{item.price.toLocaleString('en-US')}</td>
                    <td className="px-3 py-2">
                      {item.enabled ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">نشط</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700">غير نشط</span>
                      )}
                    </td>
                    {hasPermission('edit_inventory') && (
                      <td className="px-3 py-2">
                        <button
                          className="text-blue-600 hover:underline text-xs mr-2"
                          aria-label={`تعديل المنتج ${item.name}`}
                          title="تعديل المنتج"
                         onClick={() => alert('Button clicked')}>تعديل</button>
                        <button
                          className="text-red-600 hover:underline text-xs"
                          aria-label={`تعطيل المنتج ${item.name}`}
                          title="تعطيل المنتج"
                          onClick={() => handleDisable(item.id)}
                        >تعطيل</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}





