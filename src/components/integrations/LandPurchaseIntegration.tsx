import React from 'react';

interface LandPurchaseIntegrationProps {
  onLandSelected?: (land: any) => void;
  className?: string;
}

const LandPurchaseIntegration: React.FC<LandPurchaseIntegrationProps> = ({ 
  onLandSelected, 
  className = '' 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">تكامل شراء الأراضي</h3>
      <p className="text-gray-600">هذا القسم قيد التطوير</p>
    </div>
  );
};

export default LandPurchaseIntegration;


