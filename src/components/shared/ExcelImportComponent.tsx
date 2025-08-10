// @ts-nocheck
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui';
import { Upload, FileSpreadsheet, Check, X, RefreshCw, Download } from 'lucide-react';
import { useTranslation } from '@/core/shared/hooks/useTranslation';
import { exportToCSV } from '@/utilities/data-export';

// Types for Excel import functionality
interface ImportSession {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename: string;
  total_rows: number;
  processed_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at: string | null;
  user_id: string;
}

interface ImportError {
  row: number;
  column: string;
  message: string;
}

interface ImportResult {
  session: ImportSession;
  errors: ImportError[];
}

export default function ExcelImportComponent() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ImportSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  
  // Function to get status color for badges
  const getStatusColor = (status: ImportSession['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's an Excel file
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
        setError(t('excel.invalid_file_type'));
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };
  
  // Function to start import
  const startImport = async () => {
    if (!file) {
      setError(t('excel.no_file_selected'));
      return;
    }
    
    setImporting(true);
    setError(null);
    setImportResult(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/excel-import', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('excel.import_error'));
      }
      
      const result = await response.json();
      setImportResult(result);
      
      // Refresh sessions list
      fetchImportSessions();
    } catch (err) {
      console.error('Error importing file:', err);
      setError(err instanceof Error ? err.message : t('excel.import_error'));
    } finally {
      setImporting(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
    }
  };
  
  // Function to fetch import sessions
  const fetchImportSessions = async () => {
    setLoadingSessions(true);
    
    try {
      const response = await fetch('/api/excel-import/sessions');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('excel.fetch_sessions_error'));
      }
      
      const data = await response.json();
      setSessions(data.sessions);
    } catch (err) {
      console.error('Error fetching import sessions:', err);
      setError(err instanceof Error ? err.message : t('excel.fetch_sessions_error'));
    } finally {
      setLoadingSessions(false);
    }
  };
  
  // Function to download template
  const downloadTemplate = () => {
    const templateData = [
      {
        barcode: '1234567890123',
        name: 'Sample Product',
        description: 'This is a sample product description',
        category: 'Electronics',
        brand: 'Sample Brand',
        store_price: 100,
        store_cost: 80,
        quantity: 10,
        min_stock_level: 5,
        store_specific_notes: 'Sample notes',
      },
      {
        barcode: '9876543210987',
        name: 'Another Product',
        description: 'This is another sample product',
        category: 'Home Goods',
        brand: 'Another Brand',
        store_price: 50,
        store_cost: 30,
        quantity: 20,
        min_stock_level: 8,
        store_specific_notes: '',
      },
    ];
    
    exportToCSV(templateData, {
      filename: 'inventory-import-template.csv',
    });
  };
  
  // Function to export errors as CSV
  const exportErrors = () => {
    if (!importResult || !importResult.errors || importResult.errors.length === 0) {
      setError(t('excel.no_errors_to_export'));
      return;
    }
    
    const errorData = importResult.errors.map(err => ({
      row: err.row,
      column: err.column,
      message: err.message,
    }));
    
    exportToCSV(errorData, {
      filename: `import-errors-${new Date().toISOString().slice(0, 10)}.csv`,
    });
  };
  
  // Fetch import sessions on component mount
  React.useEffect(() => {
    fetchImportSessions();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{t('excel.title')}</h1>
        <p className="text-gray-600">{t('excel.description')}</p>
        
        {/* File upload section */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t('excel.upload_file')}</h2>
            <Button onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              {t('excel.download_template')}
            </Button>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx,.xls,.csv"
              />
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-1">
                {file ? file.name : t('excel.drag_or_click')}
              </p>
              <p className="text-xs text-gray-500">
                {t('excel.supported_formats')}
              </p>
            </div>
            
            {file && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button 
                  onClick={startImport} 
                  disabled={importing}
                  className="text-sm"
                >
                  {importing ? t('excel.importing') : t('excel.start_import')}
                </Button>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
        
        {/* Import result */}
        {importResult && (
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('excel.import_result')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('excel.status')}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(importResult.session.status)}`}>
                    {importResult.session.status}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('excel.total_rows')}</p>
                <p className="text-xl font-semibold mt-1">{importResult.session.total_rows}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('excel.processed')}</p>
                <p className="text-xl font-semibold mt-1">
                  {importResult.session.processed_rows} ({Math.round((importResult.session.processed_rows / importResult.session.total_rows) * 100)}%)
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('excel.success_rate')}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-semibold">
                    {Math.round((importResult.session.success_count / importResult.session.processed_rows) * 100) || 0}%
                  </span>
                  <div className="flex space-x-2">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm">{importResult.session.success_count}</span>
                    </div>
                    <div className="flex items-center">
                      <X className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm">{importResult.session.error_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {importResult.errors.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('excel.errors')}</h3>
                  <Button onClick={exportErrors}>
                    <Download className="mr-2 h-4 w-4" />
                    {t('excel.export_errors')}
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('excel.row')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('excel.column')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('excel.error')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {importResult.errors.slice(0, 10).map((error, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {error.row}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {error.column}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {error.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    {importResult.errors.length > 10 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      {t('excel.more_errors')} ({importResult.errors.length - 10})
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Recent import sessions */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('excel.recent_imports')}</h2>
            <Button 
              onClick={fetchImportSessions} 
              disabled={loadingSessions}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingSessions ? 'animate-spin' : ''}`} />
              {t('excel.refresh')}
            </Button>
          </div>
          
          {sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('excel.filename')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('excel.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('excel.rows')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('excel.success')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('excel.date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.processed_rows} / {session.total_rows}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{session.success_count}</span>
                          <X className="h-4 w-4 text-red-500 ml-2" />
                          <span>{session.error_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.created_at).toLocaleString('en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">{t('excel.no_imports')}</p>
              <p className="text-sm text-gray-500">{t('excel.start_first_import')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




