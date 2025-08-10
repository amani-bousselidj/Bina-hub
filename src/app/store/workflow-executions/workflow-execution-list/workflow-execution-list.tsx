'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'completed' | 'failed' | 'running' | 'cancelled' | 'pending';
  started_at: string;
  completed_at?: string;
  execution_time?: number;
  trigger_type: 'manual' | 'scheduled' | 'event';
  error_message?: string;
  progress_percentage: number;
}

const []: WorkflowExecution[] = [
  {
    id: 'exec_001',
    workflow_id: 'wf_001',
    workflow_name: 'تحديث أسعار المنتجات',
    status: 'completed',
    started_at: '2024-01-15T10:30:00Z',
    completed_at: '2024-01-15T10:35:00Z',
    execution_time: 300,
    trigger_type: 'manual',
    progress_percentage: 100
  },
  {
    id: 'exec_002',
    workflow_id: 'wf_002',
    workflow_name: 'إرسال تقارير المبيعات',
    status: 'running',
    started_at: '2024-01-15T11:00:00Z',
    trigger_type: 'scheduled',
    progress_percentage: 65
  },
  {
    id: 'exec_003',
    workflow_id: 'wf_003',
    workflow_name: 'معالجة الطلبات المعلقة',
    status: 'failed',
    started_at: '2024-01-15T09:15:00Z',
    completed_at: '2024-01-15T09:18:00Z',
    execution_time: 180,
    trigger_type: 'event',
    error_message: 'خطأ في الاتصال بقاعدة البيانات',
    progress_percentage: 30
  },
  {
    id: 'exec_004',
    workflow_id: 'wf_004',
    workflow_name: 'تحديث مخزون المستودعات',
    status: 'pending',
    started_at: '2024-01-15T12:00:00Z',
    trigger_type: 'scheduled',
    progress_percentage: 0
  }
];

export default function WorkflowExecutionList() {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate loading executions
    const timer = setTimeout(() => {
      setExecutions([]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredExecutions = useMemo(() => {
    return executions.filter(execution => {
      const matchesSearch = execution.workflow_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [executions, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <Pause className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'running':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'failed':
        return 'فشل';
      case 'running':
        return 'قيد التشغيل';
      case 'pending':
        return 'في الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'manual':
        return 'يدوي';
      case 'scheduled':
        return 'مجدول';
      case 'event':
        return 'حدث';
      default:
        return trigger;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetryExecution = (executionId: string) => {
    // Simulate retry
    console.log('Retrying execution:', executionId);
  };

  const handleCancelExecution = (executionId: string) => {
    // Simulate cancel
    setExecutions(executions.map(exec => 
      exec.id === executionId 
        ? { ...exec, status: 'cancelled' as const }
        : exec
    ));
  };

  const statusCounts = useMemo(() => {
    return executions.reduce((acc, execution) => {
      acc[execution.status] = (acc[execution.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [executions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">سجل تنفيذ العمليات</h1>
              <p className="text-gray-600">مراقبة وإدارة تنفيذ العمليات التلقائية</p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
              <Settings size={16} />
              إدارة العمليات
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">العمليات المكتملة</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.completed || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">قيد التشغيل</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.running || 0}</p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">فشلت</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.failed || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="البحث في العمليات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الحالات</option>
                <option value="completed">مكتمل</option>
                <option value="running">قيد التشغيل</option>
                <option value="failed">فشل</option>
                <option value="pending">في الانتظار</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Executions Table */}
        <Card>
          <CardHeader>
            <CardTitle>سجل التنفيذ</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExecutions.length === 0 ? (
              <div className="text-center py-8">
                <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عمليات</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' ? 'لا توجد عمليات تطابق المرشحات' : 'لم يتم تنفيذ أي عمليات بعد'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم العملية</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>نوع التشغيل</TableHead>
                    <TableHead>وقت البدء</TableHead>
                    <TableHead>مدة التنفيذ</TableHead>
                    <TableHead>التقدم</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExecutions.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{execution.workflow_name}</div>
                          <div className="text-sm text-gray-500">ID: {execution.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(execution.status)}
                          <Badge variant={getStatusBadgeVariant(execution.status)}>
                            {getStatusLabel(execution.status)}
                          </Badge>
                        </div>
                        {execution.error_message && (
                          <div className="text-xs text-red-600 mt-1">
                            {execution.error_message}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTriggerLabel(execution.trigger_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDateTime(execution.started_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {execution.execution_time ? (
                          <span className="text-sm">
                            {formatDuration(execution.execution_time)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{execution.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${execution.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {execution.status === 'failed' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRetryExecution(execution.id)}
                            >
                              <RotateCcw size={16} />
                            </Button>
                          )}
                          {execution.status === 'running' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCancelExecution(execution.id)}
                            >
                              <Pause size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
