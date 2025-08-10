// @ts-nocheck
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/core/shared/types/database';
import { Card, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/core/shared/utils';
import { EnhancedInput, EnhancedSelect, Button } from '@/components/ui/enhanced-components';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

interface ProjectOption {
  id: string;
  name: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  hasWarranty: boolean;
  warrantyDurationMonths: number;
  warrantyNotes: string;
}

interface OrderFormProps {
  storeId: string;
  storeName: string;
  initialProducts: any[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function OrderForm({
  storeId,
  storeName,
  initialProducts,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [items, setItems] = useState<ProductItem[]>(() =>
    initialProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      hasWarranty: false,
      warrantyDurationMonths: 12,
      warrantyNotes: '',
    }))
  );

  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // Load user's projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, [supabase]);

  const updateItem = (index: number, changes: Partial<ProductItem>) => {
    setItems((items) => items.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        hasWarranty: item.hasWarranty,
        warrantyDurationMonths: item.hasWarranty ? item.warrantyDurationMonths : null,
        warrantyNotes: item.hasWarranty ? item.warrantyNotes : null,
      }));

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          storeId,
          items: orderItems,
          projectId: selectedProject,
          notes: orderNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      onSuccess?.();
      router.push(`/user/orders/${data.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error instanceof Error ? error.message : 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="p-6 font-tajawal" dir="rtl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-1">إنشاء طلب شراء</h2>
          <p className="text-gray-600">المتجر: {storeName}</p>
        </div>
        <Button variant="secondary" onClick={onCancel} type="button">
          إلغاء
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <EnhancedSelect
          label="المشروع (اختياري)"
          name="selectedProject"
          value={selectedProject || ''}
          onChange={(e) => setSelectedProject(e.target.value || null)}
          options={[
            { value: '', label: 'اختر مشروعاً' },
            ...projects.map((project) => ({ value: project.id, label: project.name })),
          ]}
        />

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">المنتجات المطلوبة</h3>
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-gray-600">{formatCurrency(item.price)} للوحدة</p>
                </div>
                <div className="flex items-center gap-4">
                  <EnhancedInput
                    label="الكمية"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) })}
                    className="w-24"
                  />
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.hasWarranty}
                    onChange={(e) => updateItem(index, { hasWarranty: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">إضافة ضمان</span>
                </label>
                {item.hasWarranty && (
                  <div className="ml-6 space-y-4 mt-2">
                    <EnhancedInput
                      label="مدة الضمان (بالأشهر)"
                      type="number"
                      min={1}
                      value={item.warrantyDurationMonths}
                      onChange={(e) => updateItem(index, { warrantyDurationMonths: parseInt(e.target.value) })}
                    />
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">ملاحظات الضمان</label>
                      <textarea
                        value={item.warrantyNotes}
                        onChange={(e) => updateItem(index, { warrantyNotes: e.target.value })}
                        className="input-field"
                        rows={2}
                        placeholder="أضف شروط أو تفاصيل الضمان..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات الطلب (اختياري)</label>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="أضف أي تعليمات أو ملاحظات خاصة..."
          />
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">الإجمالي:</span>
            <span className="text-xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            {loading ? '...جاري إنشاء الطلب' : 'إنشاء الطلب'}
          </Button>
        </div>
      </form>
    </Card>
  );
}





