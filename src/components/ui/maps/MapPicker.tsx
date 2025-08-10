// MapPicker Component
import React, { useState, useCallback } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onLocationSelect: (coordinates: Coordinates) => void;
  initialCoordinates?: Coordinates;
  className?: string;
}

export function MapPicker({ 
  onLocationSelect, 
  initialCoordinates = { lat: 25.2048, lng: 55.2708 }, // Dubai default
  className = '' 
}: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates>(initialCoordinates);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationClick = useCallback((lat: number, lng: number) => {
    const newCoordinates = { lat, lng };
    setSelectedLocation(newCoordinates);
    onLocationSelect(newCoordinates);
  }, [onLocationSelect]);

  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(coordinates);
          onLocationSelect(coordinates);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported');
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 flex gap-2">
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Getting Location...' : 'Use Current Location'}
        </button>
      </div>
      
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Map Placeholder</div>
          <div className="text-sm text-gray-600 mb-4">
            Selected Location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </div>
          <div className="text-xs text-gray-500">
            In a real implementation, this would show an interactive map
            <br />
            (Google Maps, Mapbox, etc.)
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border">
            <div className="text-sm font-medium mb-2">Quick Locations:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleLocationClick(25.2048, 55.2708)}
                className="p-2 bg-blue-100 rounded hover:bg-blue-200"
              >
                Dubai
              </button>
              <button
                onClick={() => handleLocationClick(24.7136, 46.6753)}
                className="p-2 bg-blue-100 rounded hover:bg-blue-200"
              >
                Riyadh
              </button>
              <button
                onClick={() => handleLocationClick(29.3117, 47.4818)}
                className="p-2 bg-blue-100 rounded hover:bg-blue-200"
              >
                Kuwait City
              </button>
              <button
                onClick={() => handleLocationClick(25.3548, 51.1839)}
                className="p-2 bg-blue-100 rounded hover:bg-blue-200"
              >
                Doha
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPicker;


