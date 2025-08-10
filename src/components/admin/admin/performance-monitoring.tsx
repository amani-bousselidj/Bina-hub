import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Database, 
  Server, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';

interface PerformanceMetrics {
  responseTime: {
    avg: number;
    p95: number;
    p99: number;
  };
  throughput: {
    rps: number;
    rpm: number;
  };
  errorRate: number;
  uptime: number;
  database: {
    connections: number;
    cacheHitRatio: number;
    queryTime: number;
  };
  server: {
    cpu: number;
    memory: number;
    disk: number;
  };
  endpoints: Array<{
    path: string;
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
  }>;
}

export default function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/performance/metrics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch performance metrics');
      }
      
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'destructive';
    if (value >= thresholds.warning) return 'secondary';
    return 'default';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <XCircle className="h-4 w-4 text-red-500" />;
    if (value >= thresholds.warning) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading performance metrics: {error}
          <Button onClick={fetchMetrics} variant="outline" size="sm" className="ml-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Performance Monitoring</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
          </Button>
          <Button onClick={fetchMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.responseTime.avg || 0}ms</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getStatusIcon(metrics?.responseTime.avg || 0, { warning: 500, critical: 1000 })}
              <span>Target: &lt;500ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.throughput.rps || 0} RPS</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getStatusIcon(metrics?.throughput.rps || 0, { warning: 50, critical: 20 })}
              <span>{metrics?.throughput.rpm || 0} RPM</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics?.errorRate || 0).toFixed(2)}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getStatusIcon(metrics?.errorRate || 0, { warning: 1, critical: 5 })}
              <span>Target: &lt;1%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics?.uptime || 0).toFixed(3)}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getStatusIcon(100 - (metrics?.uptime || 0), { warning: 0.1, critical: 1 })}
              <span>Target: &gt;99.9%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Response Time Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average</span>
                <span>{metrics?.responseTime.avg || 0}ms</span>
              </div>
              <Progress value={Math.min((metrics?.responseTime.avg || 0) / 10, 100)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>95th Percentile</span>
                <span>{metrics?.responseTime.p95 || 0}ms</span>
              </div>
              <Progress value={Math.min((metrics?.responseTime.p95 || 0) / 10, 100)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>99th Percentile</span>
                <span>{metrics?.responseTime.p99 || 0}ms</span>
              </div>
              <Progress value={Math.min((metrics?.responseTime.p99 || 0) / 10, 100)} />
            </div>
          </CardContent>
        </Card>

        {/* Database Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Connections</span>
                <span>{metrics?.database.connections || 0}</span>
              </div>
              <Progress value={Math.min((metrics?.database.connections || 0) / 2, 100)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cache Hit Ratio</span>
                <span>{(metrics?.database.cacheHitRatio || 0).toFixed(1)}%</span>
              </div>
              <Progress value={metrics?.database.cacheHitRatio || 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Avg Query Time</span>
                <span>{metrics?.database.queryTime || 0}ms</span>
              </div>
              <Progress value={Math.min((metrics?.database.queryTime || 0) / 5, 100)} />
            </div>
          </CardContent>
        </Card>

        {/* Server Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Server Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{(metrics?.server.cpu || 0).toFixed(1)}%</span>
              </div>
              <Progress value={metrics?.server.cpu || 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{(metrics?.server.memory || 0).toFixed(1)}%</span>
              </div>
              <Progress value={metrics?.server.memory || 0} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disk Usage</span>
                <span>{(metrics?.server.disk || 0).toFixed(1)}%</span>
              </div>
              <Progress value={metrics?.server.disk || 0} />
            </div>
          </CardContent>
        </Card>

        {/* Endpoint Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Endpoint Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics?.endpoints.map((endpoint, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{endpoint.path}</span>
                    <Badge variant={getStatusColor(endpoint.avgResponseTime, { warning: 500, critical: 1000 })}>
                      {endpoint.avgResponseTime}ms
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Error Rate: {endpoint.errorRate.toFixed(2)}%</span>
                    <span>Throughput: {endpoint.throughput} RPS</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {metrics && (
        <div className="space-y-2">
          {metrics.responseTime.avg > 500 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High response time detected: {metrics.responseTime.avg}ms (target: &lt;500ms)
              </AlertDescription>
            </Alert>
          )}
          {metrics.errorRate > 1 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High error rate detected: {metrics.errorRate.toFixed(2)}% (target: &lt;1%)
              </AlertDescription>
            </Alert>
          )}
          {metrics.database.cacheHitRatio < 90 && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Low cache hit ratio: {metrics.database.cacheHitRatio.toFixed(1)}% (target: &gt;90%)
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}


