// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card, LoadingSpinner, Button } from '@/components/ui';
import { 
  Settings, 
  FileText, 
  ShoppingCart, 
  DollarSign, 
  Shield, 
  Bell,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Users,
  Filter,
  Tag
} from 'lucide-react';
import { ProjectOrderSettings, ProjectOrderTemplate, UserOrderPreferences } from '@/core/shared/types/project-settings';
import { ProjectOrderSettingsAPI, ProjectOrderTemplatesAPI, UserOrderPreferencesAPI } from '@/core/shared/services/api/project-settings';
import { toast } from 'react-hot-toast';

interface ProjectOrderCustomizationProps {
  projectId: string;
  projectName: string;
  projectType: string;
  projectStatus: string;
  userId: string;
  onClose: () => void;
}

export default function ProjectOrderCustomization({
  projectId,
  projectName,
  projectType,
  projectStatus,
  userId,
  onClose
}: ProjectOrderCustomizationProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'preferences' | 'analytics'>('settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State for different customization aspects
  const [projectSettings, setProjectSettings] = useState<ProjectOrderSettings | null>(null);
  const [templates, setTemplates] = useState<ProjectOrderTemplate[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserOrderPreferences | null>(null);

  // Form states
  const [settingsForm, setSettingsForm] = useState<Partial<ProjectOrderSettings>>({});
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProjectOrderTemplate | null>(null);

  useEffect(() => {
    loadCustomizationData();
  }, [projectId, userId]);

  const loadCustomizationData = async () => {
    try {
      setLoading(true);
      
      // Load project settings
      const settings = await ProjectOrderSettingsAPI.getProjectSettings(projectId);
      setProjectSettings(settings);
      setSettingsForm(settings || getDefaultSettings());

      // Load templates
      const templateList = await ProjectOrderTemplatesAPI.getProjectTemplates(projectId);
      setTemplates(templateList);

      // Load user preferences
      const preferences = await UserOrderPreferencesAPI.getUserPreferences(userId);
      setUserPreferences(preferences);

    } catch (error) {
      console.error('Error loading customization data:', error);
      toast.error('خطأ في تحميل إعدادات التخصيص');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSettings = (): Partial<ProjectOrderSettings> => ({
    project_id: projectId,
    user_id: userId,
    preferred_stores: [],
    preferred_categories: [],
    preferred_payment_method: 'cash',
    preferred_delivery_type: 'standard',
    budget_limit_enabled: false,
    max_order_amount: 0,
    require_approval_above: 10000,
    approval_user_ids: [],
    auto_approve_orders: false,
    require_manager_approval: false,
    notification_preferences: {
      order_created: true,
      order_approved: true,
      order_delivered: true,
      budget_exceeded: true,
    },
    allowed_categories: [],
    blocked_categories: [],
    preferred_vendors: [],
    default_order_notes: '',
    custom_fields: {}
  });

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      if (projectSettings) {
        await ProjectOrderSettingsAPI.updateProjectSettings(projectId, settingsForm);
      } else {
        await ProjectOrderSettingsAPI.createProjectSettings(settingsForm as Omit<ProjectOrderSettings, 'id' | 'created_at' | 'updated_at'>);
      }
      
      toast.success('تم حفظ الإعدادات بنجاح');
      await loadCustomizationData();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTemplate = async (templateData: Partial<ProjectOrderTemplate>) => {
    try {
      setSaving(true);
      
      const newTemplate = {
        ...templateData,
        project_id: projectId,
        user_id: userId,
        usage_count: 0,
        is_active: true
      } as Omit<ProjectOrderTemplate, 'id' | 'created_at' | 'updated_at'>;

      await ProjectOrderTemplatesAPI.createTemplate(newTemplate);
      toast.success('تم إنشاء القالب بنجاح');
      await loadCustomizationData();
      setShowTemplateForm(false);
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('خطأ في إنشاء القالب');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      id: 'settings',
      label: 'إعدادات المشروع',
      icon: Settings,
      description: 'تخصيص إعدادات الطلبات للمشروع'
    },
    {
      id: 'templates',
      label: 'قوالب الطلبات',
      icon: FileText,
      description: 'إنشاء وإدارة قوالب الطلبات'
    },
    {
      id: 'preferences',
      label: 'التفضيلات الشخصية',
      icon: Users,
      description: 'إعدادات المستخدم العامة'
    },
    {
      id: 'analytics',
      label: 'التحليلات والإحصائيات',
      icon: DollarSign,
      description: 'تحليل أنماط الطلبات والميزانية'
    }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-8">
          <LoadingSpinner />
          <p className="mt-4 text-center">جاري تحميل إعدادات التخصيص...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">تخصيص طلبات المشروع</h2>
            <p className="text-gray-600 mt-1">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(95vh-140px)]">
          {/* Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-start p-4 rounded-lg transition-colors text-right ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 ml-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-sm opacity-75 mt-1">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Project Info */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-3">معلومات المشروع</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">النوع:</span>
                  <span className="font-medium">{projectType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحالة:</span>
                  <span className="font-medium">{projectStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">القوالب:</span>
                  <span className="font-medium">{templates.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'settings' && (
              <ProjectSettingsTab
                settings={settingsForm}
                onSettingsChange={setSettingsForm}
                onSave={handleSaveSettings}
                saving={saving}
                projectType={projectType}
              />
            )}

            {activeTab === 'templates' && (
              <ProjectTemplatesTab
                templates={templates}
                onCreateTemplate={handleCreateTemplate}
                onEditTemplate={setEditingTemplate}
                saving={saving}
                projectId={projectId}
              />
            )}

            {activeTab === 'preferences' && (
              <UserPreferencesTab
                preferences={userPreferences}
                userId={userId}
                onPreferencesChange={() => loadCustomizationData()}
              />
            )}

            {activeTab === 'analytics' && (
              <ProjectAnalyticsTab
                projectId={projectId}
                projectSettings={projectSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Settings Tab Component
function ProjectSettingsTab({ 
  settings, 
  onSettingsChange, 
  onSave, 
  saving, 
  projectType 
}: {
  settings: Partial<ProjectOrderSettings>;
  onSettingsChange: (settings: Partial<ProjectOrderSettings>) => void;
  onSave: () => void;
  saving: boolean;
  projectType: string;
}) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const updateNotificationPreference = (key: string, value: boolean) => {
    const defaultPrefs = {
      order_created: true,
      order_approved: true,
      order_delivered: true,
      budget_exceeded: true
    };
    const newPrefs = { ...defaultPrefs, ...settings.notification_preferences, [key]: value };
    onSettingsChange({ ...settings, notification_preferences: newPrefs });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Budget Controls */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-green-600 ml-2" />
          <h3 className="text-lg font-semibold">ضوابط الميزانية</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="budget_limit_enabled"
              checked={settings.budget_limit_enabled || false}
              onChange={(e) => updateSetting('budget_limit_enabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <label htmlFor="budget_limit_enabled" className="mr-2">
              تفعيل حد الميزانية للطلبات
            </label>
          </div>

          {settings.budget_limit_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الحد الأقصى لمبلغ الطلب</label>
                <input
                  type="number"
                  value={settings.max_order_amount || 0}
                  onChange={(e) => updateSetting('max_order_amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">يتطلب موافقة فوق</label>
                <input
                  type="number"
                  value={settings.require_approval_above || 0}
                  onChange={(e) => updateSetting('require_approval_above', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="10000"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Order Preferences */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <ShoppingCart className="w-5 h-5 text-blue-600 ml-2" />
          <h3 className="text-lg font-semibold">تفضيلات الطلبات</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">طريقة الدفع المفضلة</label>
            <select
              value={settings.preferred_payment_method || 'cash'}
              onChange={(e) => updateSetting('preferred_payment_method', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="cash">نقداً</option>
              <option value="credit_card">بطاقة ائتمان</option>
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="check">شيك</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">نوع التوصيل المفضل</label>
            <select
              value={settings.preferred_delivery_type || 'standard'}
              onChange={(e) => updateSetting('preferred_delivery_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="standard">عادي</option>
              <option value="express">سريع</option>
              <option value="same_day">نفس اليوم</option>
              <option value="pickup">استلام من المتجر</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">ملاحظات افتراضية للطلبات</label>
          <textarea
            value={settings.default_order_notes || ''}
            onChange={(e) => updateSetting('default_order_notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="ملاحظات تُضاف تلقائياً لجميع طلبات هذا المشروع..."
          />
        </div>
      </Card>

      {/* Approval Workflow */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-purple-600 ml-2" />
          <h3 className="text-lg font-semibold">سير عمل الموافقات</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto_approve_orders"
              checked={settings.auto_approve_orders || false}
              onChange={(e) => updateSetting('auto_approve_orders', e.target.checked)}
              className="rounded border-gray-300 text-purple-600"
            />
            <label htmlFor="auto_approve_orders" className="mr-2">
              الموافقة التلقائية على الطلبات
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_manager_approval"
              checked={settings.require_manager_approval || false}
              onChange={(e) => updateSetting('require_manager_approval', e.target.checked)}
              className="rounded border-gray-300 text-purple-600"
            />
            <label htmlFor="require_manager_approval" className="mr-2">
              يتطلب موافقة المدير
            </label>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-orange-600 ml-2" />
          <h3 className="text-lg font-semibold">تفضيلات الإشعارات</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'order_created' as const, label: 'إنشاء طلب جديد' },
            { key: 'order_approved' as const, label: 'الموافقة على الطلب' },
            { key: 'order_delivered' as const, label: 'تسليم الطلب' },
            { key: 'budget_exceeded' as const, label: 'تجاوز الميزانية' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={settings.notification_preferences?.[key] || false}
                onChange={(e) => updateNotificationPreference(key, e.target.checked)}
                className="rounded border-gray-300 text-orange-600"
              />
              <label htmlFor={key} className="mr-2 text-sm">
                {label}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {saving ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Save className="w-4 h-4 ml-2" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Project Templates Tab Component
function ProjectTemplatesTab({ 
  templates, 
  onCreateTemplate, 
  onEditTemplate, 
  saving, 
  projectId 
}: {
  templates: ProjectOrderTemplate[];
  onCreateTemplate: (template: Partial<ProjectOrderTemplate>) => void;
  onEditTemplate: (template: ProjectOrderTemplate) => void;
  saving: boolean;
  projectId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    template_type: 'quick_order' as const,
    project_phase: '',
    auto_quantities: false,
    quantity_multiplier: 1,
    price_adjustment: 0,
    requires_approval: false,
    approval_workflow: ''
  });

  const handleSubmit = () => {
    onCreateTemplate(templateForm);
    setTemplateForm({
      name: '',
      description: '',
      template_type: 'quick_order',
      project_phase: '',
      auto_quantities: false,
      quantity_multiplier: 1,
      price_adjustment: 0,
      requires_approval: false,
      approval_workflow: ''
    });
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">قوالب الطلبات</h3>
          <p className="text-gray-600 text-sm">إنشاء قوالب لتسريع عملية الطلبات المتكررة</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4 ml-2" />
          قالب جديد
        </Button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEditTemplate(template)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600" onClick={() => alert('Button clicked')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <span>{template.template_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المرحلة:</span>
                <span>{template.project_phase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">مرات الاستخدام:</span>
                <span>{template.usage_count}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <Button
                size="sm"
                variant="outline"
                className="w-full"
               onClick={() => alert('Button clicked')}>
                استخدام القالب
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Template Creation Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">إنشاء قالب جديد</h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم القالب</label>
              <input
                type="text"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="مثال: طلب مواد التشطيب"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">نوع القالب</label>
              <select
                value={templateForm.template_type}
                onChange={(e) => setTemplateForm({ ...templateForm, template_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="quick_order">طلب سريع</option>
                <option value="bulk_order">طلب بالجملة</option>
                <option value="recurring_order">طلب متكرر</option>
                <option value="custom">مخصص</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="وصف القالب واستخداماته..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !templateForm.name}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'إنشاء القالب'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// User Preferences Tab Component  
function UserPreferencesTab({ 
  preferences, 
  userId, 
  onPreferencesChange 
}: {
  preferences: UserOrderPreferences | null;
  userId: string;
  onPreferencesChange: () => void;
}) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">التفضيلات الشخصية</h3>
      <p className="text-gray-600">سيتم تطوير هذا القسم قريباً لإدارة التفضيلات الشخصية للمستخدم.</p>
    </div>
  );
}

// Project Analytics Tab Component
function ProjectAnalyticsTab({ 
  projectId, 
  projectSettings 
}: {
  projectId: string;
  projectSettings: ProjectOrderSettings | null;
}) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">التحليلات والإحصائيات</h3>
      <p className="text-gray-600">سيتم تطوير هذا القسم قريباً لعرض تحليلات شاملة عن أنماط الطلبات والميزانية.</p>
    </div>
  );
}




