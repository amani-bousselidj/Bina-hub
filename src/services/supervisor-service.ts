// Supervisor Service
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export interface SupervisorData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  role: 'supervisor' | 'manager' | 'admin';
  permissions: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupervisorAuth {
  supervisor_id: string;
  permissions: string[];
  session_token: string;
  expires_at: string;
}

export interface AuthorizationRequest {
  id: string;
  user_id: string;
  supervisor_id?: string;
  action: string;
  resource: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  approved_at?: string;
  approved_by?: string;
}

class SupervisorService {
  private currentSupervisor: SupervisorData | null = null;
  private authToken: string | null = null;

  // Authentication
  async authenticateSupervisor(email: string, password: string): Promise<{ supervisor: SupervisorData, token: string } | null> {
    try {
      // First authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        console.error('Authentication failed:', authError);
        return null;
      }

      // Get supervisor data
      const { data: supervisor, error: supervisorError } = await supabase
        .from('supervisors')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('active', true)
        .single();

      if (supervisorError || !supervisor) {
        console.error('Supervisor not found:', supervisorError);
        return null;
      }

      // Generate session token
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

      // Store session
      await supabase
        .from('supervisor_sessions')
        .insert({
          supervisor_id: supervisor.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        });

      this.currentSupervisor = supervisor;
      this.authToken = sessionToken;

      return { supervisor, token: sessionToken };
    } catch (error) {
      console.error('Supervisor authentication failed:', error);
      return null;
    }
  }

  async validateSupervisorSession(token: string): Promise<SupervisorData | null> {
    try {
      const { data: session, error } = await supabase
        .from('supervisor_sessions')
        .select(`
          *,
          supervisors (*)
        `)
        .eq('session_token', token)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session) {
        return null;
      }

      this.currentSupervisor = session.supervisors;
      this.authToken = token;
      return session.supervisors;
    } catch (error) {
      console.error('Session validation failed:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    if (this.authToken) {
      await supabase
        .from('supervisor_sessions')
        .delete()
        .eq('session_token', this.authToken);
    }
    
    this.currentSupervisor = null;
    this.authToken = null;
  }

  // Authorization Management
  async requestAuthorization(data: {
    user_id: string;
    action: string;
    resource: string;
    reason: string;
  }): Promise<AuthorizationRequest | null> {
    try {
      const { data: request, error } = await supabase
        .from('authorization_requests')
        .insert({
          user_id: data.user_id,
          action: data.action,
          resource: data.resource,
          reason: data.reason,
          status: 'pending',
          requested_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create authorization request:', error);
        return null;
      }

      // Notify supervisors (in a real app, this would send push notifications/emails)
      await this.notifySupervisors(request);

      return request;
    } catch (error) {
      console.error('Authorization request failed:', error);
      return null;
    }
  }

  async getPendingAuthorizations(): Promise<AuthorizationRequest[]> {
    try {
      if (!this.currentSupervisor) {
        throw new Error('Not authenticated as supervisor');
      }

      const { data: requests, error } = await supabase
        .from('authorization_requests')
        .select(`
          *,
          users (name, email)
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch pending authorizations:', error);
        return [];
      }

      return requests || [];
    } catch (error) {
      console.error('Error fetching authorizations:', error);
      return [];
    }
  }

  async approveAuthorization(requestId: string, reason?: string): Promise<boolean> {
    try {
      if (!this.currentSupervisor) {
        throw new Error('Not authenticated as supervisor');
      }

      const { error } = await supabase
        .from('authorization_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: this.currentSupervisor.id,
          supervisor_reason: reason
        })
        .eq('id', requestId);

      if (error) {
        console.error('Failed to approve authorization:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Authorization approval failed:', error);
      return false;
    }
  }

  async denyAuthorization(requestId: string, reason?: string): Promise<boolean> {
    try {
      if (!this.currentSupervisor) {
        throw new Error('Not authenticated as supervisor');
      }

      const { error } = await supabase
        .from('authorization_requests')
        .update({
          status: 'denied',
          approved_at: new Date().toISOString(),
          approved_by: this.currentSupervisor.id,
          supervisor_reason: reason
        })
        .eq('id', requestId);

      if (error) {
        console.error('Failed to deny authorization:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Authorization denial failed:', error);
      return false;
    }
  }

  // Permission checking
  hasPermission(permission: string): boolean {
    if (!this.currentSupervisor) return false;
    return this.currentSupervisor.permissions.includes(permission) || 
           this.currentSupervisor.permissions.includes('*');
  }

  canApprove(action: string, resource: string): boolean {
    if (!this.currentSupervisor) return false;
    
    const requiredPermission = `approve:${action}:${resource}`;
    const generalPermission = `approve:${action}:*`;
    const adminPermission = 'approve:*:*';
    
    return this.hasPermission(requiredPermission) || 
           this.hasPermission(generalPermission) || 
           this.hasPermission(adminPermission);
  }

  // Balance and financial approvals
  async approveBalanceAdjustment(userId: string, amount: number, reason: string): Promise<boolean> {
    try {
      if (!this.canApprove('balance_adjustment', 'user_account')) {
        throw new Error('Insufficient permissions for balance adjustment');
      }

      // Record the approval
      const { error: approvalError } = await supabase
        .from('balance_approvals')
        .insert({
          user_id: userId,
          supervisor_id: this.currentSupervisor!.id,
          amount: amount,
          reason: reason,
          approved_at: new Date().toISOString()
        });

      if (approvalError) {
        console.error('Failed to record balance approval:', approvalError);
        return false;
      }

      // Update user balance
      const { error: balanceError } = await supabase.rpc('adjust_user_balance', {
        user_id: userId,
        amount: amount
      });

      if (balanceError) {
        console.error('Failed to adjust balance:', balanceError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Balance adjustment failed:', error);
      return false;
    }
  }

  // Utility methods
  private generateSessionToken(): string {
    return 'sup_' + Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
  }

  private async notifySupervisors(request: AuthorizationRequest): Promise<void> {
    // In a real implementation, this would send notifications
    // For now, just log the notification
    console.log('Authorization request created:', request.id);
  }

  getCurrentSupervisor(): SupervisorData | null {
    return this.currentSupervisor;
  }

  isAuthenticated(): boolean {
    return this.currentSupervisor !== null && this.authToken !== null;
  }
}

// Export singleton instance
export const supervisorService = new SupervisorService();

// Helper functions for common supervisor actions
export async function requireSupervisorAuth(): Promise<SupervisorData> {
  const supervisor = supervisorService.getCurrentSupervisor();
  if (!supervisor) {
    throw new Error('Supervisor authentication required');
  }
  return supervisor;
}

export async function requirePermission(permission: string): Promise<void> {
  await requireSupervisorAuth();
  if (!supervisorService.hasPermission(permission)) {
    throw new Error(`Permission required: ${permission}`);
  }
}

export default supervisorService;


export { SupervisorService };


