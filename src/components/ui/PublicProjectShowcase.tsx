'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Home, 
  Layers, 
  Clock, 
  Image as ImageIcon,
  Eye,
  Share2,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Ruler
} from 'lucide-react';
import { Project, ProjectImage } from '@/core/shared/types/types';
import Link from 'next/link';

interface PublicProjectShowcaseProps {
  project: Project;
  showHeader?: boolean;
}

export default function PublicProjectShowcase({ project, showHeader = true }: PublicProjectShowcaseProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [views, setViews] = useState(Math.floor(Math.random() * 1000) + 100);

  // Filter public images only
  const publicImages = project.images?.filter(img => img.isPublic) || [];

  const getProjectTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'villa': 'فيلا',
      'apartment': 'شقة',
      'commercial': 'تجاري',
      'residential': 'سكني',
      'office': 'مكتب',
      'warehouse': 'مستودع'
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

  const nextImage = () => {
    setCurrentImageIndex((prev: any) => (prev + 1) % publicImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev: any) => (prev - 1 + publicImages.length) % publicImages.length);
  };

  const statusInfo = getStatusLabel(project.status);
  const duration = project.startDate && project.endDate 
    ? Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-blue-100 mt-1">
                مشروع {getProjectTypeLabel(project.projectType)} - {
                  typeof project.location === 'string' 
                    ? project.location 
                    : typeof project.location === 'object' && project.location?.address 
                    ? project.location.address 
                    : 'المملكة العربية السعودية'
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{views}</div>
                <div className="text-xs text-blue-200">مشاهدة</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={`border-white text-white hover:bg-white hover:text-blue-600 ${
                  liked ? 'bg-white text-blue-600' : ''
                }`}
              >
                <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'معجب' : 'إعجاب'}
              </Button>
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600" onClick={() => alert('Button clicked')}>
                <Share2 className="w-4 h-4 mr-1" />
                مشاركة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          {publicImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  معرض صور المشروع ({publicImages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={publicImages[currentImageIndex]?.url}
                      alt={publicImages[currentImageIndex]?.caption || 'صورة المشروع'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {publicImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {publicImages.length}
                  </div>
                </div>

                {publicImages[currentImageIndex]?.caption && (
                  <p className="text-sm text-gray-600 mt-3">
                    {publicImages[currentImageIndex].caption}
                  </p>
                )}

                {/* Thumbnail Navigation */}
                {publicImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {publicImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.caption || ''}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>وصف المشروع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {project.publicDisplay?.description || project.description || 
                  'مشروع بناء متميز يتم تنفيذه وفقاً لأحدث المعايير والمواصفات السعودية للبناء.'}
              </p>
            </CardContent>
          </Card>

          {/* Construction Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                تقدم البناء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>نسبة الإنجاز</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{project.progress}%</div>
                    <div className="text-sm text-gray-600">مكتمل</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-600">{100 - (project.progress || 0)}%</div>
                    <div className="text-sm text-gray-600">متبقي</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                معلومات المشروع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">النوع:</span>
                <Badge variant="outline">{getProjectTypeLabel(project.projectType)}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">الحالة:</span>
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">المساحة:</span>
                <span className="flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  {(project.area || 0).toLocaleString('en-US')} م²
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">الطوابق:</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  {project.floorCount}
                </span>
              </div>

              {project.roomCount && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الغرف:</span>
                  <span>{project.roomCount}</span>
                </div>
              )}

              {project.publicDisplay?.showLocation && project.location && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {typeof project.location === 'string' 
                      ? project.location 
                      : typeof project.location === 'object' && project.location?.address 
                      ? project.location.address 
                      : 'غير محدد'
                    }
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          {project.publicDisplay?.showTimeline && (project.startDate || project.endDate) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  الجدول الزمني
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.startDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-sm font-medium">تاريخ البدء</div>
                      <div className="text-sm text-gray-600">
                        {new Date(project.startDate).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                )}

                {project.endDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">تاريخ الانتهاء المتوقع</div>
                      <div className="text-sm text-gray-600">
                        {new Date(project.endDate).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                )}

                {duration && (
                  <div className="pt-2 border-t">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{duration}</div>
                      <div className="text-sm text-blue-600">يوم</div>
                      <div className="text-xs text-gray-600">مدة المشروع</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="bg-blue-50">
            <CardContent className="p-4 text-center space-y-3">
              <Users className="w-8 h-8 text-blue-600 mx-auto" />
              <h4 className="font-bold text-blue-800">هل تريد بناء مشروع مشابه؟</h4>
              <p className="text-sm text-blue-700">
                احصل على استشارة مجانية ومساعدة في التخطيط
              </p>
              <Link href="/auth/signup">
                <Button className="w-full" onClick={() => alert('Button clicked')}>
                  ابدأ مشروعك
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


