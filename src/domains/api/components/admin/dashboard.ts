// API Dashboard Service
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export interface ProjectData {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  budget?: number;
  spent?: number;
  completion_percentage?: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  start_date?: string;
  end_date?: string;
  tags?: string[];
}

export interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseData {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  project_id?: string;
}

export async function getProjectById(id: string): Promise<ProjectData | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProjectById:', error);
    return null;
  }
}

export async function getAllProjects(userId?: string): Promise<ProjectData[]> {
  try {
    let query = supabase.from('projects').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    return [];
  }
}

export async function updateProject(id: string, updates: Partial<ProjectData>): Promise<ProjectData | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateProject:', error);
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    return false;
  }
}

export async function getSpendingByCategory(projectId?: string): Promise<SpendingData[]> {
  try {
    let query = supabase.from('expenses').select('category, amount');
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching spending data:', error);
      return [];
    }

    // Group by category and calculate totals
    const categoryTotals = data?.reduce((acc: Record<string, number>, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + (expense.amount || 0);
      return acc;
    }, {}) || {};

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
    }));
  } catch (error) {
    console.error('Error in getSpendingByCategory:', error);
    return [];
  }
}

export async function getRecentExpenses(projectId?: string, limit = 10): Promise<ExpenseData[]> {
  try {
    let query = supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching recent expenses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRecentExpenses:', error);
    return [];
  }
}

export async function createProject(projectData: Omit<ProjectData, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectData | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createProject:', error);
    return null;
  }
}

export async function addExpense(expenseData: Omit<ExpenseData, 'id'>): Promise<ExpenseData | null> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addExpense:', error);
    return null;
  }
}

// Dashboard stats
export async function getDashboardStats(userId?: string) {
  try {
    const projects = await getAllProjects(userId);
    const expenses = await getRecentExpenses();
    
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalBudget: 0,
      totalSpent: 0,
      budgetUtilization: 0
    };
  }
}



