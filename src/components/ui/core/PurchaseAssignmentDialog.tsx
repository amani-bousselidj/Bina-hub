'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui';
import { Project, Order } from '@/core/shared/types/types';
import { ProjectPurchaseService, PurchaseAllocation } from '@/services/project-purchase';
import { 
  Package, 
  Calculator, 
  AlertCircle, 
  CheckCircle,
  Divide,
  Home
} from 'lucide-react';

interface PurchaseAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onAssign: (allocations: PurchaseAllocation[]) => Promise<void>;
}

export default function PurchaseAssignmentDialog({ 
  isOpen, 
  onClose, 
  order, 
  onAssign 
}: PurchaseAssignmentDialogProps) {
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [allocations, setAllocations] = useState<PurchaseAllocation[]>([]);
  const [assignmentMode, setAssignmentMode] = useState<'single' | 'multiple'>('single');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (order && availableProjects.length > 0) {
      // Initialize allocations
      if (assignmentMode === 'single') {
        setAllocations([]);
      } else {
        // Initialize with equal distribution
        const equalQuantity = Math.floor((order.items?.[0]?.quantity || 1) / availableProjects.length);
        const equalCost = Math.floor((order.total_amount || 0) / availableProjects.length);
        
        setAllocations(availableProjects.map(project => ({
          projectId: project.id,
          projectName: project.name,
          quantity: equalQuantity,
          cost: equalCost
        })));
      }
    }
  }, [order, availableProjects, assignmentMode]);

  const loadAvailableProjects = async () => {
    try {
      const projects = await ProjectPurchaseService.getAvailableProjects();
      setAvailableProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleSingleAssignment = async () => {
    if (!selectedProjectId || !order) return;

    const selectedProject = availableProjects.find(p => p.id === selectedProjectId);
    if (!selectedProject) return;

    const allocation: PurchaseAllocation = {
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      quantity: order.items?.[0]?.quantity || 1,
      cost: order.total_amount || 0
    };

    await onAssign([allocation]);
    onClose();
  };

  const handleMultipleAssignment = async () => {
    if (!order || allocations.length === 0) return;

    // Validate allocations
    const totalQuantity = allocations.reduce((sum, alloc) => sum + alloc.quantity, 0);
    const totalCost = allocations.reduce((sum, alloc) => sum + alloc.cost, 0);
    
    if (totalQuantity !== (order.items?.[0]?.quantity || 1)) {
      alert('مجموع الكميات يجب أن يساوي الكمية الإجمالية');
      return;
    }

    if (Math.abs(totalCost - (order?.total_amount || 0)) > 1) {
      alert('مجموع التكاليف يجب أن يساوي التكلفة الإجمالية');
      return;
    }

    await onAssign(allocations);
    onClose();
  };

  const updateAllocation = (projectId: string, field: 'quantity' | 'cost', value: number) => {
    setAllocations(prev => prev.map(alloc => 
      alloc.projectId === projectId 
        ? { ...alloc, [field]: value }
        : alloc
    ));
  };

  const getTotalAllocated = (field: 'quantity' | 'cost') => {
    return allocations.reduce((sum, alloc) => sum + alloc[field], 0);
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            تعيين المشتريات للمشاريع
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تفاصيل الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">المنتج</p>
                  <p className="font-medium">{order.items?.[0]?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الكمية</p>
                  <p className="font-medium">{order.items?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">التكلفة الإجمالية</p>
                  <p className="font-medium">{(order.total_amount || 0).toLocaleString('en-US')} ر.س</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">المورد</p>
                  <p className="font-medium">{order.supplier_name || 'غير محدد'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Mode Selection */}
          <div className="flex gap-4">
            <Button
              variant={assignmentMode === 'single' ? 'default' : 'outline'}
              onClick={() => setAssignmentMode('single')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              تعيين لمشروع واحد
            </Button>
            <Button
              variant={assignmentMode === 'multiple' ? 'default' : 'outline'}
              onClick={() => setAssignmentMode('multiple')}
              className="flex items-center gap-2"
            >
              <Divide className="w-4 h-4" />
              توزيع على عدة مشاريع
            </Button>
          </div>

          {/* Single Project Assignment */}
          {assignmentMode === 'single' && (
            <Card>
              <CardHeader>
                <CardTitle>اختيار المشروع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableProjects.map((project) => (
                    <Card 
                      key={project.id}
                      className={`cursor-pointer transition-colors ${
                        selectedProjectId === project.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <p className="text-xs text-gray-500">{project.area} متر مربع</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedProjectId && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">
                      سيتم تعيين المشتريات لمشروع: {availableProjects.find(p => p.id === selectedProjectId)?.name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Multiple Project Assignment */}
          {assignmentMode === 'multiple' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  توزيع المشتريات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableProjects.map((project) => {
                    const allocation = allocations.find(a => a.projectId === project.id);
                    return (
                      <div key={project.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <div>
                            <label className="text-xs text-gray-600">الكمية</label>
                            <Input
                              type="number"
                              min="0"
                              value={allocation?.quantity || 0}
                              onChange={(e) => updateAllocation(project.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">التكلفة</label>
                            <Input
                              type="number"
                              min="0"
                              value={allocation?.cost || 0}
                              onChange={(e) => updateAllocation(project.id, 'cost', parseFloat(e.target.value) || 0)}
                              className="w-24 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Allocation Summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">مجموع الكميات المخصصة</p>
                      <p className={`text-lg ${getTotalAllocated('quantity') === (order.items?.[0]?.quantity || 1) ? 'text-green-600' : 'text-red-600'}`}>
                        {getTotalAllocated('quantity')} / {order.items?.[0]?.quantity || 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">مجموع التكاليف المخصصة</p>
                      <p className={`text-lg ${Math.abs(getTotalAllocated('cost') - (order.total_amount || 0 || 0)) <= 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {getTotalAllocated('cost').toLocaleString('en-US')} / {(order.total_amount || 0 || 0).toLocaleString('en-US')} ر.س
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              onClick={assignmentMode === 'single' ? handleSingleAssignment : handleMultipleAssignment}
              disabled={assignmentMode === 'single' ? !selectedProjectId : allocations.length === 0}
            >
              تأكيد التعيين
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



