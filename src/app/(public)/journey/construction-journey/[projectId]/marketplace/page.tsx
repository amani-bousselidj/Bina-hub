'use client';

import React, { useState, useEffect } from 'react';
import { ProjectProductSelector } from '@components/project/ProjectProductSelector';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface ProjectMarketplacePageProps {}

export default function ProjectMarketplacePage({}: ProjectMarketplacePageProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;
  
  const [project, setProject] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock project data
      const mockProject = {
        id: projectId,
        name: 'مشروع فيلا الرياض الحديثة',
        description: 'بناء فيلا عصرية بمساحة 400 متر مربع في حي الملقا',
        status: 'في التنفيذ',
        currentPhase: {
          id: 'phase-3',
          name: 'مرحلة التشطيب والديكور',
          description: 'تشطيب الأعمال الداخلية وتركيب الديكورات',
          progress: 45,
        },
        phases: [
          { id: 'phase-1', name: 'مرحلة الأساسات', completed: true },
          { id: 'phase-2', name: 'مرحلة البناء الخرساني', completed: true },
          { id: 'phase-3', name: 'مرحلة التشطيب والديكور', active: true },
          { id: 'phase-4', name: 'مرحلة اللمسات الأخيرة', pending: true },
        ],
        startDate: new Date('2024-01-15'),
        expectedEndDate: new Date('2024-12-15'),
        contractor: {
          name: 'شركة البناء المتطورة',
          phone: '+966 50 123 4567',
        }
      };

      setProject(mockProject);
      setCurrentPhase(mockProject.currentPhase);
      setLoading(false);
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleProductsSelected = (selectedProducts: any[]) => {
    console.log('Products selected for project:', selectedProducts);
    
    // TODO: Save selected products to project phase
    // Navigate back to project dashboard
    router.push(`/construction-journey/${projectId}`);
  };

  const handleClose = () => {
    router.push(`/construction-journey/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المشروع...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">المشروع غير موجود</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على المشروع المطلوب</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProjectProductSelector
      projectId={projectId}
      phaseId={currentPhase?.id}
      phaseName={currentPhase?.name}
      onClose={handleClose}
      onProductsSelected={handleProductsSelected}
    />
  );
}

