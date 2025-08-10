export interface User {
  id: string;
  email: string;
  name?: string;
  user_type: 'user' | 'store' | 'store_owner';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  user_type?: 'user' | 'store' | 'store_owner';
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  location: string;
  rating: number;
  phone?: string;
  email?: string;
  verified: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  projectType: 'residential' | 'commercial' | 'industrial';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  progress: number;
  area?: number;
  location?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  store_id: string;
  created_at: string;
  updated_at: string;
}
