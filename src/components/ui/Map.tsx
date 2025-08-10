// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  onLocationSelect?: (coords: Coordinates) => void;
  initialLocation?: Coordinates | null;
  readOnly?: boolean;
  showSearch?: boolean;
}

const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh coordinates

export default function Map({
  onLocationSelect,
  initialLocation = null,
  readOnly = false,
  showSearch = false,
}: MapProps) {
  const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(
    initialLocation || defaultCenter
  );
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (readOnly) return;

    const newPosition = {
      lat: e.latLng?.lat() || 0,
      lng: e.latLng?.lng() || 0,
    };

    setMarkerPosition(newPosition);
    onLocationSelect?.(newPosition);
  };

  const handlePlacesChanged = () => {
    if (!searchBox) return;

    const places = searchBox.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry?.location;

      if (location) {
        const newPosition = {
          lat: location.lat(),
          lng: location.lng(),
        };

        setMarkerPosition(newPosition);
        onLocationSelect?.(newPosition);
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={['places']}
    >
      <div className="relative w-full h-full">
        {showSearch && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <StandaloneSearchBox
              onLoad={(box) => setSearchBox(box)}
              onPlacesChanged={handlePlacesChanged}
            >
              <input
                type="text"
                placeholder="ابحث عن موقع..."
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </StandaloneSearchBox>
          </div>
        )}

        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={markerPosition || defaultCenter}
          zoom={13}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={!readOnly}
              onDragEnd={(e) => {
                const newPosition = {
                  lat: e.latLng?.lat() || 0,
                  lng: e.latLng?.lng() || 0,
                };
                setMarkerPosition(newPosition);
                onLocationSelect?.(newPosition);
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}




