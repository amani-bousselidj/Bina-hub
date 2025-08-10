import React from 'react';

interface StoreSearchProps {
  onSelect?: (store: any) => void;
  onCancel?: () => void;
  selectedStore?: any;
  onStoreSelected?: (store: any) => void;
  className?: string;
}

const StoreSearch: React.FC<StoreSearchProps> = ({ 
  onSelect,
  onCancel,
  selectedStore,
  onStoreSelected, 
  className = '' 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">البحث عن المتجر</h3>
      <input 
        type="text" 
        placeholder="ابحث عن متجر..."
        className="w-full p-2 border rounded-md"
      />
    </div>
  );
};

export default StoreSearch;



