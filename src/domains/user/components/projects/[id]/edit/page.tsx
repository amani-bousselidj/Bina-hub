'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the project ID from the URL
    const currentPath = window.location.pathname;
    const projectId = currentPath.split('/projects/')[1]?.split('/')[0];
    
    if (projectId) {
      // Redirect to unified page with edit parameters
      const params = new URLSearchParams();
      params.set('edit', 'true');
      params.set('editId', projectId);
      params.set('enhanced', 'true'); // Default to enhanced mode
      
      // Copy any existing parameters
      searchParams?.forEach((value, key) => {
        if (!params.has(key)) {
          params.set(key, value);
        }
      });

      // Redirect to unified page
      router.replace(`/user/projects/list?${params.toString()}`);
    } else {
      // If no project ID, redirect to projects list
      router.replace('/user/projects');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل صفحة تعديل المشروع...</p>
      </div>
    </div>
  );
}
