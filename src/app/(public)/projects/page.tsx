'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import PublicProjectShowcase from '@/components/ui/PublicProjectShowcase';
import { Project } from '@/types/types';
import { 
  Home, 
  MapPin, 
  Calendar, 
  Eye, 
  Building2, 
  Search,
  Filter,
  Grid,
  List,
  ArrowRight,
  Star,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function PublicProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    location: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'فيلا الفخامة الحديثة',
        userId: 'user1',
        stage: 'التشطيبات النهائية',
        progress: 85,
        createdAt: '2024-01-15',
        updatedAt: '2024-07-15',
        description: 'فيلا فاخرة بتصميم عصري على مساحة 500 متر مربع',
        area: 500,
        projectType: 'residential',
        floorCount: 2,
        roomCount: 6,
        status: 'in_progress',
        location: 'الرياض - حي النرجس',
        startDate: '2024-01-01',
        endDate: '2024-08-30',
        publicDisplay: {
          isPublic: true,
          showLocation: true,
          showTimeline: true,
          showImages: true,
          hideCosts: true,
          description: 'فيلا عصرية فاخرة تتميز بالتصميم المعاصر والمواد عالية الجودة'
        },
        images: [
          {
            id: 'img1',
            projectId: '1',
            url: '/construction-images/villa-1.jpg',
            caption: 'واجهة الفيلا الرئيسية',
            phaseId: 'structure',
            uploadedAt: '2024-06-01',
            type: 'showcase',
            isPublic: true
          }
        ]
      },
      {
        id: '2',
        name: 'مجمع تجاري متطور',
        userId: 'user2',
        stage: 'الهيكل الإنشائي',
        progress: 60,
        createdAt: '2024-03-01',
        updatedAt: '2024-07-10',
        description: 'مجمع تجاري متكامل بمساحة 2000 متر مربع',
        area: 2000,
        projectType: 'commercial',
        floorCount: 3,
        roomCount: 20,
        status: 'in_progress',
        location: 'جدة - شارع التحلية',
        startDate: '2024-02-01',
        endDate: '2024-12-31',
        publicDisplay: {
          isPublic: true,
          showLocation: true,
          showTimeline: true,
          showImages: true,
          hideCosts: true,
          description: 'مجمع تجاري حديث يضم محلات ومكاتب بتقنيات ذكية'
        },
        images: []
      },
      {
        id: '3',
        name: 'شقق سكنية راقية',
        userId: 'user3',
        stage: 'مكتمل',
        progress: 100,
        createdAt: '2023-09-01',
        updatedAt: '2024-06-30',
        description: 'مبنى سكني يحتوي على 12 شقة فاخرة',
        area: 1200,
        projectType: 'residential',
        floorCount: 4,
        roomCount: 48,
        status: 'completed',
        location: 'الدمام - الكورنيش',
        startDate: '2023-08-01',
        endDate: '2024-06-30',
        publicDisplay: {
          isPublic: true,
          showLocation: true,
          showTimeline: true,
          showImages: true,
          hideCosts: true,
          description: 'مبنى سكني راقي بإطلالة على البحر وتشطيبات فاخرة'
        },
        images: []
      }
    ];
    
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const getProjectTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'villa': 'فيلا',
      'apartment': 'شقة',
      'commercial': 'تجاري',
      'residential': 'سكني',
      'office': 'مكتب'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      'planning': { label: 'التخطيط', color: 'bg-yellow-100 text-yellow-800' },
      'in-progress': { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800' },
      'completed': { label: 'مكتمل', color: 'bg-green-100 text-green-800' },
      'on-hold': { label: 'متوقف مؤقتاً', color: 'bg-gray-100 text-gray-800' }
    };
    return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const filteredProjects = projects.filter(project => {
    if (!project.publicDisplay?.isPublic) return false;
    
    if (filters.type !== 'all' && project.projectType !== filters.type) return false;
    if (filters.status !== 'all' && project.status !== filters.status) return false;
    if (filters.location !== 'all') {
      const locationString = typeof project.location === 'string' 
        ? project.location 
        : project.location?.address || '';
      if (!locationString.includes(filters.location)) return false;
    }
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8" dir="rtl">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedProject(null)}
              className="mb-4"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              العودة للمشاريع
            </Button>
          </div>
          <PublicProjectShowcase project={selectedProject} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8" dir="rtl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">معرض المشاريع</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            استكشف مجموعة متنوعة من المشاريع المعمارية المتميزة واحصل على الإلهام لمشروعك القادم
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ابحث عن المشاريع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="villa">فيلا</option>
                  <option value="residential">سكني</option>
                  <option value="commercial">تجاري</option>
                  <option value="office">مكتب</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="planning">التخطيط</option>
                  <option value="in-progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                </select>

                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">جميع المدن</option>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            عدد المشاريع: <span className="font-semibold">{filteredProjects.length}</span>
          </p>
        </div>

        {/* Projects Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => {
              const statusInfo = getStatusLabel(project.status);
              const mainImage = project.images?.find((img: any) => img.isPublic);
              
              return (
                <Card 
                  key={project.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="h-48 bg-gray-200 relative">
                    {mainImage ? (
                      <img
                        src={mainImage.url}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-white/80">
                        {project.progress}%
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {project.publicDisplay?.description || project.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span>{getProjectTypeLabel(project.projectType)}</span>
                        <span className="text-gray-400">•</span>
                        <Layers className="w-4 h-4 text-gray-500" />
                        <span>{project.area.toLocaleString('en-US')} م²</span>
                      </div>
                      
                      {project.publicDisplay?.showLocation && project.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{typeof project.location === 'string' ? project.location : project.location?.address}</span>
                        </div>
                      )}
                      
                      {project.publicDisplay?.showTimeline && project.startDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>بدء: {new Date(project.startDate).toLocaleDateString('en-US')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 500) + 100} مشاهدة</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                        عرض التفاصيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project: Project) => {
              const statusInfo = getStatusLabel(project.status);
              const mainImage = project.images?.find((img: any) => img.isPublic);
              
              return (
                <Card 
                  key={project.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                        {mainImage ? (
                          <img
                            src={mainImage.url}
                            alt={project.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded-lg">
                            <Building2 className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-xl">{project.name}</h3>
                          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                        </div>
                        
                        <p className="text-gray-600">
                          {project.publicDisplay?.description || project.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span>{getProjectTypeLabel(project.projectType)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Layers className="w-4 h-4" />
                            <span>{project.area.toLocaleString('en-US')} م²</span>
                          </div>
                          {project.publicDisplay?.showLocation && project.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{typeof project.location === 'string' ? project.location : project.location?.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>{project.progress}% مكتمل</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-500">جرب تغيير معايير البحث أو المرشحات</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-800 mb-3">
                هل تريد عرض مشروعك هنا؟
              </h3>
              <p className="text-blue-700 mb-6 max-w-md mx-auto">
                انضم إلى منصة بنّاء وابدأ في توثيق مشروعك ومشاركته مع الآخرين
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="px-8" onClick={() => alert('Button clicked')}>
                  ابدأ الآن مجاناً
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}





