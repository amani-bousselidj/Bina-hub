import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';

const supabaseClient = supabase;

interface VendorOnboardingData {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  commercialRegistration: string;
  taxNumber: string;
  businessType: string;
  address: string;
  bankAccount: string;
  documents: File[];
}

export function VendorOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<VendorOnboardingData>({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    commercialRegistration: '',
    taxNumber: '',
    businessType: '',
    address: '',
    bankAccount: '',
    documents: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabaseClient
        .from('vendor_onboarding')
        .insert([formData]);

      if (error) {
        throw new Error('Failed to submit application');
      }

      alert('Vendor application submitted successfully! We will review your application within 2-3 business days.');
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Business Name (Arabic)</label>
              <Input
                value={formData.businessName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="اسم الشركة"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Person</label>
              <Input
                value={formData.contactPerson}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="اسم الشخص المسؤول"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+966 5X XXX XXXX"
                required
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal Documentation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Registration Number</label>
              <Input
                value={formData.commercialRegistration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, commercialRegistration: e.target.value })}
                placeholder="1010XXXXXX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Number (VAT)</label>
              <Input
                value={formData.taxNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, taxNumber: e.target.value })}
                placeholder="30XXXXXXXXX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.businessType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, businessType: e.target.value })}
                required
              >
                <option value="">Select business type</option>
                <option value="retail">Retail Store</option>
                <option value="wholesale">Wholesale</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="construction">Construction</option>
                <option value="services">Services</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address & Banking</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
              <Input
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full business address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account (IBAN)</label>
              <Input
                value={formData.bankAccount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bankAccount: e.target.value })}
                placeholder="SA0380000000XXXXXXXXXX"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Upload</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Please upload the following documents:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Commercial Registration Certificate</li>
                <li>VAT Registration Certificate</li>
                <li>Bank Certificate (IBAN)</li>
                <li>Authorization Letter (if applicable)</li>
              </ul>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, documents: Array.from(e.target.files || []) })}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-2">Join Binna Marketplace</h2>
          <p className="text-gray-600 text-center">Start selling on Saudi Arabia's fastest-growing marketplace</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">Why sell on Binna?</h4>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>• Reach millions of Saudi customers</li>
            <li>• Lower commission rates than competitors</li>
            <li>• Free POS and inventory management tools</li>
            <li>• ZATCA-compliant invoicing included</li>
            <li>• 24/7 Arabic customer support</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default VendorOnboarding;



