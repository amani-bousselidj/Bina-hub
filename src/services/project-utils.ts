// Project Utilities
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'paused' | 'cancelled' | 'for-sale';

export interface ProjectStatusInfo {
  status: ProjectStatus;
  label: string;
  description: string;
  color: string;
  allowedTransitions: ProjectStatus[];
}

export const PROJECT_STATUSES: Record<ProjectStatus, ProjectStatusInfo> = {
  draft: {
    status: 'draft',
    label: 'Draft',
    description: 'Project is being planned',
    color: 'gray',
    allowedTransitions: ['active', 'cancelled']
  },
  active: {
    status: 'active',
    label: 'Active',
    description: 'Project is in progress',
    color: 'blue',
    allowedTransitions: ['completed', 'paused', 'cancelled', 'for-sale']
  },
  completed: {
    status: 'completed',
    label: 'Completed',
    description: 'Project has been finished',
    color: 'green',
    allowedTransitions: ['for-sale']
  },
  paused: {
    status: 'paused',
    label: 'Paused',
    description: 'Project is temporarily stopped',
    color: 'yellow',
    allowedTransitions: ['active', 'cancelled']
  },
  cancelled: {
    status: 'cancelled',
    label: 'Cancelled',
    description: 'Project has been cancelled',
    color: 'red',
    allowedTransitions: []
  },
  'for-sale': {
    status: 'for-sale',
    label: 'For Sale',
    description: 'Project is available for purchase',
    color: 'purple',
    allowedTransitions: ['active', 'completed', 'cancelled']
  }
};

export function getAllProjectStatuses(): ProjectStatusInfo[] {
  return Object.values(PROJECT_STATUSES);
}

export function getProjectStatusInfo(status: string): ProjectStatusInfo | undefined {
  return PROJECT_STATUSES[status as ProjectStatus];
}

export function canTransitionToStatus(currentStatus: string, targetStatus: string): boolean {
  const statusInfo = getProjectStatusInfo(currentStatus);
  if (!statusInfo) return false;
  return statusInfo.allowedTransitions.includes(targetStatus as ProjectStatus);
}

export function canProjectBeForSale(project: {
  status: string;
  completion_percentage?: number;
  budget?: number;
  spent?: number;
}): { canSell: boolean; reason?: string } {
  const status = project.status;
  
  // Can only sell completed or active projects
  if (status !== 'completed' && status !== 'active') {
    return {
      canSell: false,
      reason: 'Only active or completed projects can be put up for sale'
    };
  }
  
  // For active projects, require minimum completion
  if (status === 'active') {
    const completion = project.completion_percentage || 0;
    if (completion < 50) {
      return {
        canSell: false,
        reason: 'Active projects must be at least 50% complete to be sold'
      };
    }
  }
  
  // Check if project has proper financial data
  if (project.budget && project.spent) {
    const budgetUtilization = (project.spent / project.budget) * 100;
    if (budgetUtilization > 120) {
      return {
        canSell: false,
        reason: 'Projects that are significantly over budget may not be suitable for sale'
      };
    }
  }
  
  return { canSell: true };
}

export function getProjectCompletionStatus(completion: number): {
  status: 'not-started' | 'in-progress' | 'near-completion' | 'completed';
  label: string;
  color: string;
} {
  if (completion === 0) {
    return { status: 'not-started', label: 'Not Started', color: 'gray' };
  } else if (completion < 80) {
    return { status: 'in-progress', label: 'In Progress', color: 'blue' };
  } else if (completion < 100) {
    return { status: 'near-completion', label: 'Near Completion', color: 'yellow' };
  } else {
    return { status: 'completed', label: 'Completed', color: 'green' };
  }
}

export function calculateProjectHealth(project: {
  completion_percentage?: number;
  budget?: number;
  spent?: number;
  start_date?: string;
  end_date?: string;
}): {
  health: 'excellent' | 'good' | 'warning' | 'critical';
  score: number;
  factors: string[];
} {
  let score = 100;
  const factors: string[] = [];
  
  // Budget utilization factor
  if (project.budget && project.spent) {
    const budgetUtilization = (project.spent / project.budget) * 100;
    if (budgetUtilization > 100) {
      score -= 30;
      factors.push('Over budget');
    } else if (budgetUtilization > 90) {
      score -= 15;
      factors.push('Near budget limit');
    }
  }
  
  // Timeline factor
  if (project.start_date && project.end_date) {
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const timeProgress = (elapsed / totalDuration) * 100;
    const completion = project.completion_percentage || 0;
    
    if (now > endDate && completion < 100) {
      score -= 40;
      factors.push('Overdue');
    } else if (timeProgress > completion + 20) {
      score -= 20;
      factors.push('Behind schedule');
    }
  }
  
  // Completion factor
  const completion = project.completion_percentage || 0;
  if (completion === 0) {
    score -= 10;
    factors.push('Not started');
  }
  
  let health: 'excellent' | 'good' | 'warning' | 'critical';
  if (score >= 80) health = 'excellent';
  else if (score >= 60) health = 'good';
  else if (score >= 40) health = 'warning';
  else health = 'critical';
  
  return { health, score: Math.max(0, score), factors };
}

export function getProjectPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'high': return 'red';
    case 'medium': return 'yellow';
    case 'low': return 'green';
    default: return 'gray';
  }
}

export function validateProjectData(data: {
  title?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Project title is required');
  }
  
  if (data.budget && data.budget < 0) {
    errors.push('Budget cannot be negative');
  }
  
  if (data.start_date && data.end_date) {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    if (start >= end) {
      errors.push('End date must be after start date');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
