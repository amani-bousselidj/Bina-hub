// @ts-nocheck
import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui';
import type { Database } from '@/core/shared/types/database';

interface WarrantyTransferFormProps {
  warrantyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WarrantyTransferForm({
  warrantyId,
  onClose,
  onSuccess,
}: WarrantyTransferFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipient_email: '',
    transfer_reason: '',
    recipient_name: '',
    recipient_phone: '',
  });

  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // First, verify if the recipient exists
      const { data: recipientData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.recipient_email)
        .single();

      if (userError || !recipientData) {
        throw new Error('Recipient user not found. They must register first.');
      }

      // Create a transfer request
      const { error: transferError } = await supabase.from('warranty_transfers').insert({
        warranty_id: warrantyId,
        from_user_id: user.data.user.id,
        to_user_id: recipientData.id,
        status: 'pending',
        transfer_reason: formData.transfer_reason,
        recipient_name: formData.recipient_name,
        recipient_phone: formData.recipient_phone,
      });

      if (transferError) throw transferError;

      // Update warranty status
      const { error: updateError } = await supabase
        .from('warranties')
        .update({ transfer_pending: true })
        .eq('id', warrantyId);

      if (updateError) throw updateError;

      onSuccess();
    } catch (error) {
      console.error('Error initiating warranty transfer:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate warranty transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Transfer Warranty</h2>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
          <input
            type="email"
            value={formData.recipient_email}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, recipient_email: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter recipient's email..."
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            The recipient must have a registered account on our platform.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
          <input
            type="text"
            value={formData.recipient_name}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, recipient_name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter recipient's name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Phone</label>
          <input
            type="tel"
            value={formData.recipient_phone}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, recipient_phone: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter recipient's phone number..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Reason</label>
          <textarea
            value={formData.transfer_reason}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, transfer_reason: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Explain why you're transferring this warranty..."
            required
          />
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
            {loading ? 'Initiating Transfer...' : 'Transfer Warranty'}
          </button>
        </div>
      </form>
    </Card>
  );
}




