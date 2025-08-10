// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner, StatusBadge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/core/shared/utils';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import {
  Shield,
  Plus,
  Calendar,
  User,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Eye,
  Edit,
  Download,
  Upload
} from 'lucide-react';

interface ProjectWarrantyManagerProps {
  projectId: string;
  projectName: string;
  onWarrantyCreated?: (warrantyId: string) => void;
  onCancel?: () => void;
}

interface Warranty {
  id: string;
  warranty_number: string;
  product_name: string;
  brand: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_period_months: number;
  warranty_type: string;
  coverage_description: string;
  status: string;
  vendor_name: string;
  vendor_contact: string;
  purchase_price: number;
  currency: string;
  claim_count: number;
  purchase_receipt_url: string;
  warranty_certificate_url: string;
  created_at: string;
}

interface WarrantyForm {
  product_name: string;
  brand: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_period_months: number;
  warranty_type: string;
  coverage_description: string;
  vendor_name: string;
  vendor_contact: string;
  purchase_price: number;
  currency: string;
  purchase_receipt_url: string;
  warranty_certificate_url: string;
}

const warrantyTypes = [
  { value: 'manufacturer', label: 'ضمان الشركة المصنعة' },
  { value: 'extended', label: 'ضمان ممدد' },
  { value: 'store', label: 'ضمان المتجر' },
  { value: 'custom', label: 'ضمان مخصص' }
];

const currencies = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' }
];

