'use client';

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { MapPin, Search, Target, AlertTriangle } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  region?: string;
  country?: string;
}

interface GoogleMapsLocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 24.7136, // Riyadh, Saudi Arabia
  lng: 46.6753
};

const libraries: ("places")[] = ["places"];

export default function GoogleMapsLocationPicker({ 
  onLocationSelect, 
  initialLocation, 
  className = "" 
}: GoogleMapsLocationPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null);
  const [searchValue, setSearchValue] = useState(initialLocation?.address || '');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      // Reverse geocoding to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          const addressComponents = result.address_components;
          
          let city = '';
          let region = '';
          let country = '';
          
          addressComponents?.forEach(component => {
            const types = component.types;
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              region = component.long_name;
            }
            if (types.includes('country')) {
              country = component.long_name;
            }
          });

          const location: Location = {
            lat,
            lng,
            address: result.formatted_address,
            city,
            region,
            country
          };

          setSelectedLocation(location);
          setSearchValue(result.formatted_address);
          onLocationSelect(location);
        }
      });
    }
  }, [onLocationSelect]);

  const handleAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        let city = '';
        let region = '';
        let country = '';
        
        place.address_components?.forEach(component => {
          const types = component.types;
          if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            region = component.long_name;
          }
          if (types.includes('country')) {
            country = component.long_name;
          }
        });

        const location: Location = {
          lat,
          lng,
          address: place.formatted_address || place.name || '',
          city,
          region,
          country
        };

        setSelectedLocation(location);
        setSearchValue(location.address);
        onLocationSelect(location);

        // Center map on selected location
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocoding to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const result = results[0];
              const addressComponents = result.address_components;
              
              let city = '';
              let region = '';
              let country = '';
              
              addressComponents?.forEach(component => {
                const types = component.types;
                if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                  city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                  region = component.long_name;
                }
                if (types.includes('country')) {
                  country = component.long_name;
                }
              });

              const location: Location = {
                lat,
                lng,
                address: result.formatted_address,
                city,
                region,
                country
              };

              setSelectedLocation(location);
              setSearchValue(result.formatted_address);
              onLocationSelect(location);

              // Center map on current location
              if (map) {
                map.panTo({ lat, lng });
                map.setZoom(15);
              }
            }
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('تعذر الحصول على الموقع الحالي. يرجى تمكين خدمات الموقع.');
        }
      );
    } else {
      alert('متصفحك لا يدعم خدمات تحديد الموقع.');
    }
  };

  // Use environment variable for Google Maps API key
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  if (!googleMapsApiKey) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            اختيار الموقع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <p className="text-gray-600 mb-4">
              يرجى إضافة مفتاح Google Maps API لاستخدام خدمة تحديد الموقع
            </p>
            <Input
              placeholder="أدخل العنوان يدوياً"
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchValue(e.target.value);
                onLocationSelect({
                  lat: 0,
                  lng: 0,
                  address: e.target.value
                });
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
      language="ar"
      region="SA"
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            اختيار موقع المشروع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Autocomplete
                onLoad={handleAutocompleteLoad}
                onPlaceChanged={handlePlaceSelect}
              >
                <Input
                  type="text"
                  placeholder="ابحث عن العنوان أو المدينة..."
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                  className="w-full"
                />
              </Autocomplete>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              موقعي الحالي
            </Button>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden border">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : defaultCenter}
              zoom={selectedLocation ? 15 : 10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {selectedLocation && (
                <Marker
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                />
              )}
            </GoogleMap>
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-1" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-green-800">الموقع المحدد:</p>
                  <p className="text-green-700">{selectedLocation.address}</p>
                  {selectedLocation.city && (
                    <p className="text-green-600 text-xs">
                      المدينة: {selectedLocation.city}
                      {selectedLocation.region && `, ${selectedLocation.region}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 text-center">
            انقر على الخريطة لتحديد الموقع، أو استخدم البحث في الأعلى
          </div>
        </CardContent>
      </Card>
    </LoadScript>
  );
}


