import React from 'react';

interface ConstructionProfileAdviceProps {
  userProfile?: any;
  className?: string;
}

const ConstructionProfileAdvice: React.FC<ConstructionProfileAdviceProps> = ({ 
  userProfile, 
  className = '' 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">نصائح الملف الإنشائي</h3>
      <p className="text-gray-600">نصائح الملف الإنشائي قيد التطوير</p>
    </div>
  );
};

export default ConstructionProfileAdvice;



