export interface User {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  metadata?: {
    role?: string;
    avatar_url?: string;
    phone?: string;
    preferences?: {
      theme?: string;
      language?: string;
      notifications?: boolean;
    }
  };
  user_metadata?: {
    role?: string;
  };
}

export interface AuthService {
  signUp(email: string, password: string, fullName?: string): Promise<{ user: User }>;
  signIn(email: string, password: string): Promise<{ user: User }>;
  signOut(): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateProfile(profile: Partial<User>): Promise<void>;
  verifyTempAuth(code: string): Promise<boolean>;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  phone?: string;
  created_at: Date;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
}


