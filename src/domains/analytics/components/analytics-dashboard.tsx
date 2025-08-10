// @ts-nocheck
import { Card, Container, Heading, Text } from "@medusajs/ui"
import { useDashboardAnalytics } from "@/store/hooks/api/analytics"
import { LoadingSpinner } from "../common/loading-spinner"

interface AnalyticsDashboardProps {
  dateRange: { from: Date; to: Date }
}

export const AnalyticsDashboard = ({ dateRange }: AnalyticsDashboardProps) => {
  const { data: analytics, isLoading, error } = useDashboardAnalytics(dateRange)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <Text className="text-red-500">Failed to load analytics data</Text>
      </Card>
    )
  }

  const metrics = [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue,
      format: "currency",
      growth: analytics?.revenueGrowth,
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders,
      format: "number",
      growth: analytics?.ordersGrowth,
    },
    {
      title: "Total Customers",
      value: analytics?.totalCustomers,
      format: "number", 
      growth: analytics?.customersGrowth,
    },
    {
      title: "Average Order Value",
      value: analytics?.averageOrderValue,
      format: "currency",
    },
    {
      title: "Total Products",
      value: analytics?.totalProducts,
      format: "number",
    },
  ]

  const formatValue = (value: number | undefined, format: string) => {
    if (!value) return "0"
    
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value / 100) // Assuming values are in cents
      case "number":
        return new Intl.NumberFormat("en-US").format(value)
      default:
        return value.toString()
    }
  }

  const formatGrowth = (growth: number | undefined) => {
    if (growth === undefined) return null
    const sign = growth >= 0 ? "+" : ""
    const color = growth >= 0 ? "text-green-600" : "text-red-600"
    return (
      <Text size="small" className={color}>
        {sign}{growth.toFixed(1)}%
      </Text>
    )
  }

  return (
    <div>
      <Heading level="h2" className="mb-4">
        Overview
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-4">
            <div className="flex flex-col gap-1">
              <Text size="small" className="text-ui-fg-subtle">
                {metric.title}
              </Text>
              <div className="flex items-center gap-2">
                <Text size="xlarge" weight="plus">
                  {formatValue(metric.value, metric.format)}
                </Text>
                {formatGrowth(metric.growth)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}





