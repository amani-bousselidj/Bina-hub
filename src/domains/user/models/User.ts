export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  preferences?: UserPreferences;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  company?: string;
  location?: string;
  bio?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showEmail: boolean;
    showPhone: boolean;
  };
}

export interface UserStats {
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  activeWarranties: number;
  totalOrders: number;
}



