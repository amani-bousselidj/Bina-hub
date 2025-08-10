// @ts-nocheck
import { Card, Heading, Text, Badge } from "@medusajs/ui"
import { useCustomerAnalytics } from "@/store/hooks/api/analytics"
import { LoadingSpinner } from "../common/loading-spinner"
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Users, UserPlus, RefreshCw } from "@medusajs/icons"

interface CustomerAnalyticsProps {
  dateRange: { from: Date; to: Date }
}

export const CustomerAnalytics = ({ dateRange }: CustomerAnalyticsProps) => {
  const { data: customers, isLoading, error } = useCustomerAnalytics(dateRange)

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
        <Text className="text-red-500">Failed to load customer analytics</Text>
      </Card>
    )
  }

  const totalCustomers = (customers?.newCustomers || 0) + (customers?.returningCustomers || 0)
  
  const customerSegmentData = [
    {
      name: "New Customers",
      value: customers?.newCustomers || 0,
      color: "#3b82f6",
      percentage: totalCustomers > 0 ? ((customers?.newCustomers || 0) / totalCustomers * 100).toFixed(1) : 0,
    },
    {
      name: "Returning Customers", 
      value: customers?.returningCustomers || 0,
      color: "#10b981",
      percentage: totalCustomers > 0 ? ((customers?.returningCustomers || 0) / totalCustomers * 100).toFixed(1) : 0,
    },
  ]

  const chartData = customers?.customersByDate?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    count: item.count,
  })) || []

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <Text size="small" weight="plus">{label}</Text>
          <Text size="small" className="text-blue-600">
            New Customers: {payload[0].value}
          </Text>
        </div>
      )
    }
    return null
  }

  const retentionRate = customers?.customerRetentionRate || 0
  const retentionColor = retentionRate >= 60 ? "text-green-600" : retentionRate >= 40 ? "text-yellow-600" : "text-red-600"

  return (
    <div>
      <Heading level="h2" className="mb-4">
        Customer Analytics
      </Heading>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer metrics cards */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <Text size="small" className="text-ui-fg-subtle">Total Customers</Text>
                <Text size="xlarge" weight="plus">{totalCustomers}</Text>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <Text size="small" className="text-ui-fg-subtle">New Customers</Text>
                <Text size="xlarge" weight="plus">{customers?.newCustomers || 0}</Text>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <Text size="small" className="text-ui-fg-subtle">Retention Rate</Text>
                <div className="flex items-center gap-2">
                  <Text size="xlarge" weight="plus" className={retentionColor}>
                    {retentionRate.toFixed(1)}%
                  </Text>
                  <Badge 
                    size="small"
                    color={retentionRate >= 60 ? "green" : retentionRate >= 40 ? "yellow" : "red"}
                  >
                    {retentionRate >= 60 ? "Excellent" : retentionRate >= 40 ? "Good" : "Needs Work"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Customer segment pie chart */}
        <Card className="p-4">
          <Heading level="h3" className="mb-4">Customer Segments</Heading>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={customerSegmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {customerSegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Customers']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {customerSegmentData.map((segment) => (
              <div key={segment.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: segment.color }}
                  />
                  <Text size="small">{segment.name}</Text>
                </div>
                <Text size="small" weight="plus">
                  {segment.value} ({segment.percentage}%)
                </Text>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer acquisition chart */}
        <Card className="p-4">
          <Heading level="h3" className="mb-4">Customer Acquisition</Heading>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}





