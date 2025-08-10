// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  erpIntegrationManager, 
  ERPSystem, 
  SyncRequest, 
  SyncResult 
} from '@/core/shared/services/erp/erp-integration-manager';
import { 
  Database, 
  RefreshCw, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Play,
  TrendingUp,
  BarChart3,
  Calendar,
  Server,
  Zap,
  Activity,
  Globe
} from 'lucide-react';

interface ERPStats {
  total_syncs: number;
  successful_syncs: number;
  failed_syncs: number;
  total_records_processed: number;
  average_sync_time: number;
  success_rate: number;
  system_breakdown: Record<string, any>;
  data_type_breakdown: Record<string, number>;
}

export function ERPSystemIntegration() {
  const [erpSystems, setErpSystems] = useState<ERPSystem[]>([]);
  const [erpStats, setErpStats] = useState<ERPStats | null>(null);
  const [activeSyncs, setActiveSyncs] = useState<SyncResult[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [testingConnection, setTestingConnection] = useState<string>('');
  const [startingSync, setStartingSync] = useState<string>('');

  // Sync configuration
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [syncType, setSyncType] = useState<'full' | 'incremental' | 'real_time'>('incremental');
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['customers', 'products']);

  useEffect(() => {
    loadERPData();
  }, []);

  const loadERPData = async () => {
    try {
      setLoading(true);
      
      // Load ERP systems
      const systems = erpIntegrationManager.getActiveERPSystems();
      setErpSystems(systems);
      
      if (systems.length > 0) {
        setSelectedSystem(systems[0].id);
      }

      // Load ERP stats
      const stats = await erpIntegrationManager.getERPStats('month');
      setErpStats(stats);

      // Test connections for all systems
      await testAllConnections(systems);

    } catch (error) {
      console.error('Failed to load ERP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAllConnections = async (systems: ERPSystem[]) => {
    const statusPromises = systems.map(async (system) => {
      try {
        const result = await erpIntegrationManager.testERPConnection(system.id);
        return { [system.id]: result };
      } catch (error) {
        return { [system.id]: { success: false, response_time: 0, error_message: 'Connection failed' } };
      }
    });

    const results = await Promise.all(statusPromises);
    const statusMap = Object.assign({}, ...results);
    setConnectionStatus(statusMap);
  };

  const testConnection = async (systemId: string) => {
    setTestingConnection(systemId);
    try {
      const result = await erpIntegrationManager.testERPConnection(systemId);
      setConnectionStatus(prev => ({ ...prev, [systemId]: result }));
    } catch (error) {
      console.error('Failed to test connection:', error);
    } finally {
      setTestingConnection('');
    }
  };

  const startSync = async () => {
    if (!selectedSystem) return;

    setStartingSync(selectedSystem);
    try {
      const syncRequest: SyncRequest = {
        erp_system_id: selectedSystem,
        sync_type: syncType,
        data_types: selectedDataTypes,
        batch_size: 100
      };

      const result = await erpIntegrationManager.startSync(syncRequest);
      setActiveSyncs(prev => [...prev, result]);

      // Update active syncs periodically
      const interval = setInterval(() => {
        const updatedResult = erpIntegrationManager.getSyncStatus(result.sync_id);
        if (updatedResult) {
          setActiveSyncs(prev => prev.map(sync => 
            sync.sync_id === result.sync_id ? updatedResult : sync
          ));

          if (updatedResult.status === 'completed' || updatedResult.status === 'failed') {
            clearInterval(interval);
            // Refresh stats after sync completion
            setTimeout(() => {
              loadERPData();
            }, 1000);
          }
        }
      }, 2000);

    } catch (error) {
      console.error('Failed to start sync:', error);
    } finally {
      setStartingSync('');
    }
  };

  const getSystemIcon = (type: ERPSystem['type']) => {
    switch (type) {
      case 'sap': return <Database className="w-5 h-5" />;
      case 'oracle': return <Server className="w-5 h-5" />;
      case 'quickbooks': return <BarChart3 className="w-5 h-5" />;
      case 'netsuite': return <Globe className="w-5 h-5" />;
      case 'dynamics': return <Activity className="w-5 h-5" />;
      case 'odoo': return <Settings className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConnectionStatusIcon = (connected: boolean) => {
    return connected ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ERP systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ERP System Integrations</h1>
            <p className="text-purple-100 mt-1">
              50+ ERP integrations • 15-second sync times • Real-time data flow
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {erpSystems.length}
            </div>
            <div className="text-purple-100">Connected Systems</div>
          </div>
        </div>
      </div>

      {/* ERP Statistics */}
      {erpStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Syncs</p>
                <p className="text-2xl font-bold text-gray-900">{erpStats.total_syncs}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {erpStats.success_rate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Records Processed</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {erpStats.total_records_processed.toLocaleString('en-US')}
                </p>
              </div>
              <Database className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Sync Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {erpStats.average_sync_time}s
                </p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ERP Systems */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Database className="w-5 h-5 mr-2 text-indigo-600" />
              Connected ERP Systems
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {erpSystems.map((system) => (
              <div key={system.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    {getSystemIcon(system.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{system.name}</h3>
                    <p className="text-sm text-gray-500">Version {system.version}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {system.features.slice(0, 3).map((feature) => (
                        <span key={feature} className="px-2 py-1 bg-gray-100 text-xs rounded capitalize">
                          {feature.replace('_', ' ')}
                        </span>
                      ))}
                      {system.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                          +{system.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center">
                    {connectionStatus[system.id] ? 
                      getConnectionStatusIcon(connectionStatus[system.id].success) :
                      <Clock className="w-4 h-4 text-gray-400" />
                    }
                    <span className="ml-2 text-sm">
                      {connectionStatus[system.id]?.response_time || 0}ms
                    </span>
                  </div>
                  <button
                    onClick={() => testConnection(system.id)}
                    disabled={testingConnection === system.id}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 disabled:opacity-50"
                  >
                    {testingConnection === system.id ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      'Test'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Configuration */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-indigo-600" />
              Start Data Synchronization
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ERP System
              </label>
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {erpSystems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Type
              </label>
              <select
                value={syncType}
                onChange={(e) => setSyncType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="incremental">Incremental (Changes only)</option>
                <option value="full">Full Sync (All data)</option>
                <option value="real_time">Real-time (Continuous)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['customers', 'products', 'orders', 'invoices', 'inventory', 'suppliers'].map((dataType) => (
                  <label key={dataType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDataTypes.includes(dataType)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDataTypes(prev => [...prev, dataType]);
                        } else {
                          setSelectedDataTypes(prev => prev.filter(dt => dt !== dataType));
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm capitalize">{dataType}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={startSync}
              disabled={startingSync === selectedSystem || !selectedSystem || selectedDataTypes.length === 0}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {startingSync === selectedSystem ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Starting Sync...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Synchronization
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sync Jobs */}
      {activeSyncs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-600" />
              Active Sync Jobs
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sync Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ERP System
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeSyncs.map((sync) => (
                  <tr key={sync.sync_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sync.sync_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(sync.start_time).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full capitalize">
                        {erpSystems.find(s => s.id === sync.erp_system_id)?.name || sync.erp_system_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sync.records_processed.toLocaleString('en-US')} processed
                      </div>
                      {sync.records_failed > 0 && (
                        <div className="text-sm text-red-600">
                          {sync.records_failed} failed
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(sync.status)}
                        <span className={`ml-2 text-sm capitalize ${
                          sync.status === 'completed' ? 'text-green-600' :
                          sync.status === 'failed' ? 'text-red-600' :
                          sync.status === 'running' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {sync.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sync.duration ? 
                        `${(sync.duration / 1000).toFixed(1)}s` : 
                        `${Math.floor((Date.now() - new Date(sync.start_time).getTime()) / 1000)}s`
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Performance Breakdown */}
      {erpStats && Object.keys(erpStats.system_breakdown).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              System Performance Breakdown
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(erpStats.system_breakdown).map(([systemId, stats]) => (
                <div key={systemId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">
                      {erpSystems.find(s => s.id === systemId)?.name || systemId}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      stats.successful > stats.failed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Syncs:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Successful:</span>
                      <span className="font-medium text-green-600">{stats.successful}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed:</span>
                      <span className="font-medium text-red-600">{stats.failed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Records:</span>
                      <span className="font-medium">{stats.records_processed.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium text-xs">
                        {new Date(stats.last_sync).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Type Breakdown */}
      {erpStats && Object.keys(erpStats.data_type_breakdown).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              Data Type Sync Volume
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(erpStats.data_type_breakdown).map(([dataType, count]) => (
                <div key={dataType} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {count.toLocaleString('en-US')}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {dataType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





