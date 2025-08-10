// @ts-nocheck
import { Card, Heading, Text, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Activity, Eye, Users, ShoppingCart, TrendingUp } from "@medusajs/icons"

interface RealTimeMetric {
  label: string
  value: number
  icon: React.ComponentType<any>
  color: string
  change?: number
  unit?: string
}

export const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    {
      label: "Active Users",
      value: 142,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      change: 5,
    },
    {
      label: "Page Views",
      value: 2340,
      icon: Eye,
      color: "bg-green-100 text-green-600",
      change: 12,
      unit: "/hour",
    },
    {
      label: "Active Carts",
      value: 28,
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-600",
      change: -3,
    },
    {
      label: "Conversion Rate",
      value: 3.2,
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      change: 0.5,
      unit: "%",
    },
    {
      label: "Server Load",
      value: 42,
      icon: Activity,
      color: "bg-yellow-100 text-yellow-600",
      change: -8,
      unit: "%",
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1),
          change: (Math.random() - 0.5) * 20,
        }))
      )
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const formatValue = (value: number, unit?: string) => {
    const roundedValue = Math.round(value * 10) / 10
    if (unit === "%") {
      return `${roundedValue}%`
    }
    if (unit === "/hour") {
      return `${Math.round(value)}/hr`
    }
    return Math.round(value).toString()
  }

  const formatChange = (change: number, unit?: string) => {
    const sign = change >= 0 ? "+" : ""
    const color = change >= 0 ? "text-green-600" : "text-red-600"
    const formattedChange = unit === "%" 
      ? `${sign}${change.toFixed(1)}%`
      : `${sign}${Math.round(change)}`
    
    return (
      <Text size="xsmall" className={color}>
        {formattedChange}
      </Text>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Heading level="h2">Real-Time Metrics</Heading>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Text size="small" className="text-ui-fg-subtle">Live</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon
          return (
            <Card key={metric.label} className="p-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Text size="small" className="text-ui-fg-subtle mb-1">
                    {metric.label}
                  </Text>
                  <div className="flex items-center gap-2 mb-1">
                    <Text size="xlarge" weight="plus">
                      {formatValue(metric.value, metric.unit)}
                    </Text>
                    {metric.change !== undefined && formatChange(metric.change, metric.unit)}
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              
              {/* Real-time indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            </Card>
          )
        })}
      </div>

      {/* Additional real-time insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Text size="small" weight="plus">Recent Activity</Text>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text size="small">New order #1247</Text>
              <Text size="xsmall" className="text-ui-fg-subtle">2 min ago</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text size="small">User registered</Text>
              <Text size="xsmall" className="text-ui-fg-subtle">5 min ago</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text size="small">Product viewed</Text>
              <Text size="xsmall" className="text-ui-fg-subtle">7 min ago</Text>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <Text size="small" weight="plus">Traffic Sources</Text>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text size="small">Direct</Text>
              <Badge size="small" color="blue">45%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text size="small">Search</Text>
              <Badge size="small" color="green">32%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text size="small">Social</Text>
              <Badge size="small" color="purple">23%</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <Text size="small" weight="plus">System Status</Text>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text size="small">API Response</Text>
              <Badge size="small" color="green">120ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text size="small">Database</Text>
              <Badge size="small" color="green">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text size="small">Cache Hit</Text>
              <Badge size="small" color="blue">94%</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}





