// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  transactions: number;
  revenue: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface LaunchMetrics {
  betaUsers: number;
  activeBetaUsers: number;
  completedOnboarding: number;
  feedbackSubmissions: number;
  bugReports: number;
  featureRequests: number;
}

interface SecurityMetrics {
  blockedAttacks: number;
  failedLogins: number;
  rateLimitHits: number;
  securityScore: number;
}

export default function LaunchMonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    responseTime: 145,
    errorRate: 0.02,
    activeUsers: 847,
    transactions: 1250,
    revenue: 125000,
    systemHealth: 'healthy'
  });

  const [launchMetrics, setLaunchMetrics] = useState<LaunchMetrics>({
    betaUsers: 205,
    activeBetaUsers: 168,
    completedOnboarding: 187,
    feedbackSubmissions: 94,
    bugReports: 12,
    featureRequests: 38
  });

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    blockedAttacks: 45,
    failedLogins: 23,
    rateLimitHits: 156,
    securityScore: 87
  });

  const [refreshing, setRefreshing] = useState(false);

  // Mock real-time data for demonstration
  const performanceData = [
    { time: '00:00', responseTime: 120, users: 450, errors: 0 },
    { time: '04:00', responseTime: 135, users: 320, errors: 1 },
    { time: '08:00', responseTime: 180, users: 850, errors: 2 },
    { time: '12:00', responseTime: 145, users: 1200, errors: 1 },
    { time: '16:00', responseTime: 160, users: 980, errors: 0 },
    { time: '20:00', responseTime: 140, users: 720, errors: 1 }
  ];

  const revenueData = [
    { date: '2025-07-01', revenue: 45000, orders: 120 },
    { date: '2025-07-02', revenue: 52000, orders: 145 },
    { date: '2025-07-03', revenue: 48000, orders: 132 },
    { date: '2025-07-04', revenue: 61000, orders: 178 },
    { date: '2025-07-05', revenue: 55000, orders: 156 },
    { date: '2025-07-06', revenue: 67000, orders: 189 },
    { date: '2025-07-07', revenue: 72000, orders: 203 },
    { date: '2025-07-08', revenue: 68000, orders: 195 },
    { date: '2025-07-09', revenue: 75000, orders: 214 }
  ];

  const betaUserProgress = [
    { week: 'Week 1', registered: 45, active: 32, completed: 28 },
    { week: 'Week 2', registered: 89, active: 67, completed: 58 },
    { week: 'Week 3', registered: 134, active: 104, completed: 89 },
    { week: 'Week 4', registered: 178, active: 142, completed: 125 },
    { week: 'Week 5', registered: 205, active: 168, completed: 152 }
  ];

  const refreshMetrics = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update metrics with slight variations
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        transactions: prev.transactions + Math.floor(Math.random() * 50) - 25,
        responseTime: prev.responseTime + Math.floor(Math.random() * 20) - 10,
        errorRate: Math.max(0, prev.errorRate + (Math.random() * 0.01) - 0.005)
      }));
    } finally {
      setRefreshing(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Launch Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time monitoring for Binna Platform soft launch</p>
        </div>
        <Button 
          onClick={refreshMetrics}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            {getHealthIcon(metrics.systemHealth)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{metrics.systemHealth}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.uptime}% uptime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.transactions.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {metrics.revenue.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">
              +15% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#8884d8" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Beta User Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Beta User Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={betaUserProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="registered" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="active" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beta User Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{launchMetrics.betaUsers}</div>
                <div className="text-sm text-gray-600">Total Beta Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{launchMetrics.activeBetaUsers}</div>
                <div className="text-sm text-gray-600">Active Beta Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{launchMetrics.completedOnboarding}</div>
                <div className="text-sm text-gray-600">Completed Onboarding</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{launchMetrics.feedbackSubmissions}</div>
                <div className="text-sm text-gray-600">Feedback Submissions</div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bug Reports</span>
                <Badge variant="destructive">{launchMetrics.bugReports}</Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Feature Requests</span>
                <Badge variant="secondary">{launchMetrics.featureRequests}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Security Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{securityMetrics.blockedAttacks}</div>
              <div className="text-sm text-gray-600">Blocked Attacks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{securityMetrics.failedLogins}</div>
              <div className="text-sm text-gray-600">Failed Logins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{securityMetrics.rateLimitHits}</div>
              <div className="text-sm text-gray-600">Rate Limit Hits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{securityMetrics.securityScore}%</div>
              <div className="text-sm text-gray-600">Security Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">System Health Check Passed</div>
                <div className="text-sm text-gray-600">All systems operational - 2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-medium">High Response Time Detected</div>
                <div className="text-sm text-gray-600">Response time above 200ms - 15 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium">Traffic Spike Detected</div>
                <div className="text-sm text-gray-600">300% increase in user activity - 1 hour ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


