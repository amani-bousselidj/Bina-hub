import { constructionIntegrationService } from '@/services';
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InsuranceQuote } from '@/services';
import {
  Shield,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  FileText,
  CreditCard,
  ExternalLink,
  Star,
  Eye,
  GitCompare
} from 'lucide-react';

interface InsuranceIntegrationProps {
  projectId: string;
  projectValue: number;
  projectType: string;
  projectDuration: number;
  projectLocation: string;
  onInsuranceSelected?: (insurance: InsuranceQuote) => void;
}

export default function InsuranceIntegration({
  projectId,
  projectValue,
  projectType,
  projectDuration,
  projectLocation,
  onInsuranceSelected
}: InsuranceIntegrationProps) {
  const [quotes, setQuotes] = useState<InsuranceQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<InsuranceQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [comparing, setComparing] = useState<InsuranceQuote[]>([]);

  const loadInsuranceQuotes = async () => {
    try {
      setLoading(true);
      const results = await constructionIntegrationService.getInsuranceQuotes({
        projectValue,
        projectType,
        duration: projectDuration,
        location: projectLocation
      });
      setQuotes(results);
    } catch (error) {
      console.error('Error loading insurance quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSelect = (quote: InsuranceQuote) => {
    setSelectedQuote(quote);
    if (onInsuranceSelected) {
      onInsuranceSelected(quote);
    }
  };

  const toggleCompare = (quote: InsuranceQuote) => {
    setComparing(prev => {
      const isAlreadyComparing = prev.find(q => q.id === quote.id);
      if (isAlreadyComparing) {
        return prev.filter(q => q.id !== quote.id);
      } else if (prev.length < 3) {
        return [...prev, quote];
      } else {
        return prev;
      }
    });
  };

  const getInsuranceTypeLabel = (type: string) => {
    switch (type) {
      case 'comprehensive': return 'تأمين شامل';
      case 'construction': return 'تأمين البناء';
      case 'liability': return 'تأمين المسؤولية';
      default: return type;
    }
  };

  const getRiskCoverageColor = (coverage: number, projectValue: number) => {
    const percentage = (coverage / projectValue) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    loadInsuranceQuotes();
  }, [projectValue, projectType, projectDuration, projectLocation]);

  return (
    <div className="space-y-6">
      {/* Integration Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">التأمين التعاوني</h3>
                  <p className="text-xs text-blue-600">حلول تأمين شاملة للمشاريع</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">متصل</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">مالاذ للتأمين</h3>
                  <p className="text-xs text-green-600">متخصص في تأمين البناء</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">متصل</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Insurance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            ملخص متطلبات التأمين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{projectValue.toLocaleString('en-US')}</div>
              <div className="text-sm text-gray-600">قيمة المشروع (ريال)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{projectDuration}</div>
              <div className="text-sm text-gray-600">مدة المشروع (شهر)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getInsuranceTypeLabel(projectType)}</div>
              <div className="text-sm text-gray-600">نوع التأمين المطلوب</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{projectLocation}</div>
              <div className="text-sm text-gray-600">موقع المشروع</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Quotes */}
      {loading ? (
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">جاري تحميل عروض التأمين...</p>
        </Card>
      ) : (
        <>
          {/* Compare Section */}
          {comparing.length > 0 && (
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GitCompare className="w-5 h-5" />
                    مقارنة العروض ({comparing.length}/3)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setComparing([])}
                  >
                    مسح الكل
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comparing.map(quote => (
                    <div key={quote.id} className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">{quote.companyAr}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>التغطية:</span>
                          <span className="font-medium">{quote.coverage.toLocaleString('en-US')} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span>القسط السنوي:</span>
                          <span className="font-medium text-blue-600">{quote.premium.toLocaleString('en-US')} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span>النوع:</span>
                          <span>{getInsuranceTypeLabel(quote.type)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>المدة:</span>
                          <span>{quote.duration} شهر</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleQuoteSelect(quote)}
                      >
                        اختيار هذا العرض
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map((quote) => (
              <Card key={quote.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                selectedQuote?.id === quote.id ? 'ring-2 ring-green-500 bg-green-50' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{quote.companyAr}</h3>
                        <p className="text-sm text-gray-600">{quote.company}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {getInsuranceTypeLabel(quote.type)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xl font-bold text-green-600">
                        {quote.premium.toLocaleString('en-US')}
                      </div>
                      <div className="text-sm text-gray-600">القسط السنوي (ريال)</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className={`text-xl font-bold ${getRiskCoverageColor(quote.coverage, projectValue)}`}>
                        {Math.round((quote.coverage / projectValue) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">نسبة التغطية</div>
                    </div>
                  </div>

                  {/* Coverage Details */}
                  <div>
                    <h4 className="font-semibold mb-2">تفاصيل التغطية</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>مبلغ التغطية:</span>
                        <span className="font-medium">{quote.coverage.toLocaleString('en-US')} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مدة التأمين:</span>
                        <span>{quote.duration} شهر</span>
                      </div>
                      <div className="flex justify-between">
                        <span>القسط الشهري:</span>
                        <span className="text-blue-600">{Math.round(quote.premium / 12).toLocaleString('en-US')} ريال</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-2">المزايا المشمولة</h4>
                    <div className="space-y-1">
                      {quote.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {quote.features.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{quote.features.length - 3} مزايا إضافية
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{quote.contact.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Dialog open={showQuoteDetails && selectedQuote?.id === quote.id} onOpenChange={setShowQuoteDetails}>
                      <DialogTrigger>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          التفاصيل
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            {quote.companyAr} - عرض التأمين
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Quote Summary */}
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {quote.premium.toLocaleString('en-US')}
                                </div>
                                <div className="text-sm text-gray-600">القسط السنوي (ريال)</div>
                              </div>
                            </Card>
                            <Card className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {quote.coverage.toLocaleString('en-US')}
                                </div>
                                <div className="text-sm text-gray-600">مبلغ التغطية (ريال)</div>
                              </div>
                            </Card>
                          </div>

                          {/* Detailed Features */}
                          <div>
                            <h4 className="font-semibold mb-3">المزايا والتغطيات</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {quote.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exclusions */}
                          <div>
                            <h4 className="font-semibold mb-3">الاستثناءات</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {quote.exclusions.map((exclusion, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                  <span className="text-sm">{exclusion}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Terms */}
                          <div>
                            <h4 className="font-semibold mb-2">الشروط والأحكام</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {quote.terms}
                            </p>
                          </div>

                          {/* Contact Information */}
                          <div>
                            <h4 className="font-semibold mb-3">معلومات التواصل</h4>
                            <div className="bg-blue-50 p-4 rounded">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-blue-600" />
                                  <span>{quote.contact.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-blue-600" />
                                  <span dir="ltr">{quote.contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-blue-600" />
                                  <span>{quote.contact.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              className="flex-1"
                              onClick={() => handleQuoteSelect(quote)}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              اختيار هذا العرض
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
                      variant={comparing.find(q => q.id === quote.id) ? "default" : "outline"}
                      onClick={() => toggleCompare(quote)}
                      disabled={comparing.length >= 3 && !comparing.find(q => q.id === quote.id)}
                    >
                      <GitCompare className="w-4 h-4 mr-2" />
                      {comparing.find(q => q.id === quote.id) ? 'إلغاء المقارنة' : 'مقارنة'}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleQuoteSelect(quote)}
                      className="flex-1"
                    >
                      اختيار
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* No Quotes Found */}
      {!loading && quotes.length === 0 && (
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد عروض تأمين متاحة</h3>
          <p className="text-gray-500 mb-4">لم نتمكن من الحصول على عروض تأمين لمشروعك حالياً</p>
          <Button variant="outline" onClick={loadInsuranceQuotes}>
            إعادة المحاولة
          </Button>
        </Card>
      )}

      {/* Selected Insurance Summary */}
      {selectedQuote && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800">التأمين المختار</h4>
                <p className="text-sm text-green-600">{selectedQuote.companyAr}</p>
                <p className="text-sm text-green-600">
                  {getInsuranceTypeLabel(selectedQuote.type)} - {selectedQuote.premium.toLocaleString('en-US')} ريال/سنة
                </p>
              </div>
              <div className="text-left">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuote(null)}
                  className="mb-2"
                >
                  إلغاء الاختيار
                </Button>
                <div className="text-xs text-green-600">
                  تغطية {Math.round((selectedQuote.coverage / projectValue) * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}





