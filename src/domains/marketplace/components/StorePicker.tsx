"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Store } from 'lucide-react';

type Option = { id: string; name: string };

interface StorePickerProps {
  value?: string;
  onChange: (storeId: string | undefined) => void;
  category?: string;
  searchQuery?: string;
  className?: string;
}

export const StorePicker: React.FC<StorePickerProps> = ({
  value,
  onChange,
  category,
  searchQuery,
  className = ''
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category && category !== 'all') params.set('category', category);
        if (searchQuery) params.set('q', searchQuery);
        // Do not include storeId here; we want the full set for the current filters
        const res = await fetch(`/api/products${params.size ? `?${params.toString()}` : ''}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch products for stores: ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.products) ? data.products : [];
        const map = new Map<string, string>();
        for (const p of list) {
          if (p?.storeId && p?.storeName) {
            map.set(p.storeId, p.storeName);
          }
        }
        const unique: Option[] = Array.from(map.entries()).map(([id, name]) => ({ id, name }));
        // Sort alphabetically by name for UX
        unique.sort((a, b) => a.name.localeCompare(b.name));
        setOptions(unique);
      } catch (e) {
        // Silently ignore for a basic control; fallback shows no options
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [category, searchQuery]);

  const resolvedValue = useMemo(() => value || '', [value]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Store className="h-4 w-4 text-gray-500" />
      <select
        className="border rounded px-2 py-1 text-sm bg-white min-w-[220px]"
        value={resolvedValue}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={loading}
        aria-label="Select store"
      >
        <option value="">كل المتاجر</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
};

export default StorePicker;
