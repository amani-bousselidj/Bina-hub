'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign,
  Tag,
  Building,
  ChevronDown,
  ChevronLeft,
  Calendar
} from 'lucide-react';

export const dynamic = 'force-dynamic'

// Force dynamic rendering to avoid SSG auth context issues

interface Project {
  id: string;
  name: string;
  description: string;
  project_type: string;
  location: string;
  address?: string;
  city?: string;
  region?: string;
  plot_area?: number;
  building_area?: number;
  floors_count?: number;
  rooms_count?: number;
  bathrooms_count?: number;
  status: string;
  progress_percentage?: number;
  advertisement_number?: string;
  sale_price?: number;
  sale_description?: string;
  currency?: string;
  budget?: number;
  total_cost?: number;
  total_investment?: number;
  expected_profit?: number;
  profit_percentage?: number;
  target_price?: number;
  target_profit_percentage?: number;
  profit_amount?: number;
  start_date?: string;
  end_date?: string;
  completion_date?: string;
  created_at?: string;
  updated_at?: string;
  for_sale?: boolean;
  images?: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'for_sale' | 'showcase'>('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, filterType, filterLocation, priceRange]);

  const loadProjects = async () => {    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading projects from database...');
      console.log('🔗 Environment check:');
      console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');
      console.log('- Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
      console.log('- NODE_ENV:', process.env.NODE_ENV);
      
      // Check if supabase client is properly initialized
      if (!supabase) {
        console.error('❌ Supabase client not initialized');
        setError('Database client not initialized');
        return;
      }
      
      // Check environment variables are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const missingVars: string[] = [];
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        
        console.error('❌ Missing environment variables:', missingVars);
        setError(`Missing environment variables: ${missingVars.join(', ')}`);
        return;
      }
      
      // Try basic query first to test table access
      console.log('🔍 Step 1: Testing basic table access...');
      console.log('🔍 Attempting to connect to projects table...');
        let { data: basicData, error: basicError } = await supabase
        .from('projects')
        .select('id, name, status')
        .limit(5);
        
      // Enhanced error logging
      console.log('📊 Basic query result:', {
        data: basicData,
        error: basicError,
        errorType: typeof basicError,
        errorKeys: basicError ? Object.keys(basicError) : 'No error',
        errorString: basicError ? JSON.stringify(basicError) : 'No error'
      });
        
      if (basicError) {
        console.error('❌ Basic table access failed:', basicError);
        
        // Check if error is empty object
        if (basicError && typeof basicError === 'object' && Object.keys(basicError).length === 0) {
          console.log('⚠️ Error is empty object - this might indicate:');
          console.log('1. Projects table does not exist');
          console.log('2. Insufficient permissions');
          console.log('3. Network/connection issue');
          console.log('4. Invalid credentials');
          
          setError('Database access failed: Empty error response. The projects table may not exist or there may be a permissions issue.');
        } else {
          setError(`Cannot access projects table: ${basicError.message || 'Unknown database error'}`);
        }
        return;
      }
      
      console.log('✅ Basic table access successful, found', basicData?.length || 0, 'projects');
      
      // Try to get column information by querying one row with for-sale columns      console.log('🔍 Step 2: Testing for-sale columns...');
      const { data: columnTest, error: columnError } = await supabase
        .from('projects')
        .select('id, name, status, for_sale, target_price, total_investment')
        .limit(1);
        
      if (columnError) {
        console.log('⚠️ For-sale columns missing, using basic query only');
        console.log('Column error:', columnError.message);
          // Use basic columns only - map to expected Project structure
        const { data: basicProjects, error: basicProjectsError } = await supabase
          .from('projects')
          .select('id, name, description, status, location, project_type, completion_date, images, address, city, region')
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (basicProjectsError) {
          console.error('❌ Basic projects query failed:', basicProjectsError);
          setError(`Failed to load projects: ${basicProjectsError.message || 'Database query error'}`);
          return;
        }
        
        console.log('✅ Loaded projects with basic columns:', basicProjects?.length || 0);        // Map to Project interface
        const mappedProjects = (basicProjects || []).map(p => ({
          ...p,
          name: p.name || 'مشروع بدون اسم',
          for_sale: false,
          target_price: undefined,
          total_investment: 0,
          expected_profit: 0,
          city: p.city || p.location || 'غير محدد',
          region: p.region || 'غير محدد'
        }));
        
        setProjects(mappedProjects);
        setDebugInfo({
          totalProjects: mappedProjects.length,
          completedProjects: mappedProjects.length,
          forSaleProjects: 0,
          queryType: 'basic-columns-only',
          missingColumns: 'for_sale, target_price, total_investment',
          lastUpdated: new Date().toLocaleTimeString()
        });
        return;
      }
      
      // If for-sale columns exist, use full query
      console.log('✅ For-sale columns available, using full query');      let { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          status,
          total_investment,
          expected_profit,
          location,
          project_type,
          completion_date,
          images,
          address,
          city,
          region,
          for_sale,
          target_price,
          target_profit_percentage,
          profit_amount,
          sale_price,
          currency,
          budget,
          total_cost,
          profit_percentage,
          advertisement_number,
          sale_description
        `)
        .in('status', ['completed', 'for_sale'])
        .order('completion_date', { ascending: false })
        .limit(50);

      console.log('📊 Full query result:', { 
        dataLength: data?.length || 0, 
        error: error ? {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        } : null
      });

      if (error) {
        console.error('❌ Error loading projects:', error);
        setError(`Failed to load projects: ${error.message || error.details || 'Unknown database error'}`);
        return;
      }

      console.log('✅ Projects loaded successfully:', data?.length || 0);
        // Map the data to ensure consistent structure
      const mappedProjects = (data || []).map(p => ({
        ...p,
        name: p.name || 'مشروع بدون اسم',
        city: p.city || p.location || 'غير محدد',
        region: p.region || 'غير محدد'
      }));
      
      setProjects(mappedProjects);
      setDebugInfo({
        totalProjects: mappedProjects.length,
        completedProjects: mappedProjects.filter(p => p.status === 'completed').length,
        forSaleProjects: mappedProjects.filter(p => p.for_sale).length,
        queryType: 'full-query-with-for-sale-columns',
        lastUpdated: new Date().toLocaleTimeString()
      });
      
    } catch (err) {
      console.error('❌ Exception in loadProjects:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Unexpected error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.city?.toLowerCase().includes(query) ||
        project.region?.toLowerCase().includes(query) ||
        project.address?.toLowerCase().includes(query) ||
        project.sale_description?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType === 'for_sale') {
      filtered = filtered.filter(project => project.for_sale);
    } else if (filterType === 'showcase') {
      filtered = filtered.filter(project => !project.for_sale);
    }

    // Apply location filter
    if (filterLocation !== 'all') {
      filtered = filtered.filter(project => 
        project.city === filterLocation || project.region === filterLocation
      );
    }

    // Apply price filter (only for for-sale projects)
    if (priceRange !== 'all' && filterType !== 'showcase') {
      filtered = filtered.filter(project => {
        if (!project.for_sale || !project.sale_price) return false;
        
        const price = project.sale_price;
        switch (priceRange) {
          case 'low': return price < 500000;
          case 'medium': return price >= 500000 && price < 2000000;
          case 'high': return price >= 2000000;
          default: return true;
        }
      });
    }

    setFilteredProjects(filtered);
  };

  const formatPrice = (price: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area: number) => {
    return new Intl.NumberFormat('en-US').format(area);
  };

  const getProjectTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'villa': 'فيلا',
      'apartment': 'شقة',
      'commercial': 'تجاري',
      'office': 'مكتب',
      'warehouse': 'مستودع',
      'land': 'أرض',
      'other': 'أخرى'
    };
    return types[type] || type;
  };

  const getUniqueLocations = () => {
    const locations = new Set<string>();
    projects.forEach(project => {
      if (project.city) locations.add(project.city);
      if (project.region) locations.add(project.region);
    });
    return Array.from(locations).filter(Boolean).sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جارٍ تحميل المشاريع...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل المشاريع</h1>
          <p className="text-gray-600 mb-4">{error}</p>          <button
            onClick={loadProjects}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            إعادة المحاولة
          </button>
          <button
            onClick={async () => {
              console.log('🔍 Manual Debug Test Starting...');
              try {
                const testResult = await supabase
                  .from('projects')
                  .select('id, name, status')
                  .limit(3);
                console.log('🔍 Manual test result:', testResult);
                alert(`Test result: ${testResult.error ? 'Error: ' + testResult.error.message : 'Success! Found ' + (testResult.data?.length || 0) + ' projects'}`);              } catch (err: any) {
                console.error('🔍 Manual test error:', err);
                alert('Test failed: ' + (err?.message || 'Unknown error'));
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            اختبار قاعدة البيانات
          </button>
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Query Type: {debugInfo.queryType}</p>
              <p>Missing Columns: {debugInfo.missingColumns}</p>
              <p>Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/user/dashboard" className="hover:text-blue-600 transition-colors">
              لوحة التحكم
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href="/user/projects" className="hover:text-blue-600 transition-colors">
              المشاريع
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-gray-900 font-medium">سوق المشاريع</span>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">المشاريع</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              تصفح مجموعة مختارة من المشاريع المكتملة ومشاريع العقارات المتاحة للبيع
            </p>
          </div>
        </div>
      </div>      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="البحث في المشاريع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="flex-1 px-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع المشاريع</option>
                <option value="for_sale">مشاريع للبيع</option>
                <option value="showcase">مشاريع للعرض</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">فلاتر إضافية</span>
                <span className="sm:hidden">فلاتر</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t mt-3 sm:mt-4 pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">الموقع</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">جميع المواقع</option>
                  {getUniqueLocations().map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {filterType !== 'showcase' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">النطاق السعري</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">جميع الأسعار</option>
                    <option value="low">أقل من 500,000 ريال</option>
                    <option value="medium">500,000 - 2,000,000 ريال</option>
                    <option value="high">أكثر من 2,000,000 ريال</option>
                  </select>
                </div>
              )}

              <div className="flex items-end sm:col-span-1 lg:col-span-1">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterLocation('all');
                    setPriceRange('all');
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  مسح الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>        {/* Results Summary */}
        <div className="mb-4 sm:mb-6 px-1">
          <p className="text-sm sm:text-base text-gray-600">
            تم العثور على <span className="font-semibold">{filteredProjects.length}</span> مشروع
            {filterType === 'for_sale' && ' متاح للبيع'}
            {filterType === 'showcase' && ' للعرض'}
          </p>
          
          {/* Debug information */}
          {debugInfo && (
            <div className="mt-2 text-sm text-gray-500">
              إجمالي المشاريع المحملة: {projects.length} | 
              المشاريع المفلترة: {filteredProjects.length} |
              مشاريع مكتملة: {debugInfo.completedProjects} | 
              مشاريع للبيع: {debugInfo.forSaleProjects} | 
              نوع الاستعلام: {debugInfo.queryType} |
              آخر تحديث: {debugInfo.lastUpdated}
              {process.env.NODE_ENV === 'development' && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  Debug Mode
                </span>
              )}
            </div>
          )}
          
          {/* Refresh button for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={loadProjects}
              className="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              🔄 إعادة تحميل البيانات
            </button>
          )}
        </div>        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <Building className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">لا توجد مشاريع</h3>
            <p className="text-sm sm:text-base text-gray-600">لم يتم العثور على مشاريع تطابق معايير البحث المحددة</p>
            {debugInfo?.missingColumns && (
              <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-right">
                <p className="text-yellow-800 text-xs sm:text-sm">
                  <strong>ملاحظة للمطور:</strong> الأعمدة التالية مفقودة من قاعدة البيانات: {debugInfo.missingColumns}
                </p>
                <p className="text-yellow-700 text-xs mt-1">
                  قم بتطبيق migration للحصول على جميع المميزات
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow">
                {/* Project Image Placeholder */}
                <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-t-xl flex items-center justify-center">
                  <Building className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                </div>

                <div className="p-4 sm:p-6">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">{project.name}</h3>
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 ml-1 flex-shrink-0" />
                        <span className="truncate">{project.city}, {project.region}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 ml-1 flex-shrink-0" />
                        <span className="truncate">{getProjectTypeLabel(project.project_type)}</span>
                      </div>
                    </div>
                    {project.for_sale && project.sale_price && (
                      <div className="text-left ml-2 flex-shrink-0">
                        <div className="text-sm sm:text-lg font-bold text-green-600">
                          {formatPrice(project.sale_price, project.currency)}
                        </div>
                        {project.profit_percentage && (
                          <div className="text-xs text-gray-500">
                            ربح {project.profit_percentage}%
                          </div>
                        )}
                        <div className="text-xs text-gray-500">للبيع</div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {project.for_sale && project.sale_description 
                      ? project.sale_description 
                      : project.description
                    }
                  </p>

                  {/* Action Button */}
                  <Link
                    href={project.for_sale ? `/projects/for-sale/${project.id}` : `#`}
                    className="block w-full text-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {project.for_sale ? 'عرض التفاصيل' : 'مشروع للعرض'}
                  </Link>

                  {/* Project Tags */}
                  <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {project.for_sale && (
                        <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
                          للبيع
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        مكتمل
                      </span>
                    </div>
                    
                    {project.advertisement_number && (
                      <div className="text-xs text-gray-500 truncate">
                        رقم الإعلان: {project.advertisement_number}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}





