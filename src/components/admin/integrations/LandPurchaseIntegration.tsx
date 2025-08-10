import { constructionIntegrationService } from '@/services';
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LandListing } from '@/services';
import {
  Search, 
  MapPin, 
  DollarSign, 
  Eye, 
  Phone, 
  Mail, 
  ExternalLink,
  Filter,
  Ruler,
  Star,
  Navigation
} from 'lucide-react';

interface LandPurchaseIntegrationProps {
  projectId: string;
  onLandSelected?: (land: LandListing) => void;
}

export default function LandPurchaseIntegration({ projectId, onLandSelected }: LandPurchaseIntegrationProps) {
  const [listings, setListings] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLand, setSelectedLand] = useState<LandListing | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [filters, setFilters] = useState({
    location: '',
    minArea: '',
    maxArea: '',
    minPrice: '',
    maxPrice: '',
    type: 'all'
  });

  const searchLand = async () => {
    try {
      setLoading(true);
      const results = await constructionIntegrationService.searchLand({
        location: filters.location || undefined,
        minArea: filters.minArea ? parseInt(filters.minArea) : undefined,
        maxArea: filters.maxArea ? parseInt(filters.maxArea) : undefined,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        type: filters.type !== 'all' ? filters.type : undefined
      });
      setListings(results);
    } catch (error) {
      console.error('Error searching land:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLandSelect = (land: LandListing) => {
    setSelectedLand(land);
    if (onLandSelected) {
      onLandSelected(land);
    }
  };

  useEffect(() => {
    // Load initial listings
    searchLand();
  }, []);

  return (
    <div className="space-y-6">
      {/* Integration Header */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">تكامل مع منصة عقار السعودية</h3>
                <p className="text-sm text-blue-600">البحث عن الأراضي المتاحة للشراء</p>
              </div>
            </div>
            <a
              href="https://sa.aqar.fm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              زيارة الموقع
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث عن الأراضي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الموقع</label>
              <Input
                placeholder="الرياض، جدة، الدمام..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">نوع الأرض</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="land">أرض فضاء</option>
                <option value="villa">أرض فيلا</option>
                <option value="commercial">أرض تجارية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المساحة (متر مربع)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="من"
                  value={filters.minArea}
                  onChange={(e) => setFilters(prev => ({ ...prev, minArea: e.target.value }))}
                />
                <Input
                  placeholder="إلى"
                  value={filters.maxArea}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxArea: e.target.value }))}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">السعر (ريال سعودي)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="السعر الأدنى"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
                <Input
                  placeholder="السعر الأقصى"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={searchLand} disabled={loading} className="w-full">
                {loading ? 'جاري البحث...' : 'بحث'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((land) => (
          <Card key={land.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={land.images[0] || '/api/placeholder/300/200'}
                alt={land.title}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-blue-600">
                {land.type === 'land' && 'أرض فضاء'}
                {land.type === 'villa' && 'أرض فيلا'}
                {land.type === 'commercial' && 'أرض تجارية'}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{land.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{land.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ruler className="w-4 h-4" />
                  <span>{land.area.toLocaleString('en-US')} متر مربع</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{land.price.toLocaleString('en-US')} {land.currency}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {land.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {land.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{land.features.length - 3} المزيد
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Dialog open={showDetails && selectedLand?.id === land.id} onOpenChange={setShowDetails}>
                  <DialogTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedLand(land)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      التفاصيل
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{land.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Land Images */}
                      <div className="grid grid-cols-2 gap-2">
                        {land.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${land.title} ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>

                      {/* Land Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">معلومات الأرض</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>المساحة:</span>
                              <span>{land.area.toLocaleString('en-US')} م²</span>
                            </div>
                            <div className="flex justify-between">
                              <span>السعر:</span>
                              <span className="font-semibold text-green-600">
                                {land.price.toLocaleString('en-US')} {land.currency}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>سعر المتر:</span>
                              <span>{Math.round(land.price / land.area).toLocaleString('en-US')} {land.currency}/م²</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">معلومات التواصل</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{land.contact.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span dir="ltr">{land.contact.phone}</span>
                            </div>
                            {land.contact.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{land.contact.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="font-semibold mb-2">الوصف</h4>
                        <p className="text-sm text-gray-600">{land.description}</p>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-semibold mb-2">المميزات</h4>
                        <div className="flex flex-wrap gap-2">
                          {land.features.map((feature, index) => (
                            <Badge key={index} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Map */}
                      {land.coordinates && (
                        <div>
                          <h4 className="font-semibold mb-2">الموقع على الخريطة</h4>
                          <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <Navigation className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">
                                خط العرض: {land.coordinates.lat}<br />
                                خط الطول: {land.coordinates.lng}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          className="flex-1"
                          onClick={() => handleLandSelect(land)}
                        >
                          اختيار هذه الأرض
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => alert('Button clicked')}>
                          <Phone className="w-4 h-4 mr-2" />
                          اتصال
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  onClick={() => handleLandSelect(land)}
                  className="flex-1"
                >
                  اختيار
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {!loading && listings.length === 0 && (
        <Card className="p-8 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد أراضي متاحة</h3>
          <p className="text-gray-500 mb-4">لم نجد أراضي تطابق معايير البحث المحددة</p>
          <Button variant="outline" onClick={() => setFilters({
            location: '',
            minArea: '',
            maxArea: '',
            minPrice: '',
            maxPrice: '',
            type: 'all'
          })}>
            إعادة تعيين البحث
          </Button>
        </Card>
      )}

      {/* Selected Land Summary */}
      {selectedLand && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800">الأرض المختارة</h4>
                <p className="text-sm text-green-600">{selectedLand.title}</p>
                <p className="text-sm text-green-600">
                  {selectedLand.area.toLocaleString('en-US')} م² - {selectedLand.price.toLocaleString('en-US')} {selectedLand.currency}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLand(null)}
              >
                إلغاء الاختيار
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}





