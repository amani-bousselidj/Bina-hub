// Generated Supabase types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          account_balance?: number;
          loyalty_points?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          account_balance?: number;
          loyalty_points?: number;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          account_balance?: number;
          loyalty_points?: number;
        };
      };
      construction_projects: {
        Row: {
          id: string;
          user_id: string;
          project_name: string;
          description?: string;
          project_type?: string;
          status?: string;
          budget?: number;
          actual_cost?: number;
          start_date?: string;
          completion_percentage?: number;
          location?: string;
          created_at: string;
          updated_at: string;
          name?: string;
          title?: string;
          type?: string;
          spent?: number;
          end_date?: string;
          estimated_completion?: string;
          progress?: number;
          area?: number;
          estimated_cost?: number;
          spent_cost?: number;
        };
        Insert: {
          user_id: string;
          project_name: string;
          description?: string;
          project_type?: string;
          status?: string;
          budget?: number;
          start_date?: string;
          location?: string;
        };
        Update: {
          project_name?: string;
          description?: string;
          project_type?: string;
          status?: string;
          budget?: number;
          actual_cost?: number;
          completion_percentage?: number;
          location?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          status: string;
          payment_status: string;
          shipping_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_amount: number;
          status: string;
          payment_status: string;
          shipping_address: string;
        };
        Update: {
          status?: string;
          payment_status?: string;
          total_amount?: number;
        };
      };
      warranties: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          status: string;
          purchase_date: string;
          expiry_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product_name: string;
          status: string;
          purchase_date: string;
          expiry_date: string;
        };
        Update: {
          status?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          status: string;
          due_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          amount: number;
          status: string;
          due_date: string;
        };
        Update: {
          status?: string;
          amount?: number;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}


