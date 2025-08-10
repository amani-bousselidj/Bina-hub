'use client';

import { useState, useEffect } from 'react';
import { ProjectTrackingService } from '../services/project';

// Define our own types for the hook since the service has different interfaces
interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProjectFilters {
  status?: string;
  type?: string;
  city?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
}

interface ProjectSearchResult {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProjectTrackingService.getProjectById(projectId);
        if (data) {
          setProject({
            ...data,
            description: data.description || ''
          } as Project);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error, refetch: () => window.location.reload() };
}

export function useProjects(filters?: ProjectFilters) {
  const [data, setData] = useState<ProjectSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await ProjectTrackingService.getProjects();
        setData({
          data: result,
          total: result.length,
          page: 1,
          limit: result.length,
          hasMore: false
        } as ProjectSearchResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (projectData: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      const fullProjectData = {
        projectType: 'construction',
        userId: 'current_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...projectData
      } as any;
      const newProject = await ProjectTrackingService.saveProject(fullProjectData);
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}

export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      // Note: ProjectTrackingService doesn't have update method, using save instead
      const updatedProject = await ProjectTrackingService.saveProject(updates as any);
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProject, loading, error };
}

export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProject = async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      await ProjectTrackingService.deleteProject(projectId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProject, loading, error };
}


