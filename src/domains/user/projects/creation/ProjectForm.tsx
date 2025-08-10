// Reusable ProjectForm component for both create and edit
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { projectTrackingService } from '@/services';

interface ProjectData {
  id?: string;
  name: string;
  location: string;
  budget: string | number;
  picture?: File | null;
  image?: File | null;
  level: string;
  progress?: number;
  createdAt?: string;
  area?: number;
  projectType?: string;
  floorCount?: number;
  roomCount?: number;
  status?: string;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectData>;
  onSuccess?: () => void;
  submitLabel?: string;
  onSubmit?: (data: ProjectData) => Promise<void>;
}

export default function ProjectForm({ initialData, onSuccess, submitLabel = 'Save Project', onSubmit }: ProjectFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    location: '',
    budget: '',
    picture: null,
    level: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) setProjectData((prev: ProjectData) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name.trim() || !projectData.location.trim() || !projectData.budget.toString().trim() || !projectData.level.trim()) {
      alert('Please fill all required fields.');
      return;
    }
    if (!user?.id) {
      alert('User not authenticated.');
      return;
    }
    setLoading(true);
    try {
      const project = {
        ...initialData,
        id: initialData?.id || crypto.randomUUID(),
        name: projectData.name,
        stage: projectData.level,
        progress: initialData?.progress || 0,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        area: initialData?.area || 0,
        projectType: initialData?.projectType || 'residential',
        floorCount: initialData?.floorCount || 1,
        roomCount: initialData?.roomCount || 1,
        status: initialData?.status || 'planning',
        location: projectData.location,
        budget: Number(projectData.budget),
      };
      await projectTrackingService.saveProject(project);
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{initialData ? 'Edit Project' : 'Create New Project'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1">Project Name *</label>
            <input 
              type="text" 
              className="w-full p-2 rounded bg-gray-800 border border-gray-700" 
              value={projectData.name} 
              onChange={(e) => setProjectData((prev: ProjectData) => ({ ...prev, name: e.target.value }))} 
              required 
            />
          </div>
          <div>
            <label className="block mb-1">Map Location *</label>
            <input 
              type="text" 
              className="w-full p-2 rounded bg-gray-800 border border-gray-700" 
              value={projectData.location} 
              onChange={(e) => setProjectData((prev: ProjectData) => ({ ...prev, location: e.target.value }))} 
              required 
              placeholder="Paste map link or address" 
            />
          </div>
          <div>
            <label className="block mb-1">Budget (SAR) *</label>
            <input 
              type="number" 
              className="w-full p-2 rounded bg-gray-800 border border-gray-700" 
              value={projectData.budget} 
              onChange={(e) => setProjectData((prev: ProjectData) => ({ ...prev, budget: Number(e.target.value) }))} 
              required 
            />
          </div>
          <div>
            <label className="block mb-1">Project Picture</label>
            <input 
              type="file" 
              accept="image/*" 
              className="w-full" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProjectData((prev: ProjectData) => ({ ...prev, image: file }));
                }
              }}
            />
          </div>
          <div>
            <label className="block mb-1">Level of Construction *</label>
            <select 
              className="w-full p-2 rounded bg-gray-800 border border-gray-700" 
              value={projectData.level} 
              onChange={(e) => setProjectData((prev: ProjectData) => ({ ...prev, level: e.target.value }))} 
              required
            >
              <option value="">Select level</option>
              <option value="planning">Planning</option>
              <option value="foundation">Foundation</option>
              <option value="structure">Structure</option>
              <option value="finishing">Finishing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Saving...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}


export { ProjectForm };



