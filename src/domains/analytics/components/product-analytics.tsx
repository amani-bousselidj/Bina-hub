// @ts-nocheck
import { Card, Heading, Text, Badge, Table } from "@medusajs/ui"
import { useProductAnalytics } from "@/store/hooks/api/analytics"
import { LoadingSpinner } from "../common/loading-spinner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Package, TrendingUp, AlertTriangle } from "@medusajs/icons"

interface ProductAnalyticsProps {
  dateRange: { from: Date; to: Date }
}

export const ProductAnalytics = ({ dateRange }: ProductAnalyticsProps) => {
  const { data: products, isLoading, error } = useProductAnalytics(dateRange)

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
        <Text className="text-red-500">Failed to load product analytics</Text>
      </Card>
    )
  }

  const topProductsChartData = products?.topProducts?.slice(0, 8).map(product => ({
    name: product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title,
    fullName: product.title,
    sales: product.sales / 100, // Convert from cents
    quantity: product.quantity,
    formattedSales: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.sales / 100),
  })) || []

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
          <Text size="small" weight="plus">{payload[0].payload.fullName}</Text>
          <Text size="small" className="text-blue-600">
            Sales: {payload[0].payload.formattedSales}
          </Text>
          <Text size="small" className="text-green-600">
            Quantity: {payload[0].payload.quantity}
          </Text>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <Heading level="h2" className="mb-4">
        Product Analytics
      </Heading>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Product metrics cards */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">Total Products</Text>
              <Text size="xlarge" weight="plus">{products?.totalProducts || 0}</Text>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">Best Seller</Text>
              <Text size="base" weight="plus" className="truncate">
                {products?.topProducts?.[0]?.title || "N/A"}
              </Text>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">Low Stock</Text>
              <div className="flex items-center gap-2">
                <Text size="xlarge" weight="plus">{products?.lowStockProducts || 0}</Text>
                {(products?.lowStockProducts || 0) > 0 && (
                  <Badge size="small" color="red">Alert</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <Text size="small" className="text-ui-fg-subtle">Top Product Revenue</Text>
            <Text size="xlarge" weight="plus">
              {products?.topProducts?.[0] 
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format((products.topProducts[0].sales || 0) / 100)
                : "$0"
              }
            </Text>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products chart */}
        <Card className="p-6">
          <Heading level="h3" className="mb-4">Top Products by Revenue</Heading>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={topProductsChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  stroke="#666"
                  fontSize={12}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sales" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top products table */}
        <Card className="p-6">
          <Heading level="h3" className="mb-4">Top Products Details</Heading>
          <div className="space-y-3">
            {products?.topProducts?.slice(0, 8).map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <Text size="small" weight="plus" className="truncate max-w-[200px]">
                      {product.title}
                    </Text>
                    <Text size="xsmall" className="text-ui-fg-subtle">
                      Sold: {product.quantity} units
                    </Text>
                  </div>
                </div>
                <div className="text-right">
                  <Text size="small" weight="plus">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.sales / 100)}
                  </Text>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    Revenue
                  </Text>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <Text className="text-ui-fg-subtle">No product data available</Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}





