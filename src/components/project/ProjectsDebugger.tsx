// @ts-nocheck
// Add this component temporarily to the projects page for debugging
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ProjectsDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const runDebugTests = async () => {
      const results: any = {};
      
      // Test 1: Environment variables
      results.env = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
      };
      
      // Test 2: Supabase client
      results.client = supabase ? 'Initialized' : 'Not initialized';
      
      // Test 3: Basic query
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, status')
          .limit(3);
          
        results.basicQuery = {
          success: !error,
          error: error ? error.message : null,
          dataCount: data ? data.length : 0,
          data: data || []
        };      } catch (err) {
        results.basicQuery = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          dataCount: 0,
          data: []
        };
      }
      
      // Test 4: Completed projects query
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, status, city')
          .eq('status', 'completed')
          .limit(5);
          
        results.completedQuery = {
          success: !error,
          error: error ? error.message : null,
          dataCount: data ? data.length : 0,
          data: data || []
        };      } catch (err) {
        results.completedQuery = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          dataCount: 0,
          data: []
        };
      }
      
      setDebugInfo(results);
      setLoading(false);
    };
    
    runDebugTests();
  }, []);
  if (loading) {
    return <div className="p-4 bg-yellow-100">🔍 Running debug tests...</div>;
  }

  if (!debugInfo) {
    return <div className="p-4 bg-red-100">❌ Debug info not available</div>;
  }

  return (
    <div className="p-4 bg-gray-100 border-l-4 border-blue-500 mb-4">
      <h3 className="font-bold text-lg mb-2">🔧 Debug Information</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Environment:</strong> 
          URL: {debugInfo.env.url}, Key: {debugInfo.env.key}
        </div>
        
        <div>
          <strong>Supabase Client:</strong> {debugInfo.client}
        </div>
        
        <div>
          <strong>Basic Query:</strong> 
          {debugInfo.basicQuery.success ? (
            <span className="text-green-600">✅ Success ({debugInfo.basicQuery.dataCount} rows)</span>
          ) : (
            <span className="text-red-600">❌ Failed: {debugInfo.basicQuery.error}</span>
          )}
        </div>
        
        <div>
          <strong>Completed Projects Query:</strong> 
          {debugInfo.completedQuery.success ? (
            <span className="text-green-600">✅ Success ({debugInfo.completedQuery.dataCount} rows)</span>
          ) : (
            <span className="text-red-600">❌ Failed: {debugInfo.completedQuery.error}</span>
          )}
        </div>
        
        {debugInfo.completedQuery.success && debugInfo.completedQuery.dataCount > 0 && (
          <div>
            <strong>Sample Projects:</strong>            <ul className="ml-4 mt-1">
              {debugInfo.completedQuery.data.slice(0, 3).map((p: any) => (
                <li key={p.id}>• {p.name} ({p.city || 'No city'})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}




