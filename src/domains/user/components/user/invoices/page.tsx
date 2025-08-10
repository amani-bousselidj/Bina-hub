"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { FileText, Search, Download, Calendar, CreditCard, Store, Eye, Printer, Filter } from 'lucide-react';
import { formatDateSafe, formatNumberSafe, useIsClient } from '@/core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface ExtendedInvoice {
  id: string;
  invoiceNumber: string;
  store: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  orderId?: string;
  paidDate?: string;
  tax?: number;
  total?: number;
  paymentMethod?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export default function InvoicesPage() {
  const { user, session, isLoading, error } = useAuth();
  const isHydrated = useIsClient();
  
  const [invoices, setInvoices] = useState<ExtendedInvoice[]>([
    {
      id: 'INV001',
      invoiceNumber: 'INV-2024-001',
      store: 'متجر مواد البناء المتقدمة',
      orderId: 'ORD001',
      issueDate: '2024-01-15',
      dueDate: '2024-01-30',
      paidDate: '2024-01-17',
      status: 'paid',
      amount: 675,
      tax: 101.25,
      total: 776.25,
      paymentMethod: 'بطاقة ائتمان',
      items: [
        { description: 'أسمنت أبيض - 25 كيس', quantity: 25, unitPrice: 15, total: 375 },
        { description: 'رمل ناعم - 5 متر مكعب', quantity: 5, unitPrice: 60, total: 300 }
      ]
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2024-002',
      store: 'معرض الأدوات الصحية',
      orderId: 'ORD002',
      issueDate: '2024-03-10',
      dueDate: '2024-03-25',
      paidDate: '2024-03-12',
      status: 'paid',
      amount: 1130,
      tax: 169.5,
      total: 1299.5,
      paymentMethod: 'تحويل بنكي',
      items: [
        { description: 'مضخة مياه متوسطة القدرة', quantity: 1, unitPrice: 850, total: 850 },
        { description: 'أنابيب PVC - 6 بوصة', quantity: 10, unitPrice: 28, total: 280 }
      ]
    },
    {
      id: 'INV003',
      invoiceNumber: 'INV-2024-003',
      store: 'متجر الكهربائيات المنزلية',
      orderId: 'ORD003',
      issueDate: '2024-03-20',
      dueDate: '2024-04-04',
      status: 'pending',
      amount: 322,
      tax: 48.3,
      total: 370.3,
      items: [
        { description: 'مفاتيح كهربائية متنوعة', quantity: 15, unitPrice: 12, total: 180 },
        { description: 'كابلات كهربائية - 100 متر', quantity: 2, unitPrice: 71, total: 142 }
      ]
    },
    {
      id: 'INV004',
      invoiceNumber: 'INV-2024-004',
      store: 'مستودع الحديد والأجهزة',
      orderId: 'ORD004',
      issueDate: '2024-02-28',
      dueDate: '2024-03-15',
      status: 'overdue',
      amount: 1600,
      tax: 240,
      total: 1840,
      items: [
        { description: 'حديد تسليح - 12 ملم', quantity: 20, unitPrice: 65, total: 1300 },
        { description: 'أسلاك ربط', quantity: 10, unitPrice: 30, total: 300 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'paid': return <FileText className="w-5 h-5 text-green-600" />;
      case 'overdue': return <FileText className="w-5 h-5 text-red-600" />;
      case 'cancelled': return <FileText className="w-5 h-5 text-gray-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'معلقة';
      case 'paid': return 'مدفوعة';
      case 'overdue': return 'متأخرة';
      case 'cancelled': return 'ملغاة';
      default: return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    // Find the invoice
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Create a detailed invoice view window
    const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
    if (!invoiceWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          .items-table th { background-color: #f5f5f5; }
          .totals { margin-right: auto; width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .final-total { border-top: 2px solid #333; font-weight: bold; font-size: 1.2em; }
          .status { padding: 5px 10px; border-radius: 20px; color: white; }
          .status.paid { background-color: #10b981; }
          .status.pending { background-color: #f59e0b; }
          .status.overdue { background-color: #ef4444; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>فاتورة رقم: ${invoice.invoiceNumber}</h1>
          <h2>منصة بنا للإنشاءات</h2>
        </div>
        
        <div class="invoice-details">
          <div>
            <h3>تفاصيل المتجر:</h3>
            <p><strong>${invoice.store}</strong></p>
            ${invoice.orderId ? `<p>رقم الطلب: ${invoice.orderId}</p>` : ''}
          </div>
          <div>
            <h3>تفاصيل الفاتورة:</h3>
            <p>تاريخ الإصدار: ${formatDateSafe(invoice.issueDate, { format: 'medium' })}</p>
            <p>تاريخ الاستحقاق: ${formatDateSafe(invoice.dueDate, { format: 'medium' })}</p>
            ${invoice.paidDate ? `<p>تاريخ الدفع: ${formatDateSafe(invoice.paidDate, { format: 'medium' })}</p>` : ''}
            <p>الحالة: <span class="status ${invoice.status}">${getStatusText(invoice.status)}</span></p>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>الوصف</th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${formatNumberSafe(item.unitPrice)} ر.س</td>
                <td>${formatNumberSafe(item.total)} ر.س</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>المبلغ:</span>
            <span>${formatNumberSafe(invoice.amount)} ر.س</span>
          </div>
          <div class="total-row">
            <span>الضريبة (15%):</span>
            <span>${formatNumberSafe(invoice.tax || 0)} ر.س</span>
          </div>
          <div class="total-row final-total">
            <span>الإجمالي:</span>
            <span>${formatNumberSafe(invoice.total || invoice.amount)} ر.س</span>
          </div>
        </div>

        ${invoice.paymentMethod ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f0fdf4; border-radius: 5px;">
            <strong>طريقة الدفع:</strong> ${invoice.paymentMethod}
          </div>
        ` : ''}
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Find the invoice
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    try {
      // Create HTML content for PDF generation
      const pdfHTML = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>فاتورة ${invoice.invoiceNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              direction: rtl; 
              font-size: 14px;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 20px;
              border-radius: 8px;
            }
            .company-name {
              color: #2563eb;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .invoice-title {
              font-size: 24px;
              color: #374151;
              margin-bottom: 10px;
            }
            .invoice-details { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px; 
              margin-bottom: 40px; 
            }
            .detail-section {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .detail-section h3 {
              color: #374151;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 30px; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .items-table th, .items-table td { 
              border: 1px solid #d1d5db; 
              padding: 12px 8px; 
              text-align: right; 
            }
            .items-table th { 
              background-color: #2563eb; 
              color: white;
              font-weight: bold;
            }
            .items-table tbody tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .totals { 
              margin-right: auto; 
              width: 350px; 
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px solid #e5e7eb;
            }
            .final-total { 
              border-top: 3px solid #2563eb; 
              font-weight: bold; 
              font-size: 18px;
              color: #2563eb;
              margin-top: 10px;
              padding-top: 10px;
            }
            .status { 
              padding: 8px 16px; 
              border-radius: 20px; 
              color: white; 
              font-weight: bold;
              display: inline-block;
            }
            .status.paid { background-color: #10b981; }
            .status.pending { background-color: #f59e0b; }
            .status.overdue { background-color: #ef4444; }
            .payment-info {
              margin-top: 30px; 
              padding: 20px; 
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
              border-radius: 8px;
              border: 1px solid #bbf7d0;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .header { break-inside: avoid; }
              .items-table { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">منصة بنا للإنشاءات</div>
            <div class="invoice-title">فاتورة رقم: ${invoice.invoiceNumber}</div>
            <div style="color: #6b7280;">تاريخ الإصدار: ${formatDateSafe(invoice.issueDate)}</div>
          </div>
          
          <div class="invoice-details">
            <div class="detail-section">
              <h3>معلومات المتجر</h3>
              <p><strong>${invoice.store}</strong></p>
              ${invoice.orderId ? `<p><strong>رقم الطلب:</strong> ${invoice.orderId}</p>` : ''}
            </div>
            <div class="detail-section">
              <h3>تفاصيل الفاتورة</h3>
              <p><strong>تاريخ الاستحقاق:</strong> ${formatDateSafe(invoice.dueDate)}</p>
              ${invoice.paidDate ? `<p><strong>تاريخ الدفع:</strong> ${formatDateSafe(invoice.paidDate)}</p>` : ''}
              <p><strong>الحالة:</strong> <span class="status ${invoice.status}">${getStatusText(invoice.status)}</span></p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>الوصف</th>
                <th>الكمية</th>
                <th>سعر الوحدة (ر.س)</th>
                <th>الإجمالي (ر.س)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${formatNumberSafe(item.unitPrice)}</td>
                  <td>${formatNumberSafe(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>المبلغ الأساسي:</span>
              <span>${formatNumberSafe(invoice.amount)} ر.س</span>
            </div>
            <div class="total-row">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span>${formatNumberSafe(invoice.tax || 0)} ر.س</span>
            </div>
            <div class="total-row final-total">
              <span>المبلغ الإجمالي:</span>
              <span>${formatNumberSafe(invoice.total || invoice.amount)} ر.س</span>
            </div>
          </div>

          ${invoice.paymentMethod ? `
            <div class="payment-info">
              <h3 style="color: #065f46; margin-top: 0;">معلومات الدفع</h3>
              <p><strong>طريقة الدفع:</strong> ${invoice.paymentMethod}</p>
              <p><strong>حالة الدفع:</strong> ${getStatusText(invoice.status)}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>منصة بنا للإنشاءات - جميع الحقوق محفوظة © 2025</p>
            <p>للاستفسارات: support@binna.com | هاتف: +966 11 123 4567</p>
          </div>
        </body>
        </html>
      `;

      // Create a new window for PDF generation
      const pdfWindow = window.open('', '_blank', 'width=800,height=600');
      if (!pdfWindow) {
        alert('يرجى السماح بفتح النوافذ المنبثقة لتحميل PDF');
        return;
      }

      pdfWindow.document.write(pdfHTML);
      pdfWindow.document.close();

      // Add print functionality to generate PDF
      setTimeout(() => {
        pdfWindow.print();
        alert('تم فتح نافذة الطباعة. يمكنك حفظ الفاتورة كـ PDF من خيارات الطباعة.');
      }, 500);

    } catch (error) {
      alert('حدث خطأ أثناء إنشاء PDF. يرجى المحاولة مرة أخرى.');
    }
  };

  const handlePrintInvoice = (invoiceId: string) => {
    // Generate the same PDF content as download but focus on printing
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Use the same PDF generation logic as download
    handleDownloadInvoice(invoiceId);
    
    alert('تم فتح الفاتورة للطباعة. يمكنك طباعتها أو حفظها كـ PDF من نافذة الطباعة.');
  };

  const handlePayInvoice = (invoiceId: string) => {
    // Find the invoice
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Store invoice data in sessionStorage for payment page
    const paymentData = {
      type: 'invoice',
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.total || invoice.amount,
      description: `دفع فاتورة ${invoice.invoiceNumber} - ${invoice.store}`,
      dueDate: invoice.dueDate,
      store: invoice.store
    };

    sessionStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    
    // Redirect to payment channels page
    window.location.href = '/user/payment-channels';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          الفواتير
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة ومتابعة جميع فواتيرك ومدفوعاتك
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                {invoices.filter(i => i.status === 'pending').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">فواتير معلقة</Typography>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {invoices.filter(i => i.status === 'paid').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">فواتير مدفوعة</Typography>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-red-600">
                {invoices.filter(i => i.status === 'overdue').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">فواتير متأخرة</Typography>
            </div>
            <FileText className="w-8 h-8 text-red-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {formatNumberSafe(invoices.reduce((sum, i) => sum + (i.total || i.amount), 0))}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي المبلغ (ر.س)</Typography>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في الفواتير..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الفواتير</option>
          <option value="pending">معلقة</option>
          <option value="paid">مدفوعة</option>
          <option value="overdue">متأخرة</option>
          <option value="cancelled">ملغاة</option>
        </select>
      </div>

      {/* Invoices List */}
      <div className="grid gap-6">
        {filteredInvoices.map((invoice) => (
          <EnhancedCard key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(invoice.status)}
                  <div className="flex-1">
                    <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                      {invoice.invoiceNumber}
                    </Typography>
                    <div className="flex items-center gap-4 mt-1">
                      <Typography variant="caption" size="sm" className="text-gray-600 flex items-center gap-1">
                        <Store className="w-4 h-4" />
                        {invoice.store}
                      </Typography>
                      {invoice.orderId && (
                        <Typography variant="caption" size="sm" className="text-gray-600">
                          الطلب: {invoice.orderId}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>

                {/* Invoice Items */}
                <div className="mb-4">
                  <Typography variant="caption" size="sm" className="text-gray-600 mb-2">البنود:</Typography>
                  <div className="space-y-2">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <Typography variant="body" size="lg" weight="medium">{item.description}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">
                            {item.quantity} × {formatNumberSafe(item.unitPrice)} ر.س
                          </Typography>
                        </div>
                        <Typography variant="body" size="lg" weight="semibold" className="text-blue-600">
                          {formatNumberSafe(item.total)} ر.س
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الإصدار</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateSafe(invoice.issueDate)}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الاستحقاق</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateSafe(invoice.dueDate)}
                    </Typography>
                  </div>
                  
                  {invoice.paidDate && (
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الدفع</Typography>
                      <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateSafe(invoice.paidDate)}
                      </Typography>
                    </div>
                  )}
                </div>

                {invoice.paymentMethod && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <Typography variant="caption" size="sm" weight="medium" className="text-green-800">
                      طريقة الدفع: {invoice.paymentMethod}
                    </Typography>
                  </div>
                )}
              </div>

              {/* Invoice Totals & Actions */}
              <div className="lg:w-64">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography variant="caption" size="sm" className="text-gray-600">المبلغ:</Typography>
                      <Typography variant="caption" size="sm" weight="medium">{formatNumberSafe(invoice.amount)} ر.س</Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="caption" size="sm" className="text-gray-600">الضريبة:</Typography>
                      <Typography variant="caption" size="sm" weight="medium">{formatNumberSafe(invoice.tax || 0)} ر.س</Typography>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <Typography variant="body" size="lg" weight="semibold">الإجمالي:</Typography>
                      <Typography variant="body" size="lg" weight="bold" className="text-blue-600">{formatNumberSafe(invoice.total || invoice.amount)} ر.س</Typography>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleViewInvoice(invoice.id)}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 justify-center"
                  >
                    <Eye className="w-4 h-4" />
                    عرض الفاتورة
                  </Button>

                  <Button
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 justify-center"
                  >
                    <Download className="w-4 h-4" />
                    تحميل PDF
                  </Button>

                  <Button
                    onClick={() => handlePrintInvoice(invoice.id)}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 justify-center"
                  >
                    <Printer className="w-4 h-4" />
                    طباعة
                  </Button>

                  {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                    <Button
                      onClick={() => handlePayInvoice(invoice.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 justify-center"
                    >
                      <CreditCard className="w-4 h-4" />
                      دفع الفاتورة
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
            لا توجد فواتير
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-500">
            {searchTerm || statusFilter !== 'all' ? 'لم يتم العثور على فواتير تطابق البحث' : 'لم تستلم أي فواتير بعد'}
          </Typography>
        </div>
      )}
    </div>
  );
}



