// @ts-nocheck
import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner } from '@/components/ui';
import type { Database } from '@/core/shared/types/database';

interface WarrantyClaimFormProps {
  warrantyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WarrantyClaimForm({
  warrantyId,
  onClose,
  onSuccess,
}: WarrantyClaimFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    type: 'repair',
    preferred_contact: 'email',
    contact_details: '',
    photos: [] as File[],
  });

  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Upload photos first if any
      const uploadedPhotos = [];
      for (const photo of formData.photos) {
        const { data, error } = await supabase.storage
          .from('warranty-claims')
          .upload(`${warrantyId}/${Date.now()}-${photo.name}`, photo);

        if (error) throw error;
        uploadedPhotos.push(data.path);
      }

      // Create the warranty claim
      const { error: claimError } = await supabase.from('warranty_claims').insert({
        warranty_id: warrantyId,
        user_id: user.data.user.id,
        description: formData.description,
        claim_type: formData.type,
        preferred_contact: formData.preferred_contact,
        contact_details: formData.contact_details,
        photos: uploadedPhotos,
        status: 'pending',
      });

      if (claimError) throw claimError;

      // Update warranty status
      const { error: updateError } = await supabase
        .from('warranties')
        .update({ status: 'claimed' })
        .eq('id', warrantyId);

      if (updateError) throw updateError;

      onSuccess();
    } catch (error) {
      console.error('Error submitting warranty claim:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit warranty claim');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev: any) => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files!)],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Submit Warranty Claim</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the issue in detail..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="repair">Repair</option>
            <option value="replace">Replacement</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Contact Method
          </label>
          <select
            value={formData.preferred_contact}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, preferred_contact: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Details</label>
          <input
            type="text"
            value={formData.contact_details}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, contact_details: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your contact details..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload photos</span>
                  <input
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
            </div>
          </div>

          {formData.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </Card>
  );
}