export default function ProjectWarrantyManager({
  projectId,
  projectName,
  onWarrantyCreated,
  onCancel
}: ProjectWarrantyManagerProps) {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);

  const [form, setForm] = useState<WarrantyForm>({
    product_name: '',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    warranty_start_date: '',
    warranty_period_months: 12,
    warranty_type: 'manufacturer',
    coverage_description: '',
    vendor_name: '',
    vendor_contact: '',
    purchase_price: 0,
    currency: 'SAR',
    purchase_receipt_url: '',
    warranty_certificate_url: ''
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadWarranties();
  }, [projectId]);

  useEffect(() => {
    if (form.warranty_start_date && form.warranty_period_months) {
      // Auto-calculate warranty end date
      const startDate = new Date(form.warranty_start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + form.warranty_period_months);
      // Don't update state to avoid infinite loop, just keep it for calculation
    }
  }, [form.warranty_start_date, form.warranty_period_months]);

  const loadWarranties = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: warrantyError } = await supabase
        .from('warranties')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (warrantyError) throw warrantyError;

      setWarranties(data || []);
    } catch (error) {
      console.error('Error loading warranties:', error);
      setError('خطأ في تحميل بيانات الضمانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.product_name || !form.purchase_date || !form.warranty_start_date) {
      setError('يرجى ملء الحقول المطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // Calculate warranty end date
      const startDate = new Date(form.warranty_start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + form.warranty_period_months);

      const warrantyData = {
        user_id: user.id,
        project_id: projectId,
        warranty_number: `WRN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        product_name: form.product_name,
        brand: form.brand,
        model: form.model,
        serial_number: form.serial_number,
        purchase_date: form.purchase_date,
        warranty_start_date: form.warranty_start_date,
        warranty_end_date: endDate.toISOString().split('T')[0],
        warranty_period_months: form.warranty_period_months,
        warranty_type: form.warranty_type,
        coverage_description: form.coverage_description,
        status: 'active',
        vendor_name: form.vendor_name,
        vendor_contact: form.vendor_contact,
        purchase_price: form.purchase_price,
        currency: form.currency,
        purchase_receipt_url: form.purchase_receipt_url,
        warranty_certificate_url: form.warranty_certificate_url,
        claim_count: 0
      };

      let result;
      if (editingWarranty) {
        // Update existing warranty
        result = await supabase
          .from('warranties')
          .update(warrantyData)
          .eq('id', editingWarranty.id)
          .select()
          .single();
      } else {
        // Create new warranty
        result = await supabase
          .from('warranties')
          .insert(warrantyData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Reset form and reload warranties
      resetForm();
      setShowForm(false);
      setEditingWarranty(null);
      await loadWarranties();

      if (onWarrantyCreated && !editingWarranty) {
        onWarrantyCreated(result.data.id);
      }

    } catch (error) {
      console.error('Error saving warranty:', error);
      setError('خطأ في حفظ بيانات الضمان');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      product_name: '',
      brand: '',
      model: '',
      serial_number: '',
      purchase_date: '',
      warranty_start_date: '',
      warranty_period_months: 12,
      warranty_type: 'manufacturer',
      coverage_description: '',
      vendor_name: '',
      vendor_contact: '',
      purchase_price: 0,
      currency: 'SAR',
      purchase_receipt_url: '',
      warranty_certificate_url: ''
    });
  };

  const editWarranty = (warranty: Warranty) => {
    setEditingWarranty(warranty);
    setForm({
      product_name: warranty.product_name,
      brand: warranty.brand || '',
      model: warranty.model || '',
      serial_number: warranty.serial_number || '',
      purchase_date: warranty.purchase_date,
      warranty_start_date: warranty.warranty_start_date,
      warranty_period_months: warranty.warranty_period_months,
      warranty_type: warranty.warranty_type,
      coverage_description: warranty.coverage_description || '',
      vendor_name: warranty.vendor_name || '',
      vendor_contact: warranty.vendor_contact || '',
      purchase_price: warranty.purchase_price || 0,
      currency: warranty.currency || 'SAR',
      purchase_receipt_url: warranty.purchase_receipt_url || '',
      warranty_certificate_url: warranty.warranty_certificate_url || ''
    });
    setShowForm(true);
  };

  const deleteWarranty = async (warrantyId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الضمان؟')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('warranties')
        .delete()
        .eq('id', warrantyId);

      if (error) throw error;

      await loadWarranties();
    } catch (error) {
      console.error('Error deleting warranty:', error);
      setError('خطأ في حذف الضمان');
    }
  };

  const getWarrantyStatusBadge = (warranty: Warranty) => {
    const now = new Date();
    const endDate = new Date(warranty.warranty_end_date);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (warranty.status === 'expired' || daysUntilExpiry < 0) {
      return { text: 'منتهي', variant: 'error' as const, icon: X };
    } else if (daysUntilExpiry <= 30) {
      return { text: 'ينتهي قريباً', variant: 'warning' as const, icon: AlertTriangle };
    } else if (warranty.status === 'active') {
      return { text: 'نشط', variant: 'success' as const, icon: CheckCircle };
    } else {
      return { text: warranty.status, variant: 'default' as const, icon: Clock };
    }
  };

  const getWarrantyDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="w-6 h-6 ml-2" />
            إدارة ضمانات المشروع
          </h2>
          <p className="text-gray-600">{projectName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingWarranty(null);
              resetForm();
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة ضمان
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5 ml-2" />
              إغلاق
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Warranty Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingWarranty ? 'تعديل الضمان' : 'إضافة ضمان جديد'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">معلومات المنتج</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
                  <input
                    type="text"
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">الماركة</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">الموديل</label>
                    <input
                      type="text"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الرقم التسلسلي</label>
                  <input
                    type="text"
                    value={form.serial_number}
                    onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">سعر الشراء</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.purchase_price}
                      onChange={(e) => setForm({ ...form, purchase_price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">العملة</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {currencies.map(currency => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Warranty Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">معلومات الضمان</h4>

                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الشراء *</label>
                  <input
                    type="date"
                    value={form.purchase_date}
                    onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ بداية الضمان *</label>
                  <input
                    type="date"
                    value={form.warranty_start_date}
                    onChange={(e) => setForm({ ...form, warranty_start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">فترة الضمان (شهر)</label>
                    <input
                      type="number"
                      min="1"
                      value={form.warranty_period_months}
                      onChange={(e) => setForm({ ...form, warranty_period_months: parseInt(e.target.value) || 12 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">نوع الضمان</label>
                    <select
                      value={form.warranty_type}
                      onChange={(e) => setForm({ ...form, warranty_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {warrantyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">وصف التغطية</label>
                  <textarea
                    value={form.coverage_description}
                    onChange={(e) => setForm({ ...form, coverage_description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="اكتب تفاصيل ما يغطيه الضمان..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">اسم المورد</label>
                    <input
                      type="text"
                      value={form.vendor_name}
                      onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">جهة الاتصال</label>
                    <input
                      type="text"
                      value={form.vendor_contact}
                      onChange={(e) => setForm({ ...form, vendor_contact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="رقم هاتف أو بريد إلكتروني"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Links */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">المستندات</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">رابط فاتورة الشراء</label>
                  <input
                    type="url"
                    value={form.purchase_receipt_url}
                    onChange={(e) => setForm({ ...form, purchase_receipt_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رابط شهادة الضمان</label>
                  <input
                    type="url"
                    value={form.warranty_certificate_url}
                    onChange={(e) => setForm({ ...form, warranty_certificate_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingWarranty(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 ml-2" />
                    {editingWarranty ? 'تحديث الضمان' : 'حفظ الضمان'}
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Warranties List */}
      <Card>
        <div className="p-4 border-b">
          <h3 className="font-semibold">ضمانات المشروع ({warranties.length})</h3>
        </div>

        {warranties.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">لا توجد ضمانات مسجلة لهذا المشروع</p>
            <p className="text-sm text-gray-400">قم بإضافة ضمانات المنتجات المشتراة للمشروع</p>
          </div>
        ) : (
          <div className="divide-y">
            {warranties.map((warranty) => {
              const statusBadge = getWarrantyStatusBadge(warranty);
              const daysRemaining = getWarrantyDaysRemaining(warranty.warranty_end_date);
              const StatusIcon = statusBadge.icon;

              return (
                <div key={warranty.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">                        <h4 className="font-medium">{warranty.product_name}</h4>
                        <StatusBadge 
                          status={statusBadge.variant}
                          label={statusBadge.text}
                        />
                        {warranty.warranty_type !== 'manufacturer' && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                            {warrantyTypes.find(t => t.value === warranty.warranty_type)?.label}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>رقم الضمان:</strong> {warranty.warranty_number}</p>
                          <p><strong>المورد:</strong> {warranty.vendor_name || 'غير محدد'}</p>
                          {warranty.brand && <p><strong>الماركة:</strong> {warranty.brand}</p>}
                        </div>
                        <div>
                          <p><strong>تاريخ الشراء:</strong> {formatDate(warranty.purchase_date)}</p>
                          <p><strong>بداية الضمان:</strong> {formatDate(warranty.warranty_start_date)}</p>
                          <p><strong>نهاية الضمان:</strong> {formatDate(warranty.warranty_end_date)}</p>
                        </div>
                        <div>
                          <p><strong>فترة الضمان:</strong> {warranty.warranty_period_months} شهر</p>
                          {daysRemaining > 0 ? (
                            <p className={`${daysRemaining <= 30 ? 'text-orange-600' : 'text-green-600'}`}>
                              <strong>باقي:</strong> {daysRemaining} يوم
                            </p>
                          ) : (
                            <p className="text-red-600"><strong>منتهي منذ:</strong> {Math.abs(daysRemaining)} يوم</p>
                          )}
                          {warranty.claim_count > 0 && (
                            <p className="text-orange-600">
                              <strong>المطالبات:</strong> {warranty.claim_count}
                            </p>
                          )}
                        </div>
                      </div>

                      {warranty.coverage_description && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>التغطية:</strong> {warranty.coverage_description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mr-4">
                      {warranty.purchase_receipt_url && (
                        <a
                          href={warranty.purchase_receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض فاتورة الشراء"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                      
                      {warranty.warranty_certificate_url && (
                        <a
                          href={warranty.warranty_certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="عرض شهادة الضمان"
                        >
                          <Shield className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedWarranty(warranty)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => editWarranty(warranty)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteWarranty(warranty.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Warranty Details Modal */}
      {selectedWarranty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold">تفاصيل الضمان</h3>
                <button
                  onClick={() => setSelectedWarranty(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Information */}
                <div>
                  <h4 className="font-medium mb-3">معلومات المنتج</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>اسم المنتج:</strong> {selectedWarranty.product_name}</div>
                    <div><strong>رقم الضمان:</strong> {selectedWarranty.warranty_number}</div>
                    <div><strong>الماركة:</strong> {selectedWarranty.brand || 'غير محدد'}</div>
                    <div><strong>الموديل:</strong> {selectedWarranty.model || 'غير محدد'}</div>
                    <div><strong>الرقم التسلسلي:</strong> {selectedWarranty.serial_number || 'غير محدد'}</div>
                    <div><strong>سعر الشراء:</strong> {formatCurrency(selectedWarranty.purchase_price || 0, selectedWarranty.currency)}</div>
                  </div>
                </div>

                {/* Warranty Information */}
                <div>
                  <h4 className="font-medium mb-3">معلومات الضمان</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>تاريخ الشراء:</strong> {formatDate(selectedWarranty.purchase_date)}</div>
                    <div><strong>بداية الضمان:</strong> {formatDate(selectedWarranty.warranty_start_date)}</div>
                    <div><strong>نهاية الضمان:</strong> {formatDate(selectedWarranty.warranty_end_date)}</div>
                    <div><strong>فترة الضمان:</strong> {selectedWarranty.warranty_period_months} شهر</div>
                    <div><strong>نوع الضمان:</strong> {warrantyTypes.find(t => t.value === selectedWarranty.warranty_type)?.label}</div>
                    <div><strong>عدد المطالبات:</strong> {selectedWarranty.claim_count}</div>
                  </div>
                </div>

                {/* Vendor Information */}
                <div>
                  <h4 className="font-medium mb-3">معلومات المورد</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>اسم المورد:</strong> {selectedWarranty.vendor_name || 'غير محدد'}</div>
                    <div><strong>جهة الاتصال:</strong> {selectedWarranty.vendor_contact || 'غير محدد'}</div>
                  </div>
                </div>

                {/* Coverage Description */}
                {selectedWarranty.coverage_description && (
                  <div>
                    <h4 className="font-medium mb-3">وصف التغطية</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedWarranty.coverage_description}
                    </p>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h4 className="font-medium mb-3">المستندات</h4>
                  <div className="flex gap-3">
                    {selectedWarranty.purchase_receipt_url && (
                      <a
                        href={selectedWarranty.purchase_receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FileText className="w-4 h-4 ml-2" />
                        فاتورة الشراء
                      </a>
                    )}
                    
                    {selectedWarranty.warranty_certificate_url && (
                      <a
                        href={selectedWarranty.warranty_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Shield className="w-4 h-4 ml-2" />
                        شهادة الضمان
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}




