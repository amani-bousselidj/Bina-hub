'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, Truck, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { concreteSupplyService, ConcreteOrder, ConcreteType, ConcreteRequirement, ConcreteSupplier, DeliveryStatusInfo, DeliveryStatus } from '@/services';
import { toast } from 'sonner';

interface ConcreteSupplyIntegrationProps {
  projectId: string;
  onOrderPlaced?: (order: ConcreteOrder) => void;
}

export default function ConcreteSupplyIntegration({ 
  projectId, 
  onOrderPlaced 
}: ConcreteSupplyIntegrationProps) {
  const [currentStep, setCurrentStep] = useState<'calculate' | 'select' | 'order' | 'track'>('calculate');
  const [concreteTypes, setConcreteTypes] = useState<ConcreteType[]>([]);
  const [suppliers, setSuppliers] = useState<ConcreteSupplier[]>([]);
  const [requirements, setRequirements] = useState<ConcreteRequirement | null>(null);
  const [selectedType, setSelectedType] = useState<ConcreteType | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<ConcreteSupplier | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>('');
  const [currentOrder, setCurrentOrder] = useState<ConcreteOrder | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatusInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Project specifications form
  const [projectSpecs, setProjectSpecs] = useState({
    area: '',
    floors: '',
    structure_type: 'residential' as 'residential' | 'commercial' | 'industrial',
    foundation_type: 'slab' as 'slab' | 'strip' | 'pile',
    special_requirements: [] as string[]
  });

  useEffect(() => {
    loadConcreteTypes();
  }, []);

  const loadConcreteTypes = async () => {
    try {
      // Mock concrete types since service returns grades as strings
      const mockTypes: ConcreteType[] = [
        { id: '1', name: 'C20', strength: '20', description: 'خرسانة عادية' },
        { id: '2', name: 'C25', strength: '25', description: 'خرسانة متوسطة' },
        { id: '3', name: 'C30', strength: '30', description: 'خرسانة عالية' }
      ];
      setConcreteTypes(mockTypes);
    } catch (error) {
      toast.error('خطأ في تحميل أنواع الخرسانة');
    }
  };

  const calculateRequirements = async () => {
    if (!projectSpecs.area || !projectSpecs.floors) {
      toast.error('يرجى إدخال المساحة وعدد الطوابق');
      return;
    }

    setLoading(true);
    try {
      const specs = {
        area: parseFloat(projectSpecs.area),
        floors: parseInt(projectSpecs.floors),
        structure_type: projectSpecs.structure_type,
        foundation_type: projectSpecs.foundation_type,
        special_requirements: projectSpecs.special_requirements
      };

      // Calculate requirements based on project specs
      const mockOrder: ConcreteOrder = {
        id: `calc-${Date.now()}`,
        type: specs.structure_type,
        quantity: specs.area * 0.15, // rough estimate
        strength: 'C25',
        status: 'draft'
      };
      
      const calculatedPrice = await concreteSupplyService.calculatePrice(mockOrder);
      setRequirements({
        projectType: specs.structure_type,
        volume: specs.area * 0.15,
        strength: 'C25',
        deliveryDate: new Date(),
        location: 'الرياض'
      });
      
      // Load suppliers (mock data for now)
      const suppliersData: ConcreteSupplier[] = [];
      setSuppliers(suppliersData);
      
      setCurrentStep('select');
      toast.success('تم حساب المتطلبات بنجاح');
    } catch (error) {
      toast.error('خطأ في حساب المتطلبات');
    } finally {
      setLoading(false);
    }
  };

  const selectConcreteAndSupplier = (type: ConcreteType, supplier: ConcreteSupplier) => {
    setSelectedType(type);
    setSelectedSupplier(supplier);
    setCurrentStep('order');
  };

  const placeOrder = async () => {
    if (!selectedType || !selectedSupplier || !deliveryDate || !deliveryTimeSlot || !requirements) {
      toast.error('يرجى إكمال جميع البيانات المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const order: ConcreteOrder = {
        id: `order-${Date.now()}`,
        type: selectedType.name,
        quantity: requirements.volume,
        strength: selectedType.strength,
        delivery_date: deliveryDate,
        project_id: projectId,
        status: 'pending'
      };

      const success = await concreteSupplyService.submitOrder(order);
      setCurrentOrder({ ...order, id: order.id || 'generated-id' });
      setCurrentStep('track');
      
      onOrderPlaced?.(order);
      toast.success('تم تأكيد الطلب بنجاح');
    } catch (error) {
      toast.error('خطأ في تأكيد الطلب');
    } finally {
      setLoading(false);
    }
  };

  const trackDelivery = async () => {
    if (!currentOrder?.id) return;

    try {
      const trackingInfo = await concreteSupplyService.trackDelivery(currentOrder.id);
      setDeliveryStatus(trackingInfo);
    } catch (error) {
      toast.error('خطأ في تتبع التوصيل');
    }
  };

  useEffect(() => {
    if (currentStep === 'track' && currentOrder?.id) {
      trackDelivery();
      const interval = setInterval(trackDelivery, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [currentStep, currentOrder?.id]);

  const renderCalculationStep = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-6 w-6" />
          حساب متطلبات الخرسانة
        </CardTitle>
        <CardDescription>
          أدخل مواصفات المشروع لحساب كمية الخرسانة المطلوبة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area">المساحة (متر مربع)</Label>
            <Input
              id="area"
              type="number"
              placeholder="300"
              value={projectSpecs.area}
              onChange={(e) => setProjectSpecs(prev => ({ ...prev, area: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floors">عدد الطوابق</Label>
            <Input
              id="floors"
              type="number"
              placeholder="2"
              value={projectSpecs.floors}
              onChange={(e) => setProjectSpecs(prev => ({ ...prev, floors: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>نوع المبنى</Label>
            <Select 
              value={projectSpecs.structure_type} 
              onValueChange={(value: string) =>
                setProjectSpecs(prev => ({ 
                  ...prev, 
                  structure_type: value as 'residential' | 'commercial' | 'industrial'
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">سكني</SelectItem>
                <SelectItem value="commercial">تجاري</SelectItem>
                <SelectItem value="industrial">صناعي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>نوع الأساس</Label>
            <Select 
              value={projectSpecs.foundation_type} 
              onValueChange={(value: string) =>
                setProjectSpecs(prev => ({ 
                  ...prev, 
                  foundation_type: value as 'slab' | 'strip' | 'pile'
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slab">بلاطة مسطحة</SelectItem>
                <SelectItem value="strip">أساس شريطي</SelectItem>
                <SelectItem value="pile">أساس خوازيق</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={calculateRequirements} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'جاري الحساب...' : 'حساب المتطلبات'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderSelectionStep = () => {
    if (!requirements) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>نتائج الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {requirements.total_volume_cubic_meters} م³
                </div>
                <div className="text-sm text-gray-600">كمية الخرسانة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {requirements.recommended_grade}
                </div>
                <div className="text-sm text-gray-600">الدرجة المقترحة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(requirements.estimated_cost || 0).toLocaleString()} ريال
                </div>
                <div className="text-sm text-gray-600">التكلفة المقدرة</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اختيار نوع الخرسانة والمورد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {concreteTypes
                .filter(type => type.grade === requirements.recommended_grade)
                .map(type => (
                  <div key={type.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{type.name}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      <Badge variant="secondary">{type.grade}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      مقاومة الضغط: {type.compressive_strength} نيوتن/مم²
                    </div>
                    
                    <div className="space-y-2">
                      {suppliers.map(supplier => (
                        <div key={supplier.id} className="border rounded p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{supplier.company_name}</div>
                              <div className="text-sm text-gray-600">
                                {supplier.rating}⭐ • {supplier.truck_fleet_size} شاحنة
                              </div>
                            </div>
                            <Button 
                              onClick={() => selectConcreteAndSupplier(type, supplier)}
                              size="sm"
                            >
                              اختيار
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOrderStep = () => {
    if (!selectedType || !selectedSupplier || !requirements) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>تأكيد الطلب وجدولة التوصيل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">تفاصيل الخرسانة</h3>
              <div className="space-y-1 text-sm">
                <div>النوع: {selectedType.name}</div>
                <div>الدرجة: {selectedType.grade}</div>
                <div>الكمية: {requirements.total_volume_cubic_meters} م³</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">المورد</h3>
              <div className="space-y-1 text-sm">
                <div>{selectedSupplier.company_name}</div>
                <div>التقييم: {selectedSupplier.rating}⭐</div>
                <div>الهاتف: {selectedSupplier.contact_info?.phone || 'غير محدد'}</div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label>تاريخ التوصيل</Label>
                            <Popover content={
                <Calendar
                  selected={deliveryDate}
                  onSelect={(date: Date | undefined) => {
                    setDeliveryDate(date);
                    if (date && requirements) {
                      setRequirements({
                        ...requirements,
                        deliveryDate: date
                      });
                    }
                  }}
                />
              }>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                </Button>
              </Popover>
            </div>

            <div>
              <Label>فترة التوصيل</Label>
              <Select value={deliveryTimeSlot} onValueChange={setDeliveryTimeSlot}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="07:00-11:00">صباحاً (7:00 - 11:00)</SelectItem>
                  <SelectItem value="13:00-17:00">ظهراً (13:00 - 17:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">إجمالي التكلفة:</span>
              <span className="text-xl font-bold text-green-600">
                {requirements.estimated_cost?.toLocaleString() || '0'} ريال
              </span>
            </div>
          </div>

          <Button 
            onClick={placeOrder} 
            disabled={loading || !deliveryDate || !deliveryTimeSlot}
            className="w-full"
            size="lg"
          >
            {loading ? 'جاري التأكيد...' : 'تأكيد الطلب'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderTrackingStep = () => {
    if (!currentOrder || !deliveryStatus) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            تتبع التوصيل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">
              رقم الطلب: {currentOrder.id}
            </div>
            <Badge 
              variant={String(deliveryStatus) === 'delivered' ? 'default' : 'secondary'}
              className="px-4 py-2"
            >
              {String(deliveryStatus) === 'scheduled' && 'مجدول'}
              {String(deliveryStatus) === 'in_transit' && 'في الطريق'}
              {String(deliveryStatus) === 'delivered' && 'تم التوصيل'}
              {String(deliveryStatus) === 'delayed' && 'متأخر'}
            </Badge>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${String(deliveryStatus) === 'delivered' ? 100 : 50}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">الوصول المتوقع:</span>
              </div>
              <div className="text-sm text-gray-600">
                {format(new Date(Date.now() + 2 * 60 * 60 * 1000), 'PPP p', { locale: ar })}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="font-medium">موقع الشاحنة:</span>
              </div>
              <div className="text-sm text-gray-600">
                خط عرض: {(24.7136).toFixed(4)}
                <br />
                خط طول: {(46.6753).toFixed(4)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              فحوصات الجودة
            </h3>
            <div className="space-y-2">
              {/* Mock quality checks */}
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">فحص قوة الضغط</span>
                <Badge variant="default">نجح</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">فحص التشغيلية</span>
                <Badge variant="default">نجح</Badge>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="w-full"
          >
            طلب جديد
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">توريد الخرسانة</h1>
          <div className="flex gap-2">
            {['calculate', 'select', 'order', 'track'].map((step, index) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : index < ['calculate', 'select', 'order', 'track'].indexOf(currentStep)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentStep === 'calculate' && renderCalculationStep()}
      {currentStep === 'select' && renderSelectionStep()}
      {currentStep === 'order' && renderOrderStep()}
      {currentStep === 'track' && renderTrackingStep()}
    </div>
  );
}






