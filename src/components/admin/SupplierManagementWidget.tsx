// @ts-nocheck
// SupplierManagementWidget.tsx
// Open source (Ever Gauzy-inspired) Supplier Management widget for the store dashboard
'use client';

import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { ClientIcon } from '@/components/ui';
import { usePermissions } from '@/core/shared/hooks/usePermissions';
import { useState as useToastState } from 'react';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose} aria-label="إغلاق التنبيه">×</button>
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td colSpan={10} className="h-8 bg-gray-100 rounded my-1" />
        </tr>
      ))}
    </tbody>
  );
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  totalPurchases: number;
}

export const SupplierManagementWidget: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useToastState('');
  const [confirmDisable, setConfirmDisable] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  // Polling for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchSuppliers() {
      setError(null);
      try {
        // Simulated data (replace with real fetch)
        setSuppliers([
          { id: '1', name: 'شركة المورد الأول', contact: '0501234567', email: 'supplier1@email.com', totalPurchases: 12000 },
          { id: '2', name: 'مؤسسة التوريد الحديثة', contact: '0509876543', email: 'supplier2@email.com', totalPurchases: 8000 },
        ]);
      } catch (err) {
        setError('تعذر تحميل بيانات الموردين');
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
    interval = setInterval(fetchSuppliers, 20000); // 20s polling
    return () => clearInterval(interval);
  }, []);

  // Export selected to CSV
  const exportCSV = () => {
    const rows = suppliers.filter(s => selected.includes(s.id));
    if (!rows.length) return;
    const header = 'الاسم,رقم التواصل,البريد الإلكتروني,إجمالي المشتريات';
    const csv = [header, ...rows.map(s => `${s.name},${s.contact},${s.email},${s.totalPurchases}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    a.click();
    URL.revokeObjectURL(url);
    setToast('تم تصدير الموردين المحددين بنجاح');
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'export_suppliers' } }));
  };

  // Confirm disable
  const handleDisable = (id: string) => setConfirmDisable(id);
  const confirmDisableAction = () => {
    setSuppliers(suppliers => suppliers.map(s => s.id === confirmDisable ? { ...s, disabled: true } : s));
    setToast('تم تعطيل المورد بنجاح');
    setConfirmDisable(null);
    window.dispatchEvent(new CustomEvent('analytics', { detail: { action: 'disable_supplier', id: confirmDisable } }));
  };

  // Find top supplier
  const topSupplierId = suppliers.reduce((maxId, s) => s.totalPurchases > (suppliers.find(x => x.id === maxId)?.totalPurchases ?? 0) ? s.id : maxId, suppliers[0]?.id || '');

  return (
    <Card className="mb-6">
      <Toast message={toast} onClose={() => setToast('')} />
      {confirmDisable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-bold mb-2">تأكيد التعطيل</h3>
            <p className="mb-4">هل أنت متأكد أنك تريد تعطيل هذا المورد؟</p>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setConfirmDisable(null)}>إلغاء</button>
              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={confirmDisableAction}>تعطيل</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center">
          <ClientIcon type="ai" size={24} className="text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">إدارة الموردين</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            onClick={exportCSV}
            disabled={!selected.length}
            aria-label="تصدير المحدد إلى CSV"
            title="تصدير الموردين المحددين إلى ملف CSV"
          >
            تصدير المحدد إلى CSV
          </button>
        </div>
      </div>
      {loading ? (
        <table className="min-w-full text-sm"><TableSkeleton rows={5} /></table>
      ) : error ? (
        <div className="text-red-600" role="alert">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm" aria-label="جدول الموردين">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selected.length === suppliers.length && suppliers.length > 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? suppliers.map(s => s.id) : [])}
                    aria-label="تحديد الكل"
                  />
                </th>
                <th className="px-3 py-2 text-right">الاسم</th>
                <th className="px-3 py-2 text-right">رقم التواصل</th>
                <th className="px-3 py-2 text-right">البريد الإلكتروني</th>
                <th className="px-3 py-2 text-right">إجمالي المشتريات</th>
                {hasPermission('edit_suppliers') && <th className="px-3 py-2 text-right">إجراءات</th>}
              </tr>
            </thead>
            {suppliers.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500">لا توجد بيانات موردين</td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(supplier.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? [...selected, supplier.id] : selected.filter(id => id !== supplier.id))}
                        aria-label={`تحديد المورد ${supplier.name}`}
                      />
                    </td>
                    <td className="px-3 py-2">
                      {supplier.name}
                      {supplier.id === topSupplierId && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 animate-pulse" title="أفضل مورد">الأفضل</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{supplier.contact}</td>
                    <td className="px-3 py-2">{supplier.email}</td>
                    <td className="px-3 py-2">{supplier.totalPurchases.toLocaleString('en-US')} ر.س</td>
                    {hasPermission('edit_suppliers') && (
                      <td className="px-3 py-2">
                        <button className="text-blue-600 hover:underline text-xs mr-2" aria-label={`تعديل المورد ${supplier.name}`} title="تعديل المورد" onClick={() => alert('Button clicked')}>تعديل</button>
                        <button className="text-green-600 hover:underline text-xs mr-2" aria-label={`مراسلة المورد ${supplier.name}`} title="مراسلة المورد" onClick={() => alert('Button clicked')}>مراسلة</button>
                        <button className="text-red-600 hover:underline text-xs" aria-label={`تعطيل المورد ${supplier.name}`} title="تعطيل المورد" onClick={() => handleDisable(supplier.id)}>تعطيل</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      )}
    </Card>
  );
};





