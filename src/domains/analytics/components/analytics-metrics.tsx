// @ts-nocheck
import { Card, Heading, Text, ProgressBar } from "@medusajs/ui"
import { usePerformanceAnalytics } from "@/store/hooks/api/analytics"
import { LoadingSpinner } from "../common/loading-spinner"

interface AnalyticsMetricsProps {
  dateRange: { from: Date; to: Date }
}

export const AnalyticsMetrics = ({ dateRange }: AnalyticsMetricsProps) => {
  const { data: performance, isLoading, error } = usePerformanceAnalytics(dateRange)

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
        <Text className="text-red-500">Failed to load performance metrics</Text>
      </Card>
    )
  }

  const metrics = [
    {
      title: "Conversion Rate",
      value: performance?.conversionRate || 0,
      format: "percentage",
      description: "Orders completed vs total orders",
      target: 75, // Target conversion rate
    },
    {
      title: "Cancellation Rate", 
      value: performance?.cancellationRate || 0,
      format: "percentage",
      description: "Orders cancelled vs total orders",
      target: 10, // Target cancellation rate (lower is better)
      inverted: true,
    },
    {
      title: "Order Fulfillment",
      value: performance?.completedOrders || 0,
      total: performance?.totalOrders || 0,
      format: "fraction",
      description: "Completed orders out of total",
    },
  ]

  const formatValue = (value: number, format: string, total?: number) => {
    switch (format) {
      case "percentage":
        return `${value.toFixed(1)}%`
      case "fraction":
        return `${value} / ${total || 0}`
      default:
        return value.toString()
    }
  }

  const getProgressColor = (value: number, target: number, inverted: boolean = false) => {
    const ratio = value / target
    if (inverted) {
      // For inverted metrics (like cancellation rate), lower is better
      if (ratio <= 0.5) return "bg-green-500"
      if (ratio <= 0.8) return "bg-yellow-500"
      return "bg-red-500"
    } else {
      // For normal metrics, higher is better
      if (ratio >= 0.8) return "bg-green-500"
      if (ratio >= 0.6) return "bg-yellow-500"
      return "bg-red-500"
    }
  }

  return (
    <div>
      <Heading level="h2" className="mb-4">
        Performance Metrics
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-4">
            <div className="flex flex-col gap-3">
              <div>
                <Text weight="plus">{metric.title}</Text>
                <Text size="small" className="text-ui-fg-subtle">
                  {metric.description}
                </Text>
              </div>
              
              <div className="flex items-center gap-2">
                <Text size="xlarge" weight="plus">
                  {formatValue(metric.value, metric.format, metric.total)}
                </Text>
              </div>

              {metric.target && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Text size="small">Target: {metric.target}%</Text>
                    <Text 
                      size="small" 
                      className={
                        metric.inverted 
                          ? (metric.value <= metric.target ? "text-green-600" : "text-red-600")
                          : (metric.value >= metric.target ? "text-green-600" : "text-red-600")
                      }
                    >
                      {metric.inverted 
                        ? (metric.value <= metric.target ? "Good" : "Needs Improvement")
                        : (metric.value >= metric.target ? "Good" : "Needs Improvement")
                      }
                    </Text>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                        metric.value,
                        metric.target,
                        metric.inverted
                      )}`}
                      style={{
                        width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}





