// MyFatoorah Payment Service
export interface FatoorahConfig {
  apiKey: string;
  baseUrl: string;
  isTestMode: boolean;
}

export interface PaymentRequest {
  invoiceAmount: number;
  currencyIso: string;
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
  displayCurrencyIso?: string;
  mobileCountryCode?: string;
  customerReference?: string;
  supplierCode?: string;
  language?: 'en' | 'ar';
  successUrl?: string;
  errorUrl?: string;
  callBackUrl?: string;
  userDefinedField?: string;
}

export interface PaymentResponse {
  isSuccess: boolean;
  message: string;
  validationErrors?: any[];
  data?: {
    invoiceId: number;
    invoiceURL: string;
    paymentMethods: PaymentMethod[];
  };
}

export interface PaymentMethod {
  paymentMethodId: number;
  paymentMethodAr: string;
  paymentMethodEn: string;
  paymentMethodCode: string;
  isDirectPayment: boolean;
  serviceCharge: number;
  totalAmount: number;
  currencyIso: string;
  imageUrl: string;
}

export interface PaymentStatus {
  invoiceId: number;
  invoiceStatus: string;
  invoiceReference: string;
  customerReference: string;
  createdDate: string;
  expiryDate: string;
  invoiceValue: number;
  paidAmount: number;
  dueAmount: number;
  invoiceDisplayValue: string;
  currencyIso: string;
  invoiceTransactions: PaymentTransaction[];
}

export interface PaymentTransaction {
  transactionDate: string;
  paymentGateway: string;
  referenceId: string;
  trackId: string;
  transactionId: string;
  paymentId: string;
  authorizationId: string;
  transactionStatus: string;
  transactionValue: string;
  customerServiceCharge: string;
  dueValue: string;
  paidCurrency: string;
  paidCurrencyValue: string;
  currency: string;
  error: string;
  cardNumber: string;
  errorCode: string;
}

export interface CallbackData {
  paymentId: string;
  invoiceId: string;
  invoiceStatus: string;
  invoiceReference: string;
  customerReference: string;
  invoiceValue: number;
  paidAmount: number;
  dueAmount: number;
  currencyIso: string;
  focusTransaction: PaymentTransaction;
}

class FatoorahService {
  private config: FatoorahConfig;

