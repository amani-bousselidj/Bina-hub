import React from 'react';

export const VariantInventorySection = ({ variant }: { variant: any }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inventory</h3>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">
          Inventory management for variant {variant?.title || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export const InventorySectionPlaceholder = () => {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
      <div className="p-4 border rounded-lg">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};





