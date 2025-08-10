import React from 'react';
import { MarketplaceProvider } from '@/domains/marketplace/components/MarketplaceProvider';
import { MarketplaceView } from '@/domains/marketplace/components/MarketplaceView';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AuthProvider } from '@/core/shared/auth/AuthProvider';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Following strategic vision: All data from Supabase (no hardcoded data)
async function getCategoryInfo(categoryId: string) {
  // TODO: Replace with actual Supabase query
  // const { data: category } = await supabase
  //   .from('categories')
  //   .select('*')
  //   .eq('id', categoryId)
  //   .single();
  
  // Mock category info for now - will be replaced with Supabase data
  const categoryMap: Record<string, { nameAr: string; nameEn: string; description: string }> = {
    'cement': { nameAr: 'الأسمنت', nameEn: 'Cement', description: 'منتجات الأسمنت وخلطات البناء' },
    'steel': { nameAr: 'الحديد', nameEn: 'Steel', description: 'حديد التسليح ومواد البناء المعدنية' },
    'blocks': { nameAr: 'البلوك', nameEn: 'Blocks', description: 'بلوك البناء والطوب' },
    'tiles': { nameAr: 'البلاط', nameEn: 'Tiles', description: 'بلاط وسيراميك' },
    'paint': { nameAr: 'الدهان', nameEn: 'Paint', description: 'دهانات وأصباغ' },
    'plumbing': { nameAr: 'السباكة', nameEn: 'Plumbing', description: 'مواد السباكة والأنابيب' },
    'electrical': { nameAr: 'الكهرباء', nameEn: 'Electrical', description: 'المواد الكهربائية والأسلاك' },
    'tools': { nameAr: 'الأدوات', nameEn: 'Tools', description: 'أدوات البناء والمعدات' },
    'safety': { nameAr: 'السلامة', nameEn: 'Safety', description: 'معدات السلامة والحماية' },
  };
  
  return categoryMap[categoryId] || { nameAr: 'فئة غير محددة', nameEn: 'Unknown Category', description: '' };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const categoryInfo = await getCategoryInfo(category);

  return (
    <AuthProvider>
      <MarketplaceProvider>
        <div className="container mx-auto p-4" dir="rtl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{categoryInfo.nameAr}</h1>
              {categoryInfo.description && (
                <p className="text-gray-600 mt-1">{categoryInfo.description}</p>
              )}
            </div>
            
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowRightIcon className="h-5 w-5" />
              العودة للسوق
            </Link>
          </div>
          
          <MarketplaceView showHeader={false} />
        </div>
      </MarketplaceProvider>
    </AuthProvider>
  );
}

export async function generateStaticParams() {
  // Following strategic vision: Data from Supabase
  // TODO: Replace with actual Supabase query
  // const { data: categories } = await supabase
  //   .from('categories')
  //   .select('id');
  
  const categories = [
    'cement', 'steel', 'blocks', 'tiles', 'paint', 
    'plumbing', 'electrical', 'tools', 'safety'
  ];
  
  return categories.map((category) => ({
    category,
  }));
}

