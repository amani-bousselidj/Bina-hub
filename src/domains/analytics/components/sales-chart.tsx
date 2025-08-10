// @ts-nocheck
import { Card, Heading, Text } from "@medusajs/ui"
import { useSalesAnalytics } from "@/store/hooks/api/analytics"
import { LoadingSpinner } from "../common/loading-spinner"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useState } from "react"

interface SalesChartProps {
  dateRange: { from: Date; to: Date }
}

export const SalesChart = ({ dateRange }: SalesChartProps) => {
  const [chartType, setChartType] = useState<"line" | "bar">("line")
  const { data: sales, isLoading, error } = useSalesAnalytics(dateRange)

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
        <Text className="text-red-500">Failed to load sales data</Text>
      </Card>
    )
  }

  const chartData = sales?.salesByDate?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    amount: item.amount / 100, // Convert from cents to dollars
    formattedAmount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(item.amount / 100),
  })) || []

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <Text size="small" weight="plus">{label}</Text>
          <Text size="small" className="text-blue-600">
            Sales: {payload[0].payload.formattedAmount}
          </Text>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h2">Sales Trends</Heading>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 text-sm rounded ${
              chartType === "line" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Line Chart
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-sm rounded ${
              chartType === "bar" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Bar Chart
          </button>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text size="small" className="text-ui-fg-subtle">Total Sales</Text>
            <Text size="large" weight="plus">
              {new Intl.NumberFormat("en-US", {
                style: "currency", 
                currency: "USD",
              }).format((sales?.totalSales || 0) / 100)}
            </Text>
          </div>
          <div>
            <Text size="small" className="text-ui-fg-subtle">Order Count</Text>
            <Text size="large" weight="plus">
              {sales?.orderCount || 0}
            </Text>
          </div>
          <div>
            <Text size="small" className="text-ui-fg-subtle">Avg. Daily Sales</Text>
            <Text size="large" weight="plus">
              {chartData.length > 0 
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(chartData.reduce((sum, item) => sum + item.amount, 0) / chartData.length)
                : "$0"
              }
            </Text>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}





