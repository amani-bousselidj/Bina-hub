import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';

interface Resource {
  id: string;
  name: string;
  type: 'material' | 'equipment' | 'labor';
  unit: string;
  costPerUnit: number;
  availableQuantity: number;
  allocatedQuantity: number;
  supplier?: string;
  location: string;
  status: 'available' | 'allocated' | 'maintenance' | 'unavailable';
}

interface LaborResource {
  id: string;
  name: string;
  skill: string;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'off-duty';
  currentProject?: string;
  certifications: string[];
}

export function ResourceManagement() {
  const [activeTab, setActiveTab] = useState<'materials' | 'equipment' | 'labor'>('materials');
  
  const materials: Resource[] = [
    {
      id: '1',
      name: 'أسمنت عادي',
      type: 'material',
      unit: 'طن',
      costPerUnit: 450,
      availableQuantity: 200,
      allocatedQuantity: 150,
      supplier: 'شركة أسمنت العربية',
      location: 'مستودع الرياض الرئيسي',
      status: 'available'
    },
    {
      id: '2',
      name: 'حديد تسليح 16مم',
      type: 'material',
      unit: 'طن',
      costPerUnit: 2800,
      availableQuantity: 50,
      allocatedQuantity: 45,
      supplier: 'مصنع حديد الخليج',
      location: 'مستودع الدمام',
      status: 'available'
    },
    {
      id: '3',
      name: 'بلاط سيراميك',
      type: 'material',
      unit: 'متر مربع',
      costPerUnit: 85,
      availableQuantity: 1000,
      allocatedQuantity: 800,
      supplier: 'شركة بلاط النجاح',
      location: 'مستودع جدة',
      status: 'available'
    }
  ];

  const equipment: Resource[] = [
    {
      id: '1',
      name: 'رافعة برجية 50 طن',
      type: 'equipment',
      unit: 'يوم',
      costPerUnit: 1500,
      availableQuantity: 3,
      allocatedQuantity: 2,
      location: 'موقع الرياض',
      status: 'allocated'
    },
    {
      id: '2',
      name: 'خلاطة خرسانة',
      type: 'equipment',
      unit: 'يوم',
      costPerUnit: 800,
      availableQuantity: 5,
      allocatedQuantity: 3,
      location: 'مستودع المعدات',
      status: 'available'
    }
  ];

  const laborForce: LaborResource[] = [
    {
      id: '1',
      name: 'أحمد محمد العتيبي',
      skill: 'مهندس مدني',
      hourlyRate: 150,
      availability: 'available',
      certifications: ['هندسة إنشائية', 'إدارة مشاريع', 'السلامة المهنية']
    },
    {
      id: '2',
      name: 'محمد علي الغامدي',
      skill: 'عامل بناء متخصص',
      hourlyRate: 80,
      availability: 'busy',
      currentProject: 'مجمع الرياض التجاري',
      certifications: ['السلامة المهنية', 'أعمال الحديد']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'allocated':
      case 'busy': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
      case 'off-duty': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderMaterials = () => (
    <div className="space-y-4">
      {materials.map((material) => (
        <Card key={material.id} className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{material.name}</h3>
              <p className="text-gray-600">Supplier: {material.supplier}</p>
              <p className="text-sm text-gray-500">Location: {material.location}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(material.status)}`}>
              {material.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="font-bold text-green-600">{material.availableQuantity} {material.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Allocated</p>
              <p className="font-bold text-blue-600">{material.allocatedQuantity} {material.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cost per Unit</p>
              <p className="font-bold">SAR {material.costPerUnit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="font-bold">SAR {(material.availableQuantity * material.costPerUnit).toLocaleString('en-US')}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => alert('Button clicked')}>Allocate</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Reorder</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Transfer</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>View History</Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-4">
      {equipment.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">Location: {item.location}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-600">Available Units</p>
              <p className="font-bold text-green-600">{item.availableQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">In Use</p>
              <p className="font-bold text-blue-600">{item.allocatedQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Rate</p>
              <p className="font-bold">SAR {item.costPerUnit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Utilization</p>
              <p className="font-bold">{Math.round((item.allocatedQuantity / item.availableQuantity) * 100)}%</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => alert('Button clicked')}>Schedule</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Maintenance</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Transfer</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>History</Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderLabor = () => (
    <div className="space-y-4">
      {laborForce.map((worker) => (
        <Card key={worker.id} className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{worker.name}</h3>
              <p className="text-gray-600">{worker.skill}</p>
              {worker.currentProject && (
                <p className="text-sm text-blue-600">Current: {worker.currentProject}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(worker.availability)}`}>
              {worker.availability}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-gray-600">Hourly Rate</p>
              <p className="font-bold">SAR {worker.hourlyRate}/hour</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Certifications</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {worker.certifications.map((cert, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => alert('Button clicked')}>Assign</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Schedule</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Performance</Button>
            <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>Contact</Button>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resource Management</h1>
        <Button onClick={() => alert('Button clicked')}>+ Add Resource</Button>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Materials Inventory</h3>
          <p className="text-2xl font-bold">SAR 2.8M</p>
          <p className="text-sm text-blue-600">85% utilized</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Equipment Utilization</h3>
          <p className="text-2xl font-bold">78%</p>
          <p className="text-sm text-green-600">Above target</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-600">Labor Efficiency</h3>
          <p className="text-2xl font-bold">92%</p>
          <p className="text-sm text-green-600">Excellent performance</p>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        {[
          { id: 'materials', label: 'Materials (مواد)', count: materials.length },
          { id: 'equipment', label: 'Equipment (معدات)', count: equipment.length },
          { id: 'labor', label: 'Labor (عمالة)', count: laborForce.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'materials' && renderMaterials()}
      {activeTab === 'equipment' && renderEquipment()}
      {activeTab === 'labor' && renderLabor()}
    </div>
  );
}

export default ResourceManagement;



