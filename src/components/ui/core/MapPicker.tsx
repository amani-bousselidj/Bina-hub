// @ts-nocheck
// Simple MapPicker using browser geolocation (placeholder for real map integration)
import { useState } from 'react';

export default function MapPicker({ value, onChange }: { value?: { lat: number; lng: number } | null, onChange: (loc: { lat: number; lng: number }) => void }) {
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(value ?? null);
  const [loading, setLoading] = useState(false);

  const handleLocate = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLoc(coords);
        onChange(coords);
        setLoading(false);
      },
      () => {
        alert('تعذر تحديد الموقع');
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-2">
      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleLocate} disabled={loading}>
        {loading ? 'جاري تحديد الموقع...' : 'تحديد موقعي الحالي'}
      </button>
      {loc && <div className="text-sm text-gray-700">الإحداثيات: {loc.lat}, {loc.lng}</div>}
      <div className="text-xs text-gray-500">(سيتم استخدام هذه الإحداثيات لعرض متجرك على الخريطة للمستخدمين)</div>
    </div>
  );
}




