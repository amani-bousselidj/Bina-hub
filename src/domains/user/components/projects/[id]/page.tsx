'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProjectDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const projectId = currentPath.split('/projects/')[1]?.split('/')[0];
    
    if (projectId) {
      const params = new URLSearchParams();
      params.set('view', 'true');
      params.set('projectId', projectId);
      params.set('enhanced', 'true');
      
      searchParams?.forEach((value, key) => {
        if (!params.has(key)) {
          params.set(key, value);
        }
      });

      router.replace('/user/projects/list?' + params.toString());
    } else {
      router.replace('/user/projects');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل تفاصيل المشروع...</p>
      </div>
    </div>
  );
}
