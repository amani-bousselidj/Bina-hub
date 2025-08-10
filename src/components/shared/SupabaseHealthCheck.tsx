// @ts-nocheck
// Simple Supabase health check utility
'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SupabaseHealthCheck() {
  const [result, setResult] = useState<string>('Checking...');

  useEffect(() => {
    const check = async () => {
      try {
        const supabase = createClientComponentClient();
        // Try to select from a known table (change 'products' to any table you know exists)
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (error) {
          setResult(`Error: ${JSON.stringify(error)}`);
        } else if (!Array.isArray(data)) {
          setResult('No data returned. Table may not exist or RLS is blocking access.');
        } else {
          setResult('Success! Data returned: ' + JSON.stringify(data));
        }
      } catch (e) {
        setResult('Exception: ' + (e instanceof Error ? e.message : JSON.stringify(e)));
      }
    };
    check();
  }, []);

  return (
    <div style={{ padding: 16, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8 }}>
      <strong>Supabase Health Check:</strong>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{result}</pre>
    </div>
  );
}