  constructor() {
    this.config = {
      apiKey: process.env.FATOORAH_API_KEY || '',
      baseUrl: process.env.FATOORAH_BASE_URL || 'https://apitest.myfatoorah.com',
      isTestMode: process.env.NODE_ENV !== 'production'
    };
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(data && { body: JSON.stringify(data) })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fatoorah API request failed:', error);
      throw error;
    }
  }

  // Create payment invoice
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.makeRequest('/v2/SendPayment', 'POST', paymentData);
      return response;
    } catch (error) {
      console.error('Failed to create payment:', error);
      return {
        isSuccess: false,
        message: 'Failed to create payment',
        validationErrors: [{ error: error instanceof Error ? error.message : 'Unknown error' }]
      };
    }
  }

  // Get payment methods
  async getPaymentMethods(invoiceAmount: number, currencyIso: string = 'KWD'): Promise<PaymentMethod[]> {
    try {
      const response = await this.makeRequest('/v2/InitiatePayment', 'POST', {
        InvoiceAmount: invoiceAmount,
        CurrencyIso: currencyIso
      });

      if (response.IsSuccess) {
        return response.Data.PaymentMethods || [];
      }

      return [];
    } catch (error) {
      console.error('Failed to get payment methods:', error);
      return [];
    }
  }

  // Execute payment
  async executePayment(data: {
    invoiceValue: number;
    paymentMethodId: number;
    customerName: string;
    customerEmail: string;
    customerMobile?: string;
    displayCurrencyIso?: string;
    callBackUrl?: string;
    errorUrl?: string;
    language?: 'en' | 'ar';
  }): Promise<PaymentResponse> {
    try {
      const response = await this.makeRequest('/v2/ExecutePayment', 'POST', {
        InvoiceValue: data.invoiceValue,
        PaymentMethodId: data.paymentMethodId,
        CustomerName: data.customerName,
        CustomerEmail: data.customerEmail,
        CustomerMobile: data.customerMobile,
        DisplayCurrencyIso: data.displayCurrencyIso || 'KWD',
        CallBackUrl: data.callBackUrl,
        ErrorUrl: data.errorUrl,
        Language: data.language || 'en'
      });

      return response;
    } catch (error) {
      console.error('Failed to execute payment:', error);
      return {
        isSuccess: false,
        message: 'Failed to execute payment'
      };
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus | null> {
    try {
      const response = await this.makeRequest(`/v2/getPaymentStatus?Key=${paymentId}&KeyType=PaymentId`);
      
      if (response.IsSuccess) {
        return response.Data;
      }

      return null;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return null;
    }
  }

  // Handle callback
  async handleCallback(callbackData: any): Promise<CallbackData | null> {
    try {
      // Validate callback data
      if (!callbackData.paymentId) {
        throw new Error('Invalid callback data: missing paymentId');
      }

      // Get payment status to verify
      const paymentStatus = await this.getPaymentStatus(callbackData.paymentId);
      
      if (!paymentStatus) {
        throw new Error('Unable to verify payment status');
      }

      return {
        paymentId: callbackData.paymentId,
        invoiceId: paymentStatus.invoiceId.toString(),
        invoiceStatus: paymentStatus.invoiceStatus,
        invoiceReference: paymentStatus.invoiceReference,
        customerReference: paymentStatus.customerReference,
        invoiceValue: paymentStatus.invoiceValue,
        paidAmount: paymentStatus.paidAmount,
        dueAmount: paymentStatus.dueAmount,
        currencyIso: paymentStatus.currencyIso,
        focusTransaction: paymentStatus.invoiceTransactions[0] || {} as PaymentTransaction
      };
    } catch (error) {
      console.error('Failed to handle callback:', error);
      return null;
    }
  }

  // Cancel payment
  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('/v2/CancelToken', 'POST', {
        Key: paymentId,
        KeyType: 'PaymentId'
      });

      return response.IsSuccess || false;
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      return false;
    }
  }

  // Refund payment
  async refundPayment(data: {
    paymentId: string;
    refundAmount: number;
    refundReason: string;
    customerEmail?: string;
  }): Promise<boolean> {
    try {
      const response = await this.makeRequest('/v2/MakeRefund', 'POST', {
        Key: data.paymentId,
        KeyType: 'PaymentId',
        RefundChargeOnCustomer: false,
        ServiceChargeOnCustomer: false,
        Amount: data.refundAmount,
        Comment: data.refundReason
      });

      return response.IsSuccess || false;
    } catch (error) {
      console.error('Failed to refund payment:', error);
      return false;
    }
  }

  // Get invoice link
  async getInvoiceLink(invoiceId: number): Promise<string | null> {
    try {
      const response = await this.makeRequest(`/v2/GetDirectPaymentGateway/${invoiceId}`);
      
      if (response.IsSuccess && response.Data) {
        return response.Data.PaymentURL;
      }

      return null;
    } catch (error) {
      console.error('Failed to get invoice link:', error);
      return null;
    }
  }

  // Validate webhook signature
  validateWebhookSignature(payload: string, signature: string): boolean {
    try {
      // In real implementation, use proper signature validation
      // This is a mock implementation
      const expectedSignature = 'mock_signature';
      return signature === expectedSignature;
    } catch (error) {
      console.error('Failed to validate webhook signature:', error);
      return false;
    }
  }

  // Get supported currencies
  async getSupportedCurrencies(): Promise<string[]> {
    try {
      return ['KWD', 'SAR', 'AED', 'QAR', 'BHD', 'OMR', 'JOD', 'EGP', 'USD', 'EUR'];
    } catch (error) {
      console.error('Failed to get supported currencies:', error);
      return ['KWD'];
    }
  }

  // Format amount for display
  formatAmount(amount: number, currency: string = 'KWD'): string {
    const currencyFormats: Record<string, { decimals: number; symbol: string }> = {
      'KWD': { decimals: 3, symbol: 'د.ك' },
      'SAR': { decimals: 2, symbol: '﷼' },
      'AED': { decimals: 2, symbol: 'د.إ' },
      'QAR': { decimals: 2, symbol: '﷼' },
      'USD': { decimals: 2, symbol: '$' },
      'EUR': { decimals: 2, symbol: '€' }
    };

    const format = currencyFormats[currency] || currencyFormats['KWD'];
    const formatted = amount.toFixed(format.decimals);
    
    return `${formatted} ${format.symbol}`;
  }
}

export { FatoorahService };
// Export singleton instance
export const fatoorahService = new FatoorahService();

export default fatoorahService;


