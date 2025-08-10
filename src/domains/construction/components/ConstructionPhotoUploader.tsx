'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { 
  Camera, 
  Upload, 
  X, 
  Eye, 
  Download, 
  Plus,
  Image as ImageIcon,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';
import { ProjectImage } from '@/core/shared/types/types';

interface ConstructionPhotoUploaderProps {
  projectId: string;
  phaseId: string;
  stepId?: string;
  existingImages?: ProjectImage[];
  onImageUpload?: (images: ProjectImage[]) => void;
  onImageDelete?: (imageId: string) => void;
  allowPublicToggle?: boolean;
}

export default function ConstructionPhotoUploader({
  projectId,
  phaseId,
  stepId,
  existingImages = [],
  onImageUpload,
  onImageDelete,
  allowPublicToggle = true
}: ConstructionPhotoUploaderProps) {
  const [images, setImages] = useState<ProjectImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: ProjectImage[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        
        // Create image object
        const newImage: ProjectImage = {
          id: `temp-${Date.now()}-${i}`,
          projectId,
          url,
          phaseId,
          stepId,
          uploadedAt: new Date().toISOString(),
          type: 'progress',
          isPublic: false,
          caption: ''
        };

        newImages.push(newImage);
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImageUpload?.(updatedImages);

    } catch (error) {
      console.error('خطأ في رفع الصور:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const updateImageCaption = (imageId: string, caption: string) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, caption } : img
    );
    setImages(updatedImages);
    onImageUpload?.(updatedImages);
  };

  const toggleImagePublic = (imageId: string) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, isPublic: !img.isPublic } : img
    );
    setImages(updatedImages);
    onImageUpload?.(updatedImages);
  };

  const deleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    onImageDelete?.(imageId);
  };

  const phaseTitles: Record<string, string> = {
    'planning': 'مرحلة التخطيط',
    'excavation': 'مرحلة الحفريات',
    'foundation': 'مرحلة الأساسات',
    'structure': 'مرحلة الهيكل الإنشائي',
    'utilities': 'مرحلة المرافق',
    'finishing': 'مرحلة التشطيبات'
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            توثيق مراحل البناء بالصور
          </CardTitle>
          <p className="text-sm text-gray-600">
            {phaseTitles[phaseId] || 'مرحلة البناء'} - ارفع صور لتوثيق تقدم العمل
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-700">ارفع صور البناء</h4>
                <p className="text-sm text-gray-500 mt-1">
                  اسحب الصور هنا أو انقر لاختيار الملفات
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'جاري الرفع...' : 'اختيار صور'}
                </Button>
                
                {navigator.mediaDevices && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Open camera functionality
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    التقاط صورة
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-400">
                أنواع الملفات المدعومة: JPG, PNG, WebP (حتى 10MB لكل صورة)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* Uploaded Images */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              الصور المرفوعة ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.caption || 'صورة البناء'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {allowPublicToggle && (
                        <Button
                          size="sm"
                          variant={image.isPublic ? "default" : "outline"}
                          onClick={() => toggleImagePublic(image.id)}
                          className="h-8 w-8 p-0"
                          title={image.isPublic ? 'إخفاء من العرض العام' : 'إظهار في العرض العام'}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {image.isPublic && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-green-500 text-white text-xs">
                          عام
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">وصف الصورة:</label>
                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => updateImageCaption(image.id, e.target.value)}
                        placeholder="أضف وصفاً للصورة..."
                        className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{image.uploadedAt ? new Date(image.uploadedAt).toLocaleDateString('en-US') : 'No date'}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <Badge variant="outline" className="text-xs">
                        {image.type === 'progress' ? 'تقدم العمل' : 
                         image.type === 'milestone' ? 'معلم مهم' : 
                         image.type === 'documentation' ? 'توثيق' : 'عرض'}
                      </Badge>
                      
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => alert('Button clicked')}>
                        <Download className="w-3 h-3 mr-1" />
                        تحميل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            نصائح لتوثيق البناء بالصور
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• اتق صوراً واضحة في الإضاءة الجيدة</li>
            <li>• وثق كل مرحلة مهمة من مراحل البناء</li>
            <li>• أضف وصفاً مفيداً لكل صورة</li>
            <li>• التقط صوراً من زوايا مختلفة</li>
            <li>• احرص على إظهار التفاصيل المهمة</li>
            <li>• يمكنك مشاركة صور مختارة مع الجمهور</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}



