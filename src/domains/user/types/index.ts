// User domain type exports
export type { User, UserProfile, UserPreferences, UserStats } from '../models/User';
import type { User, UserStats } from '../models/User';

// User service types
export interface UserDashboardData {
  user: User;
  stats: UserStats;
  recentActivity: UserActivity[];
  projects: ProjectSummary[];
}

export interface UserActivity {
  id: string;
  type: 'order' | 'project' | 'payment' | 'warranty';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  progress: number;
  budget: number;
  spent: number;
}



