// @ts-nocheck
// الطلب
export type Order = {
  id: number;
  item: string;
  date: string;
  status?: string;
  projectId?: string; // Link to project
  materialType?: string;
  quantity?: number;
  totalCost?: number;
  supplier?: string;
  estimatedDelivery?: string;
};

// الضمان
export type Warranty = {
  id: number;
  item: string;
  store: string;
  purchaseDate: string;
  warrantyYears: number;
  expiryDate: string;
  isActive: boolean;
  projectId?: string; // Link to project
  orderId?: number; // Link to original order
  materialId?: string; // Link to material
  serialNumber?: string;
  warrantyDocument?: string; // URL to warranty document
  cost?: number;
};

// المشروع
export type Project = {
  id: string;
  name: string;
  userId: string;
  stage: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  area: number;
  projectType: 'residential' | 'commercial' | 'industrial';
  floorCount: number;
  roomCount: number;
  estimations?: ProjectEstimation;
  purchases?: ProjectPurchase[];
  status: 'planning' | 'in_progress' | 'completed' | 'on-hold';
  location?: string | { lat: number; lng: number; address: string };
  startDate?: string;
  endDate?: string;
  images?: ProjectImage[];
  publicDisplay?: ProjectPublicSettings;
  budget?: number;
  clientName?: string;
  // Construction phases tracking
  selectedPhases?: string[];
  enablePhotoTracking?: boolean;
  enableProgressTracking?: boolean;
};

// صور المشروع
export type ProjectImage = {
  id: string;
  projectId: string;
  url: string;
  caption?: string;
  phaseId?: string; // مرحلة البناء
  stepId?: string; // خطوة محددة في المرحلة
  uploadedAt: string;
  type: 'progress' | 'milestone' | 'documentation' | 'showcase';
  isPublic: boolean;
};

// إعدادات العرض العام للمشروع
export type ProjectPublicSettings = {
  isPublic: boolean;
  showLocation: boolean;
  showTimeline: boolean;
  showImages: boolean;
  hideCosts: boolean; // إخفاء التكاليف دائماً للعرض العام
  description?: string; // وصف للعرض العام
};

// تقديرات المشروع
export type ProjectEstimation = {
  id: string;
  projectId: string;
  calculatorType: string; // 'comprehensive' | 'individual' | 'company-bulk'
  createdAt: string;
  materials: MaterialEstimation[];
  lighting?: LightingEstimation[];
  totalCost: number;
  phases: {
    foundation: number;
    structure: number;
    finishing: number;
    electrical: number;
    plumbing: number;
  };
};

// تقدير المواد
export type MaterialEstimation = {
  materialId: string;
  materialName: string;
  materialNameEn: string;
  category: string;
  estimatedQuantity: number;
  unit: string;
  pricePerUnit: number;
  totalCost: number;
  specifications: string[];
  suppliers: string[];
  priority: 'high' | 'medium' | 'low';
  phase: 'foundation' | 'structure' | 'finishing' | 'electrical' | 'plumbing';
};

// تقدير الإضاءة
export type LightingEstimation = {
  roomName: string;
  roomType: string;
  area: number;
  requiredLux: number;
  fixtures: {
    type: string;
    quantity: number;
    pricePerUnit: number;
    totalCost: number;
  }[];
  totalCost: number;
};

// مشتريات المشروع
export type ProjectPurchase = {
  id: string;
  projectId: string;
  materialId: string;
  materialName: string;
  purchasedQuantity: number;
  unit: string;
  pricePerUnit: number;
  totalCost: number;
  purchaseDate: string;
  supplier: string;
  receiptNumber?: string;
  status: 'ordered' | 'received' | 'installed' | 'returned';
  notes?: string;
  orderId?: number; // Link to Order
  warrantyId?: number; // Link to Warranty if applicable
  warrantyEndDate?: string;
  hasWarranty: boolean;
};

// ملخص حالة المشروع
export type ProjectSummary = {
  projectId: string;
  totalEstimatedCost: number;
  totalSpentCost: number;
  remainingCost: number;
  completionPercentage: number;
  materialProgress: {
    [category: string]: {
      estimatedQuantity: number;
      purchasedQuantity: number;
      installedQuantity: number;
      remainingQuantity: number;
      estimatedCost: number;
      spentCost: number;
      remainingCost: number;
    };
  };
  phaseProgress: {
    foundation: { estimated: number; spent: number; completion: number };
    structure: { estimated: number; spent: number; completion: number };
    finishing: { estimated: number; spent: number; completion: number };
    electrical: { estimated: number; spent: number; completion: number };
    plumbing: { estimated: number; spent: number; completion: number };
  };
};

// المستخدم
export type User = {
  id: string;
  name: string;
  email?: string;
};

// --- AUTO-GENERATED: Supabase construction_projects columns as of 2025-07-31 ---
// id, user_id, project_name, description, project_type, status, budget, actual_cost, start_date, completion_percentage, location, created_at, updated_at, name, title, type, spent, end_date, estimated_completion, progress, area, estimated_cost, spent_cost

export type SupabaseProject = {
  id: string;
  user_id: string;
  project_name: string;
  description: string | null;
  project_type: string | null;
  status: string | null;
  budget: number | null;
  actual_cost: number | null;
  start_date: string | null;
  completion_percentage: number | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  name: string | null;
  title: string | null;
  type: string | null;
  spent: number | null;
  end_date: string | null;
  estimated_completion: string | null;
  progress: number | null;
  area: number | null;
  estimated_cost: number | null;
  spent_cost: number | null;
};

// Utility: Map SupabaseProject to frontend Project type (partial, extend as needed)
export function mapSupabaseProjectToProject(s: SupabaseProject): Project {
  return {
    id: s.id,
    name: s.project_name || s.name || '',
    description: s.description || '',
    projectType: (s.project_type as any) || 'residential',
    status: (s.status as any) || 'planning',
    progress: s.progress ?? s.completion_percentage ?? 0,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    area: s.area ?? 0,
    budget: s.budget ?? undefined,
    startDate: s.start_date ?? undefined,
    endDate: s.end_date ?? undefined,
    stage: '',
    floorCount: 0,
    roomCount: 0,
    estimations: undefined,
    purchases: undefined,
    location: s.location ?? undefined,
    images: undefined,
    publicDisplay: undefined,
    clientName: undefined,
    selectedPhases: undefined,
    enablePhotoTracking: undefined,
    enableProgressTracking: undefined,
  };
}




