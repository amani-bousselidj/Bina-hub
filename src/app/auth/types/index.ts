export type UserType = 'user' | 'service-provider' | 'store' | 'admin';

export interface UserTypeOption {
  value: UserType;
  label: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  displayName?: string;
  phone?: string;
}

export interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role?: string;
  account_type?: string;
}
