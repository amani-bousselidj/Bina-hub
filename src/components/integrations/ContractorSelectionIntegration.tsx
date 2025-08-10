import React from 'react';

interface ContractorSelectionIntegrationProps {
  onContractorSelected?: (contractor: any) => void;
  className?: string;
}

const ContractorSelectionIntegration: React.FC<ContractorSelectionIntegrationProps> = ({ 
  onContractorSelected, 
  className = '' 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">تكامل اختيار المقاولين</h3>
      <p className="text-gray-600">هذا القسم قيد التطوير</p>
    </div>
  );
};

export default ContractorSelectionIntegration;


