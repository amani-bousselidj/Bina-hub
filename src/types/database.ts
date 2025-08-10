export interface Database {
  public: {
    Tables: {
      warranties: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          store_name: string;
          status: string;
          expiry_date: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['warranties']['Row']>;
        Update: Partial<Database['public']['Tables']['warranties']['Row']>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          status: string;
          progress: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['projects']['Row']>;
        Update: Partial<Database['public']['Tables']['projects']['Row']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['orders']['Row']>;
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          status: string;
          invoice_number: string;
          payment_status: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['invoices']['Row']>;
        Update: Partial<Database['public']['Tables']['invoices']['Row']>;
      };
      stores: {
        Row: {
          id: string;
          store_name: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['stores']['Row']>;
        Update: Partial<Database['public']['Tables']['stores']['Row']>;
      };
    };
  };
}


