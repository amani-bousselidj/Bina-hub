'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui'

export default function DashboardPage() {
  const [dashboardData] = useState({
    orders: [],
    products: [],
    warrantyClaims: []
  })
  
  const [selectedTab, setSelectedTab] = useState('overview')

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' },
    { key: 'warranty', label: 'Warranty Claims' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Store Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>New Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.orders?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.orders?.filter((o: any) => o?.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.orders?.reduce((sum: number, order: any) => sum + (order?.totalAmount || 0), 0).toLocaleString()} ر.س
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.products?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.products?.length === 0 ? (
                  <p className="text-gray-500">No products available</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.products?.map((product: any) => (
                      <div key={product?.id || Math.random()} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{product?.name || 'Unnamed Product'}</div>
                          <div className="text-sm text-gray-500">{product?.price || 0} ر.س</div>
                        </div>
                        <Badge variant={product?.inStock ? 'default' : 'destructive'}>
                          {product?.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.orders?.length === 0 ? (
                  <p className="text-gray-500">No orders available</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.orders?.map((order: any) => (
                      <div key={order?.id || Math.random()} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">Order #{order?.id || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{order?.totalAmount || 0} ر.س</div>
                        </div>
                        <div className="flex space-x-2">
                          {order?.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              Confirm
                            </Button>
                          )}
                          {order?.status === 'confirmed' && (
                            <Button size="sm" variant="outline">
                              Process
                            </Button>
                          )}
                          {order?.status === 'processing' && (
                            <Button size="sm" variant="outline">
                              Ship
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'warranty' && (
          <Card>
            <CardHeader>
              <CardTitle>Warranty Claims</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.warrantyClaims?.length === 0 ? (
                <p className="text-gray-500">No warranty claims available</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.warrantyClaims?.map((claim: any) => (
                    <div key={claim?.id || Math.random()} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Claim #{claim?.id || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{claim?.productName || 'Unknown Product'}</div>
                      </div>
                      <div className="flex space-x-2">
                        {claim?.status === 'submitted' && (
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}



