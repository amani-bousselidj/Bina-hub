// Enhanced Supabase client for better error handling and network issues
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Custom fetch with retry logic
const customFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const url = typeof input === 'string' ? input : input.toString();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  const retryFetch = async (retries = 3): Promise<Response> => {
    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          ...init.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok && retries > 0) {
        console.log(`Fetch failed, retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return retryFetch(retries - 1);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retries > 0 && error instanceof Error) {
        console.log(`Fetch error, retrying... (${retries} retries left)`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return retryFetch(retries - 1);
      }
      
      throw error;
    }
  };
  
  return retryFetch();
};

// Create enhanced Supabase client
export function createEnhancedSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  console.log('🔧 Creating enhanced Supabase client');
  console.log('   URL:', supabaseUrl?.substring(0, 30) + '...');
  console.log('   Key present:', !!supabaseKey);
  
  try {
    // Try the auth-helpers client first (recommended for Next.js)
    const client = createClientComponentClient({
      supabaseUrl,
      supabaseKey,
    });
    
    console.log('✅ Created auth-helpers client');
    return client;
  } catch (error) {
    console.log('⚠️ Auth-helpers client failed, trying direct client', error);
    
    // Fallback to direct client with custom fetch
    const client = createSupabaseClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: customFetch,
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    
    console.log('✅ Created direct client with custom fetch');
    return client;
  }
}

// Export alias for compatibility
export const createClient = createEnhancedSupabaseClient;

// Export a default supabase instance for compatibility
export const supabase = createEnhancedSupabaseClient();

// Test connection function
export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    const client = createEnhancedSupabaseClient();
    
    // Test 1: Basic REST API call
    console.log('📡 Testing REST API...');
    const { data, error } = await client
      .from('user_profiles')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('❌ REST API test failed:', error);
      return { connected: false, error: error.message };
    }
    
    console.log('✅ REST API test passed');
    
    // Test 2: Auth API
    console.log('🔐 Testing Auth API...');
    const { data: session } = await client.auth.getSession();
    console.log('✅ Auth API test passed');
    
    return { connected: true };
    
  } catch (error) {
    console.log('❌ Connection test failed:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Add a generic warehouse fetcher for future use
export async function fetchWarehouseById(id: string) {
  const client = createEnhancedSupabaseClient();
  const { data, error } = await client.from('warehouses').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function fetchAllWarehouses() {
  const client = createEnhancedSupabaseClient();
  const { data, error } = await client.from('warehouses').select('*');
  if (error) throw error;
  return data;
}


