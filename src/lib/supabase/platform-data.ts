// Platform Data Service
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function fetchAllWarehouses() {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }

  return data || [];
}

export async function fetchWarehouseById(id: string) {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching warehouse:', error);
    return null;
  }

  return data;
}


