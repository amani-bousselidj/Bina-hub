import React from 'react';
import { MarketplaceProvider } from '@/domains/marketplace/components/MarketplaceProvider';
import { MarketplaceView } from '@/domains/marketplace/components/MarketplaceView';
import { ProjectOrderSummary } from '@/components/project/ProjectOrderSummary';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ProjectMarketplacePageProps {
  params: {
    projectId: string;
  };
}

// Following strategic vision: All data from Supabase (no hardcoded data)
async function getProjectPhase(projectId: string) {
  // TODO: Replace with actual Supabase query
  // const { data: project } = await supabase
  //   .from('projects')
  //   .select('*, phases(*)')
  //   .eq('id', projectId)
  //   .single();
  
  // Mock current phase for now - will be replaced with Supabase data
  return {
    currentPhase: {
      id: 'phase-1',
      name: 'التأسيس',
      nameEn: 'Foundation'
    }
  };
}

export default async function ProjectMarketplacePage({ 
  params 
}: ProjectMarketplacePageProps) {
  const { projectId } = params;
  const { currentPhase } = await getProjectPhase(projectId);
  
  return (
    <MarketplaceProvider projectId={projectId} phaseId={currentPhase?.id}>
      <div className="container mx-auto p-4" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">اختيار منتجات للمشروع</h1>
            {currentPhase && (
              <p className="text-gray-600 mt-1">
                المرحلة الحالية: {currentPhase.name}
              </p>
            )}
          </div>
          
          <Link
            href={`/user/projects/${projectId}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowRightIcon className="h-5 w-5" />
            العودة للمشروع
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MarketplaceView showHeader={false} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ProjectOrderSummary 
                projectId={projectId} 
                projectName="مشروع البناء"
                orders={[]}
                onCreateOrder={() => console.log('Create order')}
                onClearAll={() => console.log('Clear all')}
              />
            </div>
          </div>
        </div>
      </div>
    </MarketplaceProvider>
  );
}

