'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Loader2, CreditCard, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'myfatoorah';
  status: 'active' | 'inactive' | 'pending' | 'error';
  configuration: {
    apiKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    testMode: boolean;
  };
  supportedMethods: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  regions: string[];
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway: string;
  orderId?: string;
  customerId?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

const PaymentGatewayIntegration: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);

  useEffect(() => {
    fetchGateways();
    fetchTransactions();
  }, []);

  const fetchGateways = async () => {
    try {
      // Mock data - replace with actual API call
      const mockGateways: PaymentGateway[] = [
        {
          id: 'stripe_1',
          name: 'Stripe',
          type: 'stripe',
          status: 'active',
          configuration: {
            testMode: false
          },
          supportedMethods: ['card', 'apple_pay', 'google_pay'],
          fees: {
            percentage: 2.9,
            fixed: 0.30,
            currency: 'USD'
          },
          regions: ['US', 'EU', 'CA']
        },
        {
          id: 'paypal_1',
          name: 'PayPal',
          type: 'paypal',
          status: 'active',
          configuration: {
            testMode: false
          },
          supportedMethods: ['paypal', 'card'],
          fees: {
            percentage: 3.49,
            fixed: 0,
            currency: 'USD'
          },
          regions: ['US', 'EU', 'CA', 'AU']
        },
        {
          id: 'myfatoorah_1',
          name: 'MyFatoorah',
          type: 'myfatoorah',
          status: 'pending',
          configuration: {
            testMode: true
          },
          supportedMethods: ['card', 'knet', 'benefit'],
          fees: {
            percentage: 2.5,
            fixed: 0,
            currency: 'KWD'
          },
          regions: ['KW', 'SA', 'AE', 'BH']
        }
      ];
      setGateways(mockGateways);
    } catch (error) {
      console.error('Failed to fetch gateways:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTransactions: PaymentTransaction[] = [
        {
          id: 'txn_1',
          amount: 150.00,
          currency: 'USD',
          status: 'completed',
          gateway: 'stripe_1',
          orderId: 'ord_123',
          customerId: 'cust_456',
          createdAt: new Date().toISOString()
        },
        {
          id: 'txn_2',
          amount: 89.99,
          currency: 'USD',
          status: 'pending',
          gateway: 'paypal_1',
          orderId: 'ord_124',
          customerId: 'cust_789',
          createdAt: new Date().toISOString()
        }
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const toggleGatewayStatus = async (gatewayId: string) => {
    setGateways(gateways.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, status: gateway.status === 'active' ? 'inactive' : 'active' }
        : gateway
    ));
  };

  const configureGateway = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Gateway Integration</h1>
        <Button onClick={() => alert('Button clicked')}>
          <CreditCard className="h-4 w-4 mr-2" />
          Add Gateway
        </Button>
      </div>

      {/* Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{gateway.name}</CardTitle>
              <div className="flex items-center space-x-2">
                {getStatusIcon(gateway.status)}
                <Badge className={getStatusColor(gateway.status)}>
                  {gateway.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Type:</strong> {gateway.type}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Fee:</strong> {gateway.fees.percentage}% + {gateway.fees.currency} {gateway.fees.fixed}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Methods:</strong> {gateway.supportedMethods.join(', ')}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Regions:</strong> {gateway.regions.join(', ')}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => configureGateway(gateway)}
                  >
                    Configure
                  </Button>
                  <Button 
                    size="sm" 
                    variant={gateway.status === 'active' ? 'destructive' : 'default'}
                    onClick={() => toggleGatewayStatus(gateway.id)}
                  >
                    {gateway.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Order: {transaction.orderId}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gateway Configuration Modal */}
      {selectedGateway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Configure {selectedGateway.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input 
                    type="password"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter API key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secret Key</label>
                  <input 
                    type="password"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter secret key"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="testMode" />
                  <label htmlFor="testMode" className="text-sm">Test Mode</label>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setSelectedGateway(null)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={() => alert('Button clicked')}>Save Configuration</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewayIntegration;



