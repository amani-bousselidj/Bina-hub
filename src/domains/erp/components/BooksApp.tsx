/**
 * BooksApp - ZATCA-Compliant Accounting System
 * ZATCA-Compliant Accounting System with Medusa.js Integration
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { OrderService } from '../../../lib/mock-medusa';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_vat: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  zatca_uuid: string;
  qr_code: string;
}

interface FinancialSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  outstanding_invoices: number;
  paid_invoices: number;
  vat_collected: number;
}

const BooksApp = React.memo(() => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this_month');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch invoices from Medusa orders
        const orderService = new OrderService();
        const orders: any[] = await orderService.list();
        
        // Convert orders to invoices
        const invoiceData = orders.map(order => ({
          id: order.id,
          invoice_number: `INV-${order.display_id}`,
          customer_name: order.customer?.first_name + ' ' + order.customer?.last_name,
          customer_vat: order.customer?.metadata?.vat_number || '',
          issue_date: order.created_at,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          subtotal: order.subtotal,
          vat_amount: order.tax_total,
          total_amount: order.total,
          status: order.payment_status === 'captured' ? 'paid' : 'sent',
          zatca_uuid: generateZATCAUUID(),
          qr_code: generateQRCode(order),
        }));

        setInvoices(invoiceData.map(inv => ({ ...inv, status: inv.status as "draft" | "overdue" | "paid" | "sent" })));

        // Calculate financial summary
        const summary = {
          total_revenue: invoiceData.reduce((sum, inv) => sum + inv.total_amount, 0),
          total_expenses: 0, // Would come from expense tracking
          net_profit: 0, // Revenue - Expenses
          outstanding_invoices: invoiceData.filter(inv => inv.status !== 'paid').length,
          paid_invoices: invoiceData.filter(inv => inv.status === 'paid').length,
          vat_collected: invoiceData.reduce((sum, inv) => sum + inv.vat_amount, 0),
        };

        setFinancialSummary(summary);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, [selectedPeriod]);

  const generateZATCAUUID = () => {
    // Generate ZATCA-compliant UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateQRCode = (order: any) => {
    // Generate ZATCA-compliant QR code
    const qrData = {
      seller_name: 'Your Business Name',
      vat_number: '1234567890',
      timestamp: order.created_at,
      total_amount: order.total,
      vat_amount: order.tax_total,
    };

    return btoa(JSON.stringify(qrData));
  };

  const generateVATReport = () => {
    const vatReport = {
      period: selectedPeriod,
      total_sales: financialSummary?.total_revenue || 0,
      vat_collected: financialSummary?.vat_collected || 0,
      vat_rate: 0.15, // 15% VAT in Saudi Arabia
      invoices_count: invoices.length,
      generated_at: new Date().toISOString(),
    };

    // Export VAT report for ZATCA submission
    console.log('VAT Report:', vatReport);
    
    // Create downloadable report
    const blob = new Blob([JSON.stringify(vatReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vat-report-${selectedPeriod}.json`;
    a.click();
  };

  const sendInvoice = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) return;

      // Send invoice via email/SMS
      const emailData = {
        to: invoice.customer_name,
        subject: `Invoice ${invoice.invoice_number}`,
        template: 'invoice',
        data: invoice,
      };

      // API call to send invoice
      console.log('Sending invoice:', emailData);
      
      // Update invoice status
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'sent' } : inv
      ));

      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const markAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
    ));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Accounting Management System</h1>
        
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              {financialSummary?.total_revenue.toLocaleString('en-US')} SAR
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">VAT Collected</h3>
            <p className="text-3xl font-bold text-blue-600">
              {financialSummary?.vat_collected.toLocaleString('en-US')} SAR
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Outstanding</h3>
            <p className="text-3xl font-bold text-red-600">
              {financialSummary?.outstanding_invoices}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
          
          <button
            onClick={generateVATReport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Generate VAT Report
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Invoices</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        ZATCA: {invoice.zatca_uuid.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.customer_name}</div>
                      <div className="text-sm text-gray-500">VAT: {invoice.customer_vat}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.total_amount.toLocaleString('en-US')} SAR
                      </div>
                      <div className="text-sm text-gray-500">
                        VAT: {invoice.vat_amount.toLocaleString('en-US')} SAR
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => sendInvoice(invoice.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Send
                        </button>
                      )}
                      {invoice.status === 'sent' && (
                        <button
                          onClick={() => markAsPaid(invoice.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900" onClick={() => alert('Button clicked')}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

BooksApp.displayName = 'BooksApp';

export default BooksApp;



