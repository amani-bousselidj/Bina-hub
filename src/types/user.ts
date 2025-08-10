export interface User {
  id: string;
  email: string;
  full_name: string;
  username?: string;
  avatar_url?: string;
  phone?: string;
  role: 'customer' | 'store_owner' | 'contractor' | 'admin';
  profile: UserProfile;
  preferences: UserPreferences;
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface UserProfile {
  bio?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
  };
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  occupation?: string;
  company?: string;
  website?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: UserNotificationSettings;
  privacy: UserPrivacySettings;
  marketing: UserMarketingSettings;
}

export interface UserNotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  order_updates: boolean;
  project_updates: boolean;
  marketplace_updates: boolean;
  promotional_emails: boolean;
  security_alerts: boolean;
}

export interface UserPrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends_only';
  show_email: boolean;
  show_phone: boolean;
  show_location: boolean;
  allow_messaging: boolean;
  show_activity: boolean;
}

export interface UserMarketingSettings {
  allow_promotional_emails: boolean;
  allow_sms_marketing: boolean;
  allow_personalized_ads: boolean;
  interests: string[];
  preferred_communication_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

export interface UserAddress {
  id: string;
  user_id: string;
  type: 'home' | 'work' | 'billing' | 'shipping' | 'other';
  label?: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  type: 'login' | 'logout' | 'order_placed' | 'project_created' | 'store_visited' | 'product_viewed' | 'other';
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  orders_count: number;
  projects_count: number;
  stores_count: number;
  total_spent: number;
  favorite_categories: string[];
  activity_score: number;
  member_since: string;
  last_activity: string;
}

export interface UserFilters {
  role?: User['role'];
  status?: User['status'];
  city?: string;
  country?: string;
  search?: string;
  email_verified?: boolean;
}

export interface UserSearchResult {
  data: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  email_verified: boolean;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role?: User['role'];
}

export interface SignInData {
  email: string;
  password: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordUpdateData {
  current_password: string;
  new_password: string;
}


