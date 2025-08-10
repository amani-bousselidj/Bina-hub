import React from 'react';

interface ProjectPurchasesWarrantiesProps {
  projectId?: string;
  className?: string;
}

const ProjectPurchasesWarranties: React.FC<ProjectPurchasesWarrantiesProps> = ({ 
  projectId, 
  className = '' 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">مشتريات وضمانات المشروع</h3>
      <p className="text-gray-600">هذا القسم قيد التطوير</p>
    </div>
  );
};

export default ProjectPurchasesWarranties;


