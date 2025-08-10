import { useState, useEffect } from 'react';
import { marketplaceService, Product, Category, Store, ProductFilters, PaginationOptions } from '../services/marketplace';

export function useProducts(
  filters: ProductFilters = {},
  pagination: PaginationOptions = {}
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketplaceService.getProducts(filters, pagination);
        setProducts(result.products);
        setTotal(result.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters), JSON.stringify(pagination)]);

  const refetch = async () => {
    const result = await marketplaceService.getProducts(filters, pagination);
    setProducts(result.products);
    setTotal(result.total);
    return result;
  };

  return {
    products,
    total,
    loading,
    error,
    refetch
  };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketplaceService.getProduct(productId);
        setProduct(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const refetch = async () => {
    if (!productId) return null;
    const result = await marketplaceService.getProduct(productId);
    setProduct(result);
    return result;
  };

  return {
    product,
    loading,
    error,
    refetch
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketplaceService.getCategories();
        setCategories(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const refetch = async () => {
    const result = await marketplaceService.getCategories();
    setCategories(result);
    return result;
  };

  return {
    categories,
    loading,
    error,
    refetch
  };
}

export function useCategory(categorySlug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) {
      setCategory(null);
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketplaceService.getCategory(categorySlug);
        setCategory(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  const refetch = async () => {
    if (!categorySlug) return null;
    const result = await marketplaceService.getCategory(categorySlug);
    setCategory(result);
    return result;
  };

  return {
    category,
    loading,
    error,
    refetch
  };
}

export function useStores(pagination: PaginationOptions = {}) {
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketplaceService.getStores(pagination);
        setStores(result.stores);
        setTotal(result.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stores');
        setStores([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [JSON.stringify(pagination)]);

  const refetch = async () => {
    const result = await marketplaceService.getStores(pagination);
    setStores(result.stores);
    setTotal(result.total);
    return result;
  };

  return {
    stores,
    total,
    loading,
    error,
    refetch
  };
}

export function useStore(storeId: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      setStore(null);
      setLoading(false);
      return;
    }

    const fetchStore = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketplaceService.getStore(storeId);
        setStore(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch store');
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const refetch = async () => {
    if (!storeId) return null;
    const result = await marketplaceService.getStore(storeId);
    setStore(result);
    return result;
  };

  return {
    store,
    loading,
    error,
    refetch
  };
}

export function useStoreProducts(
  storeId: string,
  filters: Omit<ProductFilters, 'storeId'> = {},
  pagination: PaginationOptions = {}
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      setProducts([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    const fetchStoreProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await marketplaceService.getStoreProducts(storeId, filters, pagination);
        setProducts(result.products);
        setTotal(result.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch store products');
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProducts();
  }, [storeId, JSON.stringify(filters), JSON.stringify(pagination)]);

  const refetch = async () => {
    if (!storeId) return { products: [], total: 0 };
    const result = await marketplaceService.getStoreProducts(storeId, filters, pagination);
    setProducts(result.products);
    setTotal(result.total);
    return result;
  };

  return {
    products,
    total,
    loading,
    error,
    refetch
  };
}


