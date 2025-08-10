'use client'

// Force dynamic rendering to avoid SSG auth context issues
export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import MarketAnalytics from '@/domains/analytics/components/MarketAnalytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/Progress'
import { 

  Brain, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Eye,
  Heart,
  Star
} from 'lucide-react'

// AI Analytics Dashboard Component

interface AIInsight {
  id: string
  type: 'recommendation' | 'prediction' | 'alert' | 'opportunity'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  category: string
  actionable: boolean
}

interface MarketTrend {
  market: string
  growth: number
  volume: number
  topCategories: string[]
  predictions: {
    nextMonth: number
    nextQuarter: number
  }
}

interface CustomerSegment {
  name: string
  size: number
  avgSpend: number
  growth: number
  characteristics: string[]
  recommendedActions: string[]
}

export default function AIAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('insights')
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([])
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAIAnalytics = async () => {
      try {
        // Mock AI-generated insights
        const mockInsights: AIInsight[] = [
          {
            id: '1',
            type: 'recommendation',
            title: 'Optimize UAE Market Pricing Strategy',
            description: 'AI analysis suggests reducing construction material prices by 8-12% in Dubai market to increase volume by 35%',
            confidence: 92,
            impact: 'high',
            category: 'Pricing',
            actionable: true
          },
          {
            id: '2',
            type: 'prediction',
            title: 'Kuwait Market Surge Expected',
            description: 'Predictive models indicate 45% growth in oil sector procurement during Q4 2025',
            confidence: 87,
            impact: 'high',
            category: 'Market Growth',
            actionable: true
          },
          {
            id: '3',
            type: 'alert',
            title: 'Seasonal Inventory Adjustment Needed',
            description: 'Summer construction materials inventory should be increased by 25% based on weather patterns',
            confidence: 94,
            impact: 'medium',
            category: 'Inventory',
            actionable: true
          },
          {
            id: '4',
            type: 'opportunity',
            title: 'Qatar Luxury Segment Expansion',
            description: 'Untapped opportunity in premium construction materials market worth $2.3M potential revenue',
            confidence: 78,
            impact: 'high',
            category: 'Market Expansion',
            actionable: true
          }
        ]

        const mockTrends: MarketTrend[] = [
          {
            market: 'Saudi Arabia',
            growth: 28.5,
            volume: 15750000,
            topCategories: ['Construction Materials', 'Industrial Equipment', 'Electronics'],
            predictions: { nextMonth: 32.1, nextQuarter: 35.8 }
          },
          {
            market: 'UAE',
            growth: 45.2,
            volume: 4200000,
            topCategories: ['Luxury Goods', 'Real Estate', 'Technology'],
            predictions: { nextMonth: 48.7, nextQuarter: 52.3 }
          },
          {
            market: 'Kuwait',
            growth: 32.1,
            volume: 1800000,
            topCategories: ['Oil Industry', 'Automotive', 'Home & Garden'],
            predictions: { nextMonth: 35.6, nextQuarter: 41.2 }
          },
          {
            market: 'Qatar',
            growth: 38.7,
            volume: 1950000,
            topCategories: ['Construction', 'Sports Infrastructure', 'Tourism'],
            predictions: { nextMonth: 42.1, nextQuarter: 46.8 }
          }
        ]

        const mockSegments: CustomerSegment[] = [
          {
            name: 'Large Construction Companies',
            size: 1250,
            avgSpend: 45000,
            growth: 22.5,
            characteristics: ['Bulk orders', 'Long-term contracts', 'Price sensitive'],
            recommendedActions: ['Volume discounts', 'Extended payment terms', 'Dedicated account management']
          },
          {
            name: 'Individual Contractors',
            size: 8500,
            avgSpend: 2800,
            growth: 35.2,
            characteristics: ['Frequent orders', 'Quality focused', 'Quick delivery needs'],
            recommendedActions: ['Loyalty programs', 'Express delivery', 'Quality assurance']
          },
          {
            name: 'Government Projects',
            size: 85,
            avgSpend: 180000,
            growth: 18.7,
            characteristics: ['Compliance critical', 'Large orders', 'Documentation heavy'],
            recommendedActions: ['Compliance certification', 'Dedicated support', 'Process automation']
          }
        ]

        setAiInsights(mockInsights)
        setMarketTrends(mockTrends)
        setCustomerSegments(mockSegments)
        setLoading(false)
      } catch (error) {
        console.error('Failed to initialize AI analytics:', error)
        setLoading(false)
      }
    }

    initializeAIAnalytics()
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Target className="h-4 w-4" />
      case 'prediction': return <TrendingUp className="h-4 w-4" />
      case 'alert': return <AlertCircle className="h-4 w-4" />
      case 'opportunity': return <Zap className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'prediction': return 'bg-green-50 border-green-200 text-green-800'
      case 'alert': return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'opportunity': return 'bg-purple-50 border-purple-200 text-purple-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-8 w-8 animate-pulse mx-auto mb-4" />
            <p>جارٍ تحميل تحليلات الذكاء الاصطناعي...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8" />
            تحليلات مدعومة بالذكاء الاصطناعي
          </h1>
          <p className="text-muted-foreground">رؤى التعلم الآلي المتقدمة لتحسين أسواق دول الخليج</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            <Activity className="h-4 w-4 ml-2" />
            البيانات المباشرة
          </Button>
          <Button onClick={() => alert('Button clicked')}>
            <BarChart3 className="h-4 w-4 ml-2" />
            إنشاء تقرير
          </Button>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">دقة التنبؤ</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Last 30 days average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights Generated</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+$2.3M</div>
            <p className="text-xs text-muted-foreground">From AI recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">ML models running</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight) => (
              <Card key={insight.id} className={getInsightColor(insight.type)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="outline">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{insight.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Actionable
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      {insight.actionable && (
                        <Button size="sm" onClick={() => alert('Button clicked')}>
                          Implement
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Confidence Level</span>
                      <span>{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketTrends.map((trend) => (
              <Card key={trend.market}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {trend.market} Market
                    <Badge variant={trend.growth > 30 ? 'default' : 'secondary'}>
                      {trend.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {trend.growth > 0 ? '+' : ''}{trend.growth}%
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Current volume: ${(trend.volume / 1000000).toFixed(1)}M
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Top Categories:</p>
                    <div className="flex flex-wrap gap-1">
                      {trend.topCategories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Next Month</p>
                      <p className="font-semibold text-green-600">+{trend.predictions.nextMonth}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Quarter</p>
                      <p className="font-semibold text-green-600">+{trend.predictions.nextQuarter}%</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Growth Momentum</span>
                      <span>{trend.growth}%</span>
                    </div>
                    <Progress value={Math.min(trend.growth, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{segment.name}</CardTitle>
                      <CardDescription>
                        {segment.size.toLocaleString('en-US')} customers • Average spend: ${segment.avgSpend.toLocaleString('en-US')}
                      </CardDescription>
                    </div>
                    <Badge variant={segment.growth > 25 ? 'default' : 'secondary'}>
                      {segment.growth > 0 ? '+' : ''}{segment.growth}% growth
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Characteristics:</p>
                      <ul className="space-y-1">
                        {segment.characteristics.map((char, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 mt-1 text-green-500" />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                      <ul className="space-y-1">
                        {segment.recommendedActions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Target className="h-3 w-3 mt-1 text-blue-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <span>Size: {segment.size.toLocaleString('en-US')}</span>
                      <span>Value: ${(segment.size * segment.avgSpend / 1000000).toFixed(1)}M</span>
                    </div>
                    <Button size="sm" onClick={() => alert('Button clicked')}>
                      <Users className="h-4 w-4 mr-1" />
                      Target Segment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecasting</CardTitle>
                <CardDescription>ML-powered revenue predictions for next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026'].map((month, index) => (
                    <div key={month} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{month}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85 + index * 2} className="w-20 h-2" />
                        <span className="text-sm font-semibold">${(25 + index * 3).toFixed(1)}M</span>
                        <Badge variant="outline" className="text-xs">
                          +{(15 + index * 2)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Opportunities</CardTitle>
                <CardDescription>AI-identified growth opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { market: 'Qatar Construction', potential: '$3.2M', confidence: 87 },
                  { market: 'UAE Tech Sector', potential: '$2.8M', confidence: 92 },
                  { market: 'Kuwait Oil Services', potential: '$4.1M', confidence: 78 },
                  { market: 'Saudi Renewable Energy', potential: '$5.5M', confidence: 83 }
                ].map((opportunity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{opportunity.market}</p>
                      <p className="text-sm text-muted-foreground">Potential: {opportunity.potential}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{opportunity.confidence}% confidence</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actionable Recommendations</CardTitle>
              <CardDescription>AI-generated action items for business optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.filter(insight => insight.actionable).map((insight) => (
                  <div key={insight.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <p className="font-medium">{insight.title}</p>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{insight.category}</Badge>
                          <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                            {insight.impact} impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => alert('Button clicked')}>
                        Implement
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Market Analytics Component */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Market Performance</CardTitle>
          <CardDescription>Comprehensive analytics across GCC markets</CardDescription>
        </CardHeader>
        <CardContent>
          <MarketAnalytics />
        </CardContent>
      </Card>
    </div>
  )
}









