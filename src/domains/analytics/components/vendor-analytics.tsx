// @ts-nocheck
import { Card, Heading, Text, Badge, Select } from "@medusajs/ui"
import { useVendorAnalytics } from "@/store/hooks/api/analytics"
import { LoadingSpinner } from "../common/loading-spinner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Store, TrendingUp, DollarSign, ShoppingBag } from "@medusajs/icons"
import { useState } from "react"

interface VendorAnalyticsProps {
  dateRange: { from: Date; to: Date }
}

export const VendorAnalytics = ({ dateRange }: VendorAnalyticsProps) => {
  const [selectedVendor, setSelectedVendor] = useState<string>("")
  const { data: vendorData, isLoading, error } = useVendorAnalytics(selectedVendor, dateRange)

  // Mock vendor data for demonstration - in real implementation, this would come from API
  const mockVendors = [
    { id: "vendor_1", name: "TechStore Pro", revenue: 45000, orders: 89, commission: 4500 },
    { id: "vendor_2", name: "Fashion Hub", revenue: 32000, orders: 156, commission: 3200 },
    { id: "vendor_3", name: "Home & Garden", revenue: 28000, orders: 67, commission: 2800 },
    { id: "vendor_4", name: "Sports World", revenue: 22000, orders: 45, commission: 2200 },
    { id: "vendor_5", name: "Books & More", revenue: 18000, orders: 234, commission: 1800 },
  ]

  const vendorPerformanceData = mockVendors.map(vendor => ({
    name: vendor.name,
    revenue: vendor.revenue / 100, // Convert from cents
    orders: vendor.orders,
    commission: vendor.commission / 100,
    avgOrderValue: vendor.orders > 0 ? (vendor.revenue / vendor.orders) / 100 : 0,
  }))

  const revenueDistribution = mockVendors.map((vendor, index) => ({
    name: vendor.name,
    value: vendor.revenue / 100,
    color: `hsl(${index * 72}, 70%, 50%)`,
  }))

  const totalMarketplaceRevenue = mockVendors.reduce((sum, vendor) => sum + vendor.revenue, 0)
  const totalMarketplaceOrders = mockVendors.reduce((sum, vendor) => sum + vendor.orders, 0)
  const totalCommissions = mockVendors.reduce((sum, vendor) => sum + vendor.commission, 0)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <Text className="text-red-500">Failed to load vendor analytics</Text>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <Text size="small" weight="plus">{label}</Text>
          {payload.map((entry: any, index: number) => (
            <Text key={index} size="small" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' || entry.name === 'commission' 
                ? `$${entry.value.toFixed(2)}` 
                : entry.value
              }
            </Text>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h2">Marketplace & Vendor Analytics</Heading>
        <Select value={selectedVendor} onValueChange={setSelectedVendor}>
          <Select.Trigger className="w-48">
            <Select.Value placeholder="All Vendors" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="">All Vendors</Select.Item>
            {mockVendors.map((vendor) => (
              <Select.Item key={vendor.id} value={vendor.id}>
                {vendor.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {/* Marketplace overview metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">Active Vendors</Text>
              <Text size="xlarge" weight="plus">{mockVendors.length}</Text>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">Total Revenue</Text>
              <Text size="xlarge" weight="plus">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalMarketplaceRevenue / 100)}
              </Text>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">Total Orders</Text>
              <Text size="xlarge" weight="plus">{totalMarketplaceOrders}</Text>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">Commissions</Text>
              <Text size="xlarge" weight="plus">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalCommissions / 100)}
              </Text>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor performance chart */}
        <Card className="p-6">
          <Heading level="h3" className="mb-4">Vendor Performance</Heading>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={vendorPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue distribution pie chart */}
        <Card className="p-6">
          <Heading level="h3" className="mb-4">Revenue Distribution</Heading>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={revenueDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Vendor details table */}
      <Card className="p-6 mt-6">
        <Heading level="h3" className="mb-4">Vendor Details</Heading>
        <div className="space-y-3">
          {mockVendors.map((vendor, index) => (
            <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <Text weight="plus">{vendor.name}</Text>
                  <Text size="small" className="text-ui-fg-subtle">
                    {vendor.orders} orders • Avg: ${((vendor.revenue / vendor.orders) / 100).toFixed(2)}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <Text size="small" className="text-ui-fg-subtle">Revenue</Text>
                  <Text weight="plus">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(vendor.revenue / 100)}
                  </Text>
                </div>
                <div className="text-right">
                  <Text size="small" className="text-ui-fg-subtle">Commission</Text>
                  <Text weight="plus" className="text-green-600">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(vendor.commission / 100)}
                  </Text>
                </div>
                <Badge color="green">Active</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}





