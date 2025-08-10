'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Loader2, Truck, Package, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface ShippingProvider {
  id: string;
  name: string;
  type: 'fedex' | 'ups' | 'dhl' | 'aramex' | 'local';
  status: 'active' | 'inactive' | 'testing';
  configuration: {
    apiKey?: string;
    accountNumber?: string;
    testMode: boolean;
  };
  supportedServices: string[];
  regions: string[];
  rates: {
    domestic: number;
    international: number;
    express: number;
  };
}

interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  provider: string;
  service: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'exception';
  origin: Address;
  destination: Address;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  cost: number;
  currency: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updates: TrackingUpdate[];
}

interface Address {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface TrackingUpdate {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

const ShippingLogisticsIntegration: React.FC = () => {
  const [providers, setProviders] = useState<ShippingProvider[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ShippingProvider | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    fetchProviders();
    fetchShipments();
  }, []);

  const fetchProviders = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProviders: ShippingProvider[] = [
        {
          id: 'fedex_1',
          name: 'FedEx',
          type: 'fedex',
          status: 'active',
          configuration: {
            testMode: false
          },
          supportedServices: ['Ground', 'Express', 'Overnight'],
          regions: ['US', 'CA', 'EU', 'GCC'],
          rates: {
            domestic: 9.99,
            international: 24.99,
            express: 19.99
          }
        },
        {
          id: 'aramex_1',
          name: 'Aramex',
          type: 'aramex',
          status: 'active',
          configuration: {
            testMode: false
          },
          supportedServices: ['Standard', 'Express', 'Same Day'],
          regions: ['GCC', 'MENA', 'ASIA'],
          rates: {
            domestic: 5.00,
            international: 15.00,
            express: 12.00
          }
        },
        {
          id: 'local_1',
          name: 'Local Delivery',
          type: 'local',
          status: 'testing',
          configuration: {
            testMode: true
          },
          supportedServices: ['Standard', 'Express', 'Same Day'],
          regions: ['KW'],
          rates: {
            domestic: 2.50,
            international: 0,
            express: 5.00
          }
        }
      ];
      setProviders(mockProviders);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const fetchShipments = async () => {
    try {
      // Mock data - replace with actual API call
      const mockShipments: Shipment[] = [
        {
          id: 'ship_1',
          orderId: 'ord_123',
          trackingNumber: 'FX123456789',
          provider: 'fedex_1',
          service: 'Express',
          status: 'in_transit',
          origin: {
            name: 'Store Warehouse',
            address1: '123 Business St',
            city: 'Kuwait City',
            postalCode: '12345',
            country: 'KW'
          },
          destination: {
            name: 'John Doe',
            address1: '456 Customer Ave',
            city: 'Salmiya',
            postalCode: '54321',
            country: 'KW'
          },
          weight: 2.5,
          dimensions: {
            length: 30,
            width: 20,
            height: 15
          },
          cost: 12.50,
          currency: 'KWD',
          estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          updates: [
            {
              timestamp: new Date().toISOString(),
              status: 'In Transit',
              location: 'Kuwait City Hub',
              description: 'Package is in transit to destination'
            },
            {
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: 'Picked Up',
              location: 'Store Warehouse',
              description: 'Package picked up from origin'
            }
          ]
        }
      ];
      setShipments(mockShipments);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (orderData: any) => {
    try {
      // Mock shipment creation
      console.log('Creating shipment for order:', orderData);
      await fetchShipments();
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  const trackShipment = async () => {
    if (!trackingNumber) return;
    
    try {
      // Mock tracking lookup
      console.log('Tracking shipment:', trackingNumber);
      // In real implementation, this would call the provider's tracking API
    } catch (error) {
      console.error('Failed to track shipment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'testing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'exception':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'exception':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShipmentStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_transit':
      case 'picked_up':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'exception':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
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
        <h1 className="text-2xl font-bold">Shipping & Logistics Integration</h1>
        <Button onClick={() => alert('Button clicked')}>
          <Truck className="h-4 w-4 mr-2" />
          Create Shipment
        </Button>
      </div>

      {/* Quick Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Track Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
            <Button onClick={trackShipment}>
              <MapPin className="h-4 w-4 mr-2" />
              Track
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Providers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{provider.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(provider.status)}
                  <Badge className={getStatusColor(provider.status)}>
                    {provider.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>Services:</strong> {provider.supportedServices.join(', ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Regions:</strong> {provider.regions.join(', ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Domestic Rate:</strong> {provider.rates.domestic} KWD
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      Configure
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => createShipment({ provider: provider.id })}
                    >
                      Create Shipment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getShipmentStatusIcon(shipment.status)}
                    <div>
                      <div className="font-medium">
                        Tracking: {shipment.trackingNumber}
                      </div>
                      <div className="text-sm text-gray-600">
                        Order: {shipment.orderId} • Service: {shipment.service}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">From:</div>
                    <div className="text-sm text-gray-600">
                      {shipment.origin.name}<br />
                      {shipment.origin.city}, {shipment.origin.country}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">To:</div>
                    <div className="text-sm text-gray-600">
                      {shipment.destination.name}<br />
                      {shipment.destination.city}, {shipment.destination.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>
                    Weight: {shipment.weight}kg • 
                    Cost: {shipment.currency} {shipment.cost}
                  </span>
                  {shipment.estimatedDelivery && (
                    <span className="text-gray-600">
                      ETA: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Tracking Updates */}
                {shipment.updates.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Recent Updates:</div>
                    <div className="space-y-2">
                      {shipment.updates.slice(0, 2).map((update, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <span className="font-medium">{update.status}</span>
                            <span className="text-gray-600"> • {update.location}</span>
                            <div className="text-gray-500">{update.description}</div>
                          </div>
                          <div className="text-gray-500">
                            {new Date(update.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Configuration Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Configure {selectedProvider.name}</CardTitle>
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
                  <label className="block text-sm font-medium mb-2">Account Number</label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter account number"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="testModeShipping" />
                  <label htmlFor="testModeShipping" className="text-sm">Test Mode</label>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setSelectedProvider(null)} variant="outline">
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

export default ShippingLogisticsIntegration;



