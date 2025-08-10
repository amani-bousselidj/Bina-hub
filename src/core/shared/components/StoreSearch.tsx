import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, MapPin } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  location: string;
  rating: number;
  description?: string;
  phone?: string;
  category?: string;
  verified?: boolean;
}

interface StoreSearchProps {
  onSelect: (store: Store) => void;
  onCancel: () => void;
  selectedStore: Store | null;
}

export function StoreSearch({ onSelect, onCancel, selectedStore }: StoreSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Store[]>([]);

  const mockStores: Store[] = [
    { id: '1', name: 'متجر البناء الحديث', location: 'الرياض', rating: 4.5 },
    { id: '2', name: 'مركز مواد البناء', location: 'جدة', rating: 4.2 },
    { id: '3', name: 'أدوات البناء المتقدمة', location: 'الدمام', rating: 4.7 }
  ];

  const handleSearch = () => {
    const filtered = mockStores.filter(store => 
      store.name.includes(searchTerm) || store.location.includes(searchTerm)
    );
    setResults(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          البحث عن المتاجر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ابحث عن متجر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {results.map(store => (
              <div key={store.id} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{store.name}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {store.location}
                  </p>
                </div>
                <Button size="sm" onClick={() => onSelect(store)}>
                  اختيار
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
