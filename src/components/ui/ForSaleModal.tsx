// ForSaleModal Component
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ForSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (saleData: {
    price: number;
    description: string;
    contactEmail: string;
    isNegotiable: boolean;
  }) => void;
  project: {
    id: string;
    title: string;
    completion_percentage?: number;
    budget?: number;
    spent?: number;
  };
}

export default function ForSaleModal({ isOpen, onClose, onSubmit, project }: ForSaleModalProps) {
  const [formData, setFormData] = useState({
    price: project.budget || 0,
    description: '',
    contactEmail: '',
    isNegotiable: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const suggestedPrice = project.spent ? Math.round(project.spent * 1.2) : project.budget || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>List Project for Sale</CardTitle>
          <p className="text-sm text-gray-600">
            Selling: <strong>{project.title}</strong>
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asking Price (USD)
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="Enter asking price"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
              )}
              {suggestedPrice > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Suggested price based on investment: ${suggestedPrice.toLocaleString('en-US')}
                  <button
                    type="button"
                    onClick={() => handleInputChange('price', suggestedPrice)}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    Use suggested
                  </button>
                </p>
              )}
            </div>

            {/* Negotiable */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.isNegotiable}
                onChange={(e) => handleInputChange('isNegotiable', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="negotiable" className="text-sm text-gray-700">
                Price is negotiable
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the project, its current state, what's included, etc."
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="Email for interested buyers"
                className={errors.contactEmail ? 'border-red-500' : ''}
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.contactEmail}</p>
              )}
            </div>

            {/* Project Stats */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Project Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {project.completion_percentage !== undefined && (
                  <div>Completion: {project.completion_percentage}%</div>
                )}
                {project.budget && (
                  <div>Original Budget: ${project.budget.toLocaleString('en-US')}</div>
                )}
                {project.spent && (
                  <div>Amount Invested: ${project.spent.toLocaleString('en-US')}</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                List for Sale
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
}



