// Construction Ecosystem Manager
// Manages construction projects, contractors, and ecosystem data

export interface ConstructionProject {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  budget: number;
  startDate: Date;
  endDate?: Date;
  location: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  contractor?: string;
  progress: number; // 0-100
}

export interface Contractor {
  id: string;
  name: string;
  license: string;
  rating: number;
  specializations: string[];
  activeProjects: number;
  completedProjects: number;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface EcosystemMetrics {
  totalProjects: number;
  activeProjects: number;
  totalBudget: number;
  averageProjectDuration: number;
  topPerformingContractors: Contractor[];
  regionalDistribution: Record<string, number>;
}

class ConstructionEcosystemManager {
  private projects: Map<string, ConstructionProject> = new Map();
  private contractors: Map<string, Contractor> = new Map();

  // Project Management
  async createProject(projectData: Omit<ConstructionProject, 'id'>): Promise<ConstructionProject> {
    const id = this.generateId();
    const project: ConstructionProject = {
      id,
      ...projectData
    };
    
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: string): Promise<ConstructionProject | null> {
    return this.projects.get(id) || null;
  }

  async updateProject(id: string, updates: Partial<ConstructionProject>): Promise<ConstructionProject | null> {
    const project = this.projects.get(id);
    if (!project) return null;

    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getAllProjects(filters?: {
    status?: ConstructionProject['status'];
    city?: string;
    contractor?: string;
  }): Promise<ConstructionProject[]> {
    let projects = Array.from(this.projects.values());

    if (filters) {
      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.city) {
        projects = projects.filter(p => p.location.city === filters.city);
      }
      if (filters.contractor) {
        projects = projects.filter(p => p.contractor === filters.contractor);
      }
    }

    return projects;
  }

  // Contractor Management
  async registerContractor(contractorData: Omit<Contractor, 'id'>): Promise<Contractor> {
    const id = this.generateId();
    const contractor: Contractor = {
      id,
      ...contractorData
    };
    
    this.contractors.set(id, contractor);
    return contractor;
  }

  async getContractor(id: string): Promise<Contractor | null> {
    return this.contractors.get(id) || null;
  }

  async updateContractor(id: string, updates: Partial<Contractor>): Promise<Contractor | null> {
    const contractor = this.contractors.get(id);
    if (!contractor) return null;

    const updatedContractor = { ...contractor, ...updates };
    this.contractors.set(id, updatedContractor);
    return updatedContractor;
  }

  async searchContractors(criteria: {
    specialization?: string;
    minRating?: number;
    city?: string;
    maxActiveProjects?: number;
  }): Promise<Contractor[]> {
    let contractors = Array.from(this.contractors.values());

    if (criteria.specialization) {
      contractors = contractors.filter(c => 
        c.specializations.includes(criteria.specialization!)
      );
    }

    if (criteria.minRating) {
      contractors = contractors.filter(c => c.rating >= criteria.minRating!);
    }

    if (criteria.maxActiveProjects) {
      contractors = contractors.filter(c => c.activeProjects <= criteria.maxActiveProjects!);
    }

    return contractors.sort((a, b) => b.rating - a.rating);
  }

  // Analytics and Reporting
  async getEcosystemMetrics(): Promise<EcosystemMetrics> {
    const projects = Array.from(this.projects.values());
    const contractors = Array.from(this.contractors.values());

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

    // Calculate average project duration
    const completedProjects = projects.filter(p => p.status === 'completed' && p.endDate);
    const averageProjectDuration = completedProjects.length > 0 
      ? completedProjects.reduce((sum, p) => {
          const duration = p.endDate!.getTime() - p.startDate.getTime();
          return sum + (duration / (1000 * 60 * 60 * 24)); // Convert to days
        }, 0) / completedProjects.length
      : 0;

    // Top performing contractors
    const topPerformingContractors = contractors
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // Regional distribution
    const regionalDistribution: Record<string, number> = {};
    projects.forEach(project => {
      const region = project.location.country;
      regionalDistribution[region] = (regionalDistribution[region] || 0) + 1;
    });

    return {
      totalProjects,
      activeProjects,
      totalBudget,
      averageProjectDuration,
      topPerformingContractors,
      regionalDistribution
    };
  }

  async getProjectsByStatus(): Promise<Record<ConstructionProject['status'], number>> {
    const projects = Array.from(this.projects.values());
    const statusCounts: Record<ConstructionProject['status'], number> = {
      planning: 0,
      active: 0,
      completed: 0,
      'on-hold': 0
    };

    projects.forEach(project => {
      statusCounts[project.status]++;
    });

    return statusCounts;
  }

  async getBudgetAnalysis(): Promise<{
    totalBudget: number;
    averageBudget: number;
    budgetByStatus: Record<ConstructionProject['status'], number>;
    budgetByRegion: Record<string, number>;
  }> {
    const projects = Array.from(this.projects.values());
    
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const averageBudget = projects.length > 0 ? totalBudget / projects.length : 0;

    const budgetByStatus: Record<ConstructionProject['status'], number> = {
      planning: 0,
      active: 0,
      completed: 0,
      'on-hold': 0
    };

    const budgetByRegion: Record<string, number> = {};

    projects.forEach(project => {
      budgetByStatus[project.status] += project.budget;
      
      const region = project.location.country;
      budgetByRegion[region] = (budgetByRegion[region] || 0) + project.budget;
    });

    return {
      totalBudget,
      averageBudget,
      budgetByStatus,
      budgetByRegion
    };
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Seed data for development
  async seedData(): Promise<void> {
    // Sample contractors
    const sampleContractors: Omit<Contractor, 'id'>[] = [
      {
        name: "Al-Rashid Construction",
        license: "LIC-001-SAU",
        rating: 4.8,
        specializations: ["residential", "commercial"],
        activeProjects: 3,
        completedProjects: 25,
        contact: {
          email: "info@alrashid.sa",
          phone: "+966-11-123-4567",
          address: "Riyadh, Saudi Arabia"
        }
      },
      {
        name: "Emirates Building Co.",
        license: "LIC-002-UAE",
        rating: 4.6,
        specializations: ["commercial", "infrastructure"],
        activeProjects: 5,
        completedProjects: 18,
        contact: {
          email: "contact@emiratesbuilding.ae",
          phone: "+971-4-123-4567",
          address: "Dubai, UAE"
        }
      }
    ];

    for (const contractor of sampleContractors) {
      await this.registerContractor(contractor);
    }

    // Sample projects
    const sampleProjects: Omit<ConstructionProject, 'id'>[] = [
      {
        name: "Riyadh Business District",
        status: "active",
        budget: 500000000,
        startDate: new Date('2024-01-15'),
        location: {
          city: "Riyadh",
          country: "Saudi Arabia",
          coordinates: { lat: 24.7136, lng: 46.6753 }
        },
        progress: 35
      },
      {
        name: "Dubai Marina Tower",
        status: "planning",
        budget: 750000000,
        startDate: new Date('2024-06-01'),
        location: {
          city: "Dubai",
          country: "UAE",
          coordinates: { lat: 25.0770, lng: 55.1370 }
        },
        progress: 5
      }
    ];

    for (const project of sampleProjects) {
      await this.createProject(project);
    }
  }
}

// Export singleton instance
export const constructionEcosystemManager = new ConstructionEcosystemManager();

// Initialize with seed data in development
if (process.env.NODE_ENV === 'development') {
  constructionEcosystemManager.seedData().catch(console.error);
}

export default constructionEcosystemManager;


export { ConstructionEcosystemManager };


