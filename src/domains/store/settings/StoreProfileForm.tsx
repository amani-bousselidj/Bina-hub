// @ts-nocheck
import { useState } from 'react';
import { EnhancedInput, Button } from '@/components/ui/enhanced-components';

export default function StoreProfileForm({ store, onSave }: { store: any, onSave: (data: any) => void }) {
  const [location, setLocation] = useState(store.location || null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setHasChanges(true);
      },
      () => alert('تعذر تحديد الموقع')
    );
  };

  const handleSave = () => {
    onSave({ location });
    setHasChanges(false);
    alert('تم حفظ التغييرات بنجاح');
  };

  return (
    <form dir="rtl" className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">ملف المتجر</h2>
      <EnhancedInput
        label="اسم المتجر"
        value={store.name}
        disabled
      />
      <div>
        <label className="block mb-2 font-medium">الموقع الجغرافي</label>
        <Button
          type="button"
          variant="primary"
          onClick={handleLocate}
        >
          حدد موقعي على الخريطة
        </Button>
        {location && (
          <div className="mt-2 text-sm text-gray-700">
            الإحداثيات: {location.lat}, {location.lng}
          </div>
        )}
      </div>
      <Button
        type="button"
        variant={hasChanges ? 'success' : 'secondary'}
        onClick={handleSave}
        disabled={!hasChanges}
        className="w-full"
      >
        حفظ التغييرات
      </Button>
    </form>
  );
}





