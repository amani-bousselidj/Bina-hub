import React from 'react';

interface GoogleMapsLocationPickerProps {
  onLocationSelected?: (location: { lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
  className?: string;
}

const GoogleMapsLocationPicker: React.FC<GoogleMapsLocationPickerProps> = ({ 
  onLocationSelected, 
  defaultLocation, 
  className = '' 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">منتقي الموقع</h3>
      <p className="text-gray-600">خريطة Google قيد التطوير</p>
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">خريطة تفاعلية قيد التطوير</span>
      </div>
    </div>
  );
};

export default GoogleMapsLocationPicker;


