'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/Progress';
import { 
  Shield,
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  HardDrive,
  Server,
  Cloud,
  Archive,
  History,
  Settings,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';

export default function BackupPage() {
  const [activeTab, setActiveTab] = useState('backups');
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);

  // Mock backup data
  const backups = [
    {
      id: 1,
      name: 'نسخ احتياطي تلقائي - يناير 2025',
      type: 'automatic',
      size: '2.4 GB',
      date: '2025-01-30T02:00:00',
      status: 'completed',
      includes: ['قاعدة البيانات', 'الملفات', 'الصور', 'الإعدادات'],
      location: 'التخزين السحابي',
      checksum: 'a1b2c3d4e5f6',
      encrypted: true,
      retention: 90
    },
    {
      id: 2,
      name: 'نسخ احتياطي يدوي - تحديث النظام',
      type: 'manual',
      size: '2.1 GB',
      date: '2025-01-28T14:30:00',
      status: 'completed',
      includes: ['قاعدة البيانات', 'الإعدادات'],
      location: 'الخادم المحلي',
      checksum: 'b2c3d4e5f6a1',
      encrypted: true,
      retention: 365
    },
    {
      id: 3,
      name: 'نسخ احتياطي أسبوعي',
      type: 'scheduled',
      size: '2.6 GB',
      date: '2025-01-26T01:00:00',
      status: 'completed',
      includes: ['قاعدة البيانات', 'الملفات', 'الصور', 'الإعدادات', 'السجلات'],
      location: 'التخزين السحابي',
      checksum: 'c3d4e5f6a1b2',
      encrypted: true,
      retention: 52
    },
    {
      id: 4,
      name: 'نسخ احتياطي تلقائي - يناير 2025',
      type: 'automatic',
      size: '2.3 GB',
      date: '2025-01-23T02:00:00',
      status: 'failed',
      includes: ['قاعدة البيانات', 'الملفات'],
      location: 'التخزين السحابي',
      checksum: null,
      encrypted: false,
      retention: 90,
      error: 'فشل في الاتصال بالتخزين السحابي'
    }
  ];

  const schedules = [
    {
      id: 1,
      name: 'نسخ احتياطي يومي',
      frequency: 'daily',
      time: '02:00',
      enabled: true,
      includes: ['قاعدة البيانات', 'الصور'],
      retention: 30,
      lastRun: '2025-01-30T02:00:00',
      nextRun: '2025-01-31T02:00:00'
    },
    {
      id: 2,
      name: 'نسخ احتياطي أسبوعي كامل',
      frequency: 'weekly',
      time: '01:00',
      enabled: true,
      includes: ['جميع البيانات'],
      retention: 52,
      lastRun: '2025-01-26T01:00:00',
      nextRun: '2025-02-02T01:00:00'
    },
    {
      id: 3,
      name: 'نسخ احتياطي شهري',
      frequency: 'monthly',
      time: '00:00',
      enabled: true,
      includes: ['جميع البيانات', 'السجلات التاريخية'],
      retention: 12,
      lastRun: '2025-01-01T00:00:00',
      nextRun: '2025-02-01T00:00:00'
    }
  ];

  const storageLocations = [
    {
      id: 1,
      name: 'التخزين السحابي الرئيسي',
      type: 'cloud',
      capacity: '1TB',
      used: '245GB',
      available: '755GB',
      status: 'connected',
      provider: 'AWS S3',
      encrypted: true
    },
    {
      id: 2,
      name: 'الخادم المحلي',
      type: 'local',
      capacity: '500GB',
      used: '127GB',
      available: '373GB',
      status: 'connected',
      provider: 'Local Server',
      encrypted: true
    },
    {
      id: 3,
      name: 'التخزين السحابي الثانوي',
      type: 'cloud',
      capacity: '500GB',
      used: '89GB',
      available: '411GB',
      status: 'connected',
      provider: 'Google Cloud',
      encrypted: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'failed': return 'فشل';
      case 'in_progress': return 'قيد التنفيذ';
      case 'pending': return 'معلق';
      case 'connected': return 'متصل';
      case 'disconnected': return 'غير متصل';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'automatic': return <RefreshCw className="h-4 w-4" />;
      case 'manual': return <Database className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'cloud': return <Cloud className="h-4 w-4" />;
      case 'local': return <HardDrive className="h-4 w-4" />;
      default: return <Archive className="h-4 w-4" />;
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'يومي';
      case 'weekly': return 'أسبوعي';
      case 'monthly': return 'شهري';
      default: return frequency;
    }
  };

  const handleCreateBackup = async () => {
    setBackupInProgress(true);
    toast.success('بدء إنشاء نسخة احتياطية...');
    
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
      toast.success('تم إنشاء النسخة الاحتياطية بنجاح');
    }, 3000);
  };

  const handleRestoreBackup = async (backupId: number) => {
    if (confirm('هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.')) {
      setRestoreInProgress(true);
      toast.success('بدء استعادة النسخة الاحتياطية...');
      
      setTimeout(() => {
        setRestoreInProgress(false);
        toast.success('تم استعادة النسخة الاحتياطية بنجاح');
      }, 5000);
    }
  };

  const handleDeleteBackup = (backupId: number) => {
    if (confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
      toast.success('تم حذف النسخة الاحتياطية');
    }
  };

  const handleToggleSchedule = (scheduleId: number, enabled: boolean) => {
    toast.success(`تم ${enabled ? 'تفعيل' : 'إيقاف'} الجدولة`);
  };

  const stats = {
    totalBackups: backups.length,
    completedBackups: backups.filter(b => b.status === 'completed').length,
    totalSize: backups.filter(b => b.status === 'completed').reduce((sum, b) => sum + parseFloat(b.size), 0),
    activeSchedules: schedules.filter(s => s.enabled).length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">النسخ الاحتياطية</h1>
          <p className="text-gray-600">إدارة النسخ الاحتياطية واستعادة البيانات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </Button>
          <Button onClick={handleCreateBackup} disabled={backupInProgress}>
            {backupInProgress ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                إنشاء نسخة احتياطية
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي النسخ</p>
                <p className="text-2xl font-bold">{stats.totalBackups}</p>
              </div>
              <Archive className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">النسخ المكتملة</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedBackups}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الحجم</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalSize.toFixed(1)} GB</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الجدولة النشطة</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeSchedules}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicator */}
      {(backupInProgress || restoreInProgress) && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {backupInProgress ? 'إنشاء نسخة احتياطية...' : 'استعادة النسخة الاحتياطية...'}
                </h3>
                <span className="text-sm text-gray-500">75%</span>
              </div>
              <Progress value={75} className="w-full" />
              <p className="text-sm text-gray-600">
                {backupInProgress ? 'جاري ضغط قاعدة البيانات...' : 'جاري استعادة الملفات...'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backups">النسخ الاحتياطية</TabsTrigger>
          <TabsTrigger value="schedules">الجدولة</TabsTrigger>
          <TabsTrigger value="storage">التخزين</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {backups.map((backup) => (
              <Card key={backup.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(backup.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{backup.name}</h3>
                        <p className="text-gray-600">الحجم: {backup.size} • الموقع: {backup.location}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(backup.status)}>
                            {getStatusText(backup.status)}
                          </Badge>
                          {backup.encrypted && (
                            <Badge variant="outline">
                              <Lock className="h-3 w-3 mr-1" />
                              مشفر
                            </Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(backup.date).toLocaleString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {backup.status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreBackup(backup.id)}
                            disabled={restoreInProgress}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            استعادة
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            تحميل
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.id)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">البيانات المشمولة:</p>
                      <div className="flex flex-wrap gap-2">
                        {backup.includes.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">فترة الاحتفاظ:</span>
                        <span className="font-medium">{backup.retention} يوم</span>
                      </div>
                      {backup.checksum && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">المجموع التحقق:</span>
                          <span className="font-mono text-xs">{backup.checksum}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {backup.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-800">{backup.error}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{schedule.name}</h3>
                        <p className="text-gray-600">
                          {getFrequencyText(schedule.frequency)} في الساعة {schedule.time}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(schedule.enabled ? 'connected' : 'disconnected')}>
                            {schedule.enabled ? 'نشط' : 'معطل'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            فترة الاحتفاظ: {schedule.retention} {schedule.frequency === 'daily' ? 'يوم' : schedule.frequency === 'weekly' ? 'أسبوع' : 'شهر'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSchedule(schedule.id, !schedule.enabled)}
                      >
                        {schedule.enabled ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">البيانات المشمولة:</p>
                      <div className="flex flex-wrap gap-2">
                        {schedule.includes.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">آخر تشغيل:</span>
                      </div>
                      <p className="text-sm font-medium">
                        {new Date(schedule.lastRun).toLocaleString('ar-SA')}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">التشغيل القادم:</span>
                      </div>
                      <p className="text-sm font-medium">
                        {new Date(schedule.nextRun).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storageLocations.map((location) => (
              <Card key={location.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(location.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{location.name}</h3>
                        <p className="text-sm text-gray-600">{location.provider}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(location.status)}>
                      {getStatusText(location.status)}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>المساحة المستخدمة</span>
                        <span>{location.used} / {location.capacity}</span>
                      </div>
                      <Progress 
                        value={(parseInt(location.used) / parseInt(location.capacity)) * 100} 
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">المستخدم</p>
                        <p className="font-medium">{location.used}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">المتاح</p>
                        <p className="font-medium">{location.available}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {location.encrypted ? (
                          <>
                            <Lock className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">مشفر</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600">غير مشفر</span>
                          </>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النسخ الاحتياطية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>التشفير الافتراضي</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">مفعل</SelectItem>
                      <SelectItem value="disabled">معطل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>الضغط</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون ضغط</SelectItem>
                      <SelectItem value="low">ضغط منخفض</SelectItem>
                      <SelectItem value="medium">ضغط متوسط</SelectItem>
                      <SelectItem value="high">ضغط عالي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>فترة الاحتفاظ الافتراضية (أيام)</Label>
                  <Input type="number" defaultValue="90" />
                </div>

                <div className="space-y-2">
                  <Label>الحد الأقصى لحجم النسخة الاحتياطية</Label>
                  <Select defaultValue="5gb">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1gb">1 GB</SelectItem>
                      <SelectItem value="5gb">5 GB</SelectItem>
                      <SelectItem value="10gb">10 GB</SelectItem>
                      <SelectItem value="unlimited">بدون حد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أدوات إضافية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  استيراد نسخة احتياطية
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  تقرير النسخ الاحتياطية
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  فحص سلامة البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}




