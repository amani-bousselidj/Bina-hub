'use client';
import { constructionIntegrationService } from '@/services';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArchitecturalPlan } from '@/services';
import {
  Search, 
  Users, 
  DollarSign, 
  Eye, 
  Download, 
  ExternalLink,
  Filter,
  Ruler,
  Home,
  FileText,
  Star,
  CheckCircle
} from 'lucide-react';

interface ContractorSelectionIntegrationProps {
  projectId: string;
  projectArea?: number;
  projectType?: string;
  onPlanSelected?: (plan: ArchitecturalPlan) => void;
  onContractorSelected?: (contractor: any) => void;
}

export default function ContractorSelectionIntegration({ 
  projectId, 
  projectArea, 
  projectType, 
  onPlanSelected,
  onContractorSelected 
}: ContractorSelectionIntegrationProps) {
  const [plans, setPlans] = useState<ArchitecturalPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ArchitecturalPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'contractors'>('plans');
  
  const [filters, setFilters] = useState({
    buildingType: projectType || 'villa',
    minArea: projectArea ? projectArea - 50 : '',
    maxArea: projectArea ? projectArea + 50 : '',
    floors: '',
    bedrooms: ''
  });

  const searchPlans = async () => {
    try {
      setLoading(true);
      const results = await constructionIntegrationService.getArchitecturalPlans({
        buildingType: filters.buildingType as any,
        minArea: filters.minArea ? parseInt(filters.minArea.toString()) : undefined,
        maxArea: filters.maxArea ? parseInt(filters.maxArea.toString()) : undefined,
        floors: filters.floors ? parseInt(filters.floors) : undefined,
        bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined
      });
      setPlans(results);
    } catch (error) {
      console.error('Error searching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: ArchitecturalPlan) => {
    setSelectedPlan(plan);
    if (onPlanSelected) {
      onPlanSelected(plan);
    }
  };

  useEffect(() => {
    searchPlans();
  }, []);

  return (
    <div className="space-y-6">
      {/* Integration Header */}
      <Card className="border-l-4 border-l-purple-500 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">تكامل مع منصة ACKD</h3>
                <p className="text-sm text-purple-600">المخططات المعمارية الجاهزة والمقاولين المعتمدين</p>
              </div>
            </div>
            <a
              href="https://ackd.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-600 hover:underline text-sm"
            >
              زيارة الموقع
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'plans' 
              ? 'border-b-2 border-purple-500 text-purple-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('plans')}
        >
          المخططات المعمارية
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'contractors' 
              ? 'border-b-2 border-purple-500 text-purple-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('contractors')}
        >
          المقاولين المعتمدين
        </button>
      </div>

      {/* Architectural Plans Tab */}
      {activeTab === 'plans' && (
        <>
          {/* Search Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                البحث عن المخططات المعمارية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نوع المبنى</label>
                  <select
                    value={filters.buildingType}
                    onChange={(e) => setFilters(prev => ({ ...prev, buildingType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="villa">فيلا</option>
                    <option value="apartment">شقة</option>
                    <option value="commercial">تجاري</option>
                    <option value="chalet">شاليه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">عدد الأدوار</label>
                  <select
                    value={filters.floors}
                    onChange={(e) => setFilters(prev => ({ ...prev, floors: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">جميع الأدوار</option>
                    <option value="1">دور واحد</option>
                    <option value="2">دورين</option>
                    <option value="3">ثلاثة أدوار</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">عدد غرف النوم</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">جميع الغرف</option>
                    <option value="2">غرفتين</option>
                    <option value="3">3 غرف</option>
                    <option value="4">4 غرف</option>
                    <option value="5">5 غرف أو أكثر</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">المساحة (متر مربع)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="المساحة الدنيا"
                      value={filters.minArea}
                      onChange={(e) => setFilters(prev => ({ ...prev, minArea: e.target.value }))}
                    />
                    <Input
                      placeholder="المساحة القصوى"
                      value={filters.maxArea}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxArea: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={searchPlans} disabled={loading} className="w-full">
                    {loading ? 'جاري البحث...' : 'بحث'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={plan.images[0] || '/api/placeholder/300/200'}
                    alt={plan.nameAr}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-purple-600">
                    {plan.buildingType === 'villa' && 'فيلا'}
                    {plan.buildingType === 'apartment' && 'شقة'}
                    {plan.buildingType === 'commercial' && 'تجاري'}
                    {plan.buildingType === 'chalet' && 'شاليه'}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{plan.nameAr}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        المساحة:
                      </span>
                      <span className="font-semibold">{plan.area} م²</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        الأدوار:
                      </span>
                      <span>{plan.floors} دور</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>غرف النوم:</span>
                      <span>{plan.bedrooms} غرفة</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>دورات المياه:</span>
                      <span>{plan.bathrooms} دورة</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold text-purple-600">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        السعر:
                      </span>
                      <span>{plan.price.toLocaleString('en-US')} {plan.currency}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {plan.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.features.length - 3} المزيد
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={showPlanDetails && selectedPlan?.id === plan.id} onOpenChange={setShowPlanDetails}>
                      <DialogTrigger>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          التفاصيل
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{plan.nameAr}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Plan Images */}
                          <div className="grid grid-cols-2 gap-4">
                            {plan.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${plan.nameAr} ${index + 1}`}
                                className="w-full h-48 object-cover rounded"
                              />
                            ))}
                          </div>

                          {/* Plan Details */}
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">تفاصيل المخطط</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>النوع:</span>
                                  <span>{plan.buildingType === 'villa' ? 'فيلا' : plan.buildingType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>المساحة:</span>
                                  <span>{plan.area} م²</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>الأدوار:</span>
                                  <span>{plan.floors} دور</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>غرف النوم:</span>
                                  <span>{plan.bedrooms} غرفة</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>دورات المياه:</span>
                                  <span>{plan.bathrooms} دورة</span>
                                </div>
                                <div className="flex justify-between font-semibold text-purple-600">
                                  <span>السعر:</span>
                                  <span>{plan.price.toLocaleString('en-US')} {plan.currency}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">المواصفات</h4>
                              <div className="space-y-2 text-sm">
                                {Object.entries(plan.specifications).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="font-medium">{key}:</span>
                                    <p className="text-gray-600 mt-1">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h4 className="font-semibold mb-2">الوصف</h4>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                          </div>

                          {/* Features */}
                          <div>
                            <h4 className="font-semibold mb-2">المميزات</h4>
                            <div className="flex flex-wrap gap-2">
                              {plan.features.map((feature, index) => (
                                <Badge key={index} variant="outline">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Available Plans */}
                          <div>
                            <h4 className="font-semibold mb-3">المخططات المتاحة</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {plan.plans.map((planFile, index) => (
                                <Card key={index} className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-purple-600" />
                                      <div>
                                        <p className="text-sm font-medium">
                                          {planFile.type === 'floor-plan' && 'مخطط الأدوار'}
                                          {planFile.type === '3d-view' && 'منظور ثلاثي الأبعاد'}
                                          {planFile.type === 'section' && 'مقطع عرضي'}
                                          {planFile.type === 'elevation' && 'واجهات'}
                                        </p>
                                        <p className="text-xs text-gray-500">{planFile.format.toUpperCase()}</p>
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                                      <Download className="w-3 h-3 mr-1" />
                                      تحميل
                                    </Button>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              className="flex-1"
                              onClick={() => handlePlanSelect(plan)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              اختيار هذا المخطط
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => alert('Button clicked')}>
                              <Download className="w-4 h-4 mr-2" />
                              تحميل الملفات
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      onClick={() => handlePlanSelect(plan)}
                      className="flex-1"
                    >
                      اختيار
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Plans Found */}
          {!loading && plans.length === 0 && (
            <Card className="p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد مخططات متاحة</h3>
              <p className="text-gray-500 mb-4">لم نجد مخططات تطابق معايير البحث المحددة</p>
              <Button variant="outline" onClick={() => setFilters({
                buildingType: 'villa',
                minArea: '',
                maxArea: '',
                floors: '',
                bedrooms: ''
              })}>
                إعادة تعيين البحث
              </Button>
            </Card>
          )}
        </>
      )}

      {/* Contractors Tab */}
      {activeTab === 'contractors' && (
        <Card className="p-8 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">المقاولين المعتمدين</h3>
          <p className="text-gray-500 mb-4">قائمة بالمقاولين المعتمدين والمؤهلين لتنفيذ مشروعك</p>
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            عرض المقاولين المتاحين
          </Button>
        </Card>
      )}

      {/* Selected Plan Summary */}
      {selectedPlan && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800">المخطط المختار</h4>
                <p className="text-sm text-green-600">{selectedPlan.nameAr}</p>
                <p className="text-sm text-green-600">
                  {selectedPlan.area} م² - {selectedPlan.bedrooms} غرف نوم - {selectedPlan.price.toLocaleString('en-US')} {selectedPlan.currency}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPlan(null)}
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





