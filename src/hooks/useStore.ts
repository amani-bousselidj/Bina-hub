'use client';

import { useState, useEffect } from 'react';
import { StoreService } from '../services/store';

// Define simplified types for the hook
interface Store {
  id: string;
  name: string;
  description: string;
  user_id: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface StoreProduct {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  created_at: string;
}

interface StoreFilters {
  category?: string;
  city?: string;
  rating?: number;
  search?: string;
  status?: string;
}

const storeService = new StoreService();

export function useStore(storeId: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchStore = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await storeService.getStore(storeId);
        setStore(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch store');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  return { store, loading, error, refetch: () => window.location.reload() };
}

export function useStores(filters?: StoreFilters) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);
        // Note: The actual service may not have filtering, this is a placeholder
        const data = await storeService.getStore('all') as any;
        setStores(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [filters]);

  return { stores, loading, error, refetch: () => window.location.reload() };
}

export function useStoreProducts(storeId: string) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await storeService.getStoreProducts(storeId);
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch store products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId]);

  return { products, loading, error, refetch: () => window.location.reload() };
}

export function useUpdateStore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStore = async (storeId: string, updates: Partial<Store>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedStore = await storeService.updateStore(storeId, updates);
      return updatedStore;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update store';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStore, loading, error };
}

export function useStoreAnalytics(storeId: string) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await storeService.getStoreAnalytics(storeId);
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch store analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [storeId]);

  return { analytics, loading, error, refetch: () => window.location.reload() };
}


