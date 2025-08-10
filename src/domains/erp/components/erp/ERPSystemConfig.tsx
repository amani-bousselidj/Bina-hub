/**
 * ERP System Configuration Component
 * Supports adding/configuring Rawaa, Onyx Pro, Wafeq, Mezan, and other ERP systems
 */

'use client';

import React, { useState } from 'react';
import { X, Save, TestTube, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { ERPSystemType, ERPConnectionConfig } from '@/core/shared/services/erp/erp-adapter-interface';

export interface ERPSystemConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (systemData: any) => Promise<void>;
  editingSystem?: any;
}

const ERP_SYSTEM_OPTIONS: Array<{
  type: ERPSystemType;
  name: string;
  description: string;
  features: string[];
  configFields: Array<{
    key: keyof ERPConnectionConfig;
    label: string;
    type: 'text' | 'password' | 'url' | 'select';
    required: boolean;
    placeholder?: string;
    options?: string[];
  }>;
}> = [
  {
    type: 'medusa',
    name: 'Medusa.js',
    description: 'Modern e-commerce platform with headless architecture',
    features: ['products', 'orders', 'customers', 'inventory', 'payments'],
    configFields: [
      { key: 'baseUrl', label: 'API Base URL', type: 'url', required: true, placeholder: 'http://localhost:9000' },
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      { key: 'username', label: 'Admin Email', type: 'text', required: false, placeholder: 'admin@medusa.com' },
      { key: 'environment', label: 'Environment', type: 'select', required: true, options: ['sandbox', 'production'] }
    ]
  },
  {
    type: 'rawaa',
    name: 'Rawaa ERP',
    description: 'Comprehensive business management system for Saudi market',
    features: ['accounting', 'inventory', 'hr', 'projects', 'reports'],
    configFields: [
      { key: 'baseUrl', label: 'Rawaa API URL', type: 'url', required: true, placeholder: 'https://api.rawaa.com' },
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'tenantId', label: 'Tenant ID', type: 'text', required: true },
      { key: 'environment', label: 'Environment', type: 'select', required: true, options: ['sandbox', 'production'] }
    ]
  },
  {
    type: 'onyx-pro',
    name: 'Onyx Pro',
    description: 'Advanced ERP solution for enterprise resource planning',
    features: ['finance', 'supply_chain', 'manufacturing', 'crm', 'analytics'],
    configFields: [
      { key: 'baseUrl', label: 'Onyx Pro Server', type: 'url', required: true, placeholder: 'https://your-server.onyxpro.com' },
      { key: 'username', label: 'Username', type: 'text', required: true },
      { key: 'password', label: 'Password', type: 'password', required: true },
      { key: 'database', label: 'Database Name', type: 'text', required: true },
      { key: 'timeout', label: 'Timeout (seconds)', type: 'text', required: false, placeholder: '30' }
    ]
  },
  {
    type: 'wafeq',
    name: 'Wafeq',
    description: 'Cloud-based accounting and business management platform',
    features: ['accounting', 'invoicing', 'inventory', 'reports', 'compliance'],
    configFields: [
      { key: 'baseUrl', label: 'Wafeq API Endpoint', type: 'url', required: true, placeholder: 'https://api.wafeq.com' },
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      { key: 'tenantId', label: 'Company ID', type: 'text', required: true },
      { key: 'environment', label: 'Environment', type: 'select', required: true, options: ['sandbox', 'production'] }
    ]
  },
  {
    type: 'mezan',
    name: 'Mezan ERP',
    description: 'Integrated business management system for Middle East region',
    features: ['financial', 'inventory', 'projects', 'hr', 'procurement'],
    configFields: [
      { key: 'baseUrl', label: 'Mezan Server URL', type: 'url', required: true, placeholder: 'https://mezan.example.com' },
      { key: 'username', label: 'Username', type: 'text', required: true },
      { key: 'password', label: 'Password', type: 'password', required: true },
      { key: 'clientId', label: 'Client ID', type: 'text', required: false },
      { key: 'retryAttempts', label: 'Retry Attempts', type: 'text', required: false, placeholder: '3' }
    ]
  },
  {
    type: 'sap',
    name: 'SAP ERP',
    description: 'Enterprise resource planning software from SAP',
    features: ['finance', 'logistics', 'procurement', 'manufacturing', 'hr'],
    configFields: [
      { key: 'baseUrl', label: 'SAP Gateway URL', type: 'url', required: true },
      { key: 'username', label: 'SAP Username', type: 'text', required: true },
      { key: 'password', label: 'SAP Password', type: 'password', required: true },
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'tenantId', label: 'System ID', type: 'text', required: true }
    ]
  }
];

export const ERPSystemConfig: React.FC<ERPSystemConfigProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSystem
}) => {
  const [selectedType, setSelectedType] = useState<ERPSystemType>(editingSystem?.type || 'medusa');
  const [systemName, setSystemName] = useState(editingSystem?.name || '');
  const [config, setConfig] = useState<ERPConnectionConfig>(editingSystem?.config || {});
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(editingSystem?.features || []);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedSystemConfig = ERP_SYSTEM_OPTIONS.find(opt => opt.type === selectedType);

  const handleConfigChange = (key: keyof ERPConnectionConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const testConnection = async () => {
    if (!selectedSystemConfig) return;

    setIsTestingConnection(true);
    setConnectionTestResult(null);

    try {
      // Mock connection test for now - replace with actual adapter testing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // For demonstration, randomly succeed or fail
      const success = Math.random() > 0.3;
      
      setConnectionTestResult({
        success,
        message: success 
          ? `Successfully connected to ${selectedSystemConfig.name}`
          : `Failed to connect to ${selectedSystemConfig.name}. Please check your configuration.`
      });
    } catch (error) {
      setConnectionTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSystemConfig || !systemName) return;

    setIsSaving(true);
    try {
      const systemData = {
        name: systemName,
        type: selectedType,
        version: '1.0.0',
        status: 'inactive' as const,
        config,
        features: selectedFeatures
      };

      await onSave(systemData);
      onClose();
    } catch (error) {
      console.error('Failed to save ERP system:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingSystem ? 'Edit ERP System' : 'Add New ERP System'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - System Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ERP System Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ERPSystemType)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!!editingSystem}
              >
                {ERP_SYSTEM_OPTIONS.map(option => (
                  <option key={option.type} value={option.type}>
                    {option.name}
                  </option>
                ))}
              </select>
              {selectedSystemConfig && (
                <p className="mt-2 text-sm text-gray-600">
                  {selectedSystemConfig.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Name
              </label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder={`My ${selectedSystemConfig?.name} Instance`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Features Selection */}
            {selectedSystemConfig && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enabled Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSystemConfig.features.map(feature => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm capitalize">{feature.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Configuration */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Connection Configuration</h3>
              
              {selectedSystemConfig?.configFields.map(field => (
                <div key={field.key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={config[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={config[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Connection Test */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={testConnection}
                disabled={isTestingConnection || !config.baseUrl}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
                )}
              </button>

              {connectionTestResult && (
                <div className={`mt-3 p-3 rounded-lg flex items-center ${
                  connectionTestResult.success 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {connectionTestResult.success ? (
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  )}
                  <span className="text-sm">{connectionTestResult.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !systemName || !selectedFeatures.length}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingSystem ? 'Update System' : 'Add System'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ERPSystemConfig;



