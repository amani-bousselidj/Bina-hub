export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          avatar_url?: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          email: string;
          full_name: string;
          role?: string;
          avatar_url?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          description?: string;
          status: string;
          created_at: string;
          updated_at?: string;
          location?: {
            lat: number;
            lng: number;
            address: string;
          };
          budget: number;
          level: string;
          picture?: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          total_amount: number;
          created_at: string;
          updated_at?: string;
          items: Array<{
            id: string;
            name: string;
            quantity: number;
            price: number;
          }>;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      warranties: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          status: string;
          created_at: string;
          updated_at?: string;
          description: string;
        };
        Insert: Omit<Database['public']['Tables']['warranties']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['warranties']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          order_id: string;
          amount: number;
          status: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];


