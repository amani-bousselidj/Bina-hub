export interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  type: 'residential' | 'commercial' | 'industrial';
  location: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  timeline: {
    start_date: string;
    end_date: string;
    estimated_completion: string;
  };
  phases: ProjectPhase[];
  created_at: string;
  updated_at: string;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  order: number;
  start_date?: string;
  end_date?: string;
  budget_allocated: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectExpense {
  id: string;
  project_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt_url?: string;
  created_at: string;
}

export interface ProjectReport {
  id: string;
  project_id: string;
  type: 'progress' | 'financial' | 'materials' | 'timeline';
  title: string;
  content: any;
  generated_at: string;
}

export interface ProjectFilters {
  status?: Project['status'];
  type?: Project['type'];
  city?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
}

export interface ProjectSearchResult {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}


