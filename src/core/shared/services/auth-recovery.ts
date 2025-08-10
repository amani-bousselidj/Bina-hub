import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

const supabase = createClientComponentClient();

export interface AuthRecoveryResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function verifyAuthWithRetry(maxRetries = 3, delayMs = 1000): Promise<AuthRecoveryResult> {
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.warn(`Auth verification attempt ${attempts + 1} failed:`, error.message);
        
        if (attempts === maxRetries - 1) {
          return { success: false, error: error.message };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delayMs));
        attempts++;
        continue;
      }
      
      if (user) {
        return { success: true, user };
      }
      
      // No user found, no error - not authenticated
      return { success: false, error: 'No authenticated user' };
      
    } catch (error) {
      console.error(`Auth verification attempt ${attempts + 1} error:`, error);
      
      if (attempts === maxRetries - 1) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
      attempts++;
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
}

export async function signOut(): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function refreshSession(): Promise<AuthRecoveryResult> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (session?.user) {
      return { success: true, user: session.user };
    }
    
    return { success: false, error: 'No session found' };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function checkAuthState(): Promise<AuthRecoveryResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return { success: true, user: session.user };
    }
    
    return { success: false, error: 'No active session' };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export default {
  verifyAuthWithRetry,
  signOut,
  refreshSession,
  checkAuthState
};


