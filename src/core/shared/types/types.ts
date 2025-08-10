import type { 
  ProjectPublicSettings 
} from '@/types/types'

// Re-export ProjectImage
export type ProjectImage = {
  id: string;
  projectId: string;
  url: string;
  caption?: string;
  phaseId?: string;
  stepId?: string;
  isPublic?: boolean;
  uploadedAt?: string;
  type?: 'progress' | 'milestone' | 'documentation' | 'showcase';
};

export type User = {
  id: string
  email: string
  full_name: string
  email_verified: boolean
  user_metadata?: {
    role?: string
  }
}

export type Project = {
  id: string
  name: string
  description?: string
  location?: string | { lat: number; lng: number; address: string }
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled' | 'on-hold'
  budget?: number
  startDate?: string
  endDate?: string
  projectType: 'residential' | 'commercial' | 'industrial'
  picture?: string | null
  level?: string
  userId: string
  user_id?: string
  createdAt: string
  updatedAt: string
  created_at?: string
  updated_at?: string
  progress?: number
  estimations?: any
  images?: ProjectImage[]
  purchases?: any[]
  publicDisplay?: ProjectPublicSettings
  stage?: string
  area?: number
  floorCount?: number
  roomCount?: number
  clientName?: string
  selectedPhases?: string[]
  enablePhotoTracking?: boolean
  enableProgressTracking?: boolean
}

export type Order = {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  storeId?: string
  storeName?: string
  products?: any[]
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  shipping_address: string
  createdAt: Date
  updatedAt?: Date
  supplier_name?: string
  vendor?: string
  created_at?: Date
}

export type OrderItem = {
  id: string
  product_id: string
  quantity: number
  price: number
  name: string
}

export type Warranty = {
  id: string
  userId: string
  product_id: string
  purchase_date: Date
  expiry_date: Date
  status: 'active' | 'expired' | 'void'
  description: string
  createdAt: Date
  name?: string
  vendor?: string
  warranty_period?: number
  serial_number?: string
  is_active?: boolean
  warranty_document?: string
}

export type Invoice = {
  id: string
  userId: string
  orderId: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: Date
  createdAt: Date
}

export type UserProfile = {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  role: string
  createdAt: Date
  updatedAt?: Date
}

export type UserStats = {
  totalOrders: number
  activeWarranties: number
  activeProjects: number
  totalSpent: number
}

export interface ProjectEstimation {
  id: string
  projectId: string
  totalCost: number
  materials: any[]
}

export interface ProjectPurchase {
  id: string
  projectId: string
  orderId: string
  materialName: string
  quantity: number
  totalCost: number
  vendor?: string
  order_status?: 'pending' | 'ordered' | 'received' | 'installed' | 'returned'
  warranty_id?: string
  unit?: string
  price?: number
  description?: string
  purchase_date?: string
  receipt_number?: string
}

export interface ProjectSummary {
  id: string
  name: string
  totalCost: number
  status: string
}

export interface MaterialEstimation {
  name: string
  quantity: number
  unitCost: number
  totalCost: number
}

export interface LightingEstimation {
  roomType: string
  fixtures: number
  cost: number
}

export interface SupabaseProject {
  id: string
  project_name: string
  description?: string | null
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled' | 'on-hold'
  start_date?: string | null
  end_date?: string | null
  estimated_cost?: number | null
  spent_cost?: number | null
  completion_percentage?: number | null
  location?: string | null
  project_type: 'residential' | 'commercial' | 'industrial'
  user_id: string
  created_at: string
  updated_at: string
}

export function mapSupabaseProjectToProject(supabaseProject: SupabaseProject): Project {
  return {
    id: supabaseProject.id,
    name: supabaseProject.project_name,
    description: supabaseProject.description ?? undefined,
    status: supabaseProject.status,
    startDate: supabaseProject.start_date ?? undefined,
    endDate: supabaseProject.end_date ?? undefined,
    budget: supabaseProject.estimated_cost ?? undefined,
    progress: supabaseProject.completion_percentage ?? undefined,
    location: supabaseProject.location ?? undefined,
    projectType: supabaseProject.project_type,
    userId: supabaseProject.user_id,
    createdAt: supabaseProject.created_at,
    updatedAt: supabaseProject.updated_at,
  }
}


